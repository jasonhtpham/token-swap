import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import algosdk, { waitForConfirmation } from 'algosdk';
import { API } from '../helpers';
import { constructLogicSig } from '../helpers/utils/utils.js';
import { onMessageListener, fetchToken } from "../firebase";
import { PeraWalletConnect } from '@perawallet/connect';
import Web3 from 'web3';
import tokenABI from '../blockchain/tokenABI';
import detectEthereumProvider from '@metamask/detect-provider';

// connect to ethereum
const provider = await detectEthereumProvider();
const web3 = new Web3(provider || "ws://localhost:8545");

const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);
const peraWallet = new PeraWalletConnect();

export const BurnAssetForm = (props) => {
  const [notificationData, setNotificationData] = useState({});
  const [open, setOpen] = useState(false);

  const tokenDataObj = {
    "jobName": "",
    "serviceID": "",
    "firebaseMessagingToken": "",
    "datafileURL": {
      "url": "",
      "json": {
        assetName: "",
        assetUnitName: "",
        totalSupply: 0,
        decimals: 0,
        assetURL: "",
        receiver: ""
      }
    }
  }

  const handleModalClose = () => setOpen(false);

  // Burn source token when successfully minting
  const burnAsset = async () => {
    if (props.originPlatform === 'algo') {
      let params = await algod.getTransactionParams().do();

      const txn = algosdk.makeAssetDestroyTxnWithSuggestedParams(
        props.algorandAddress,
        undefined,
        props.tokenId,
        params,
        undefined
      );
      try {
        const signedTxn = await peraWallet.signTransaction([{ txn: txn, signers: [props.algorandAddress] }]);

        const { txId } = await algod.sendRawTransaction(signedTxn).do();

        const result = await waitForConfirmation(algod, txId, 3);

        console.log(result);
      } catch (err) {
        console.error(err);
      };
    } else {
      const tokenContract = new web3.eth.Contract(tokenABI, props.tokenId);
      tokenContract.methods.burn(1).call({ from: props.ethereumAdress }).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  onMessageListener()
    .then((payload) => {
      payload.data.returnData = JSON.parse(payload.data.returnData);
      setNotificationData(payload.data);
      setOpen(true);
      if (payload.data.status === "SUCCESS") {
        console.log(payload.data);
        // burnAsset();
      }
    })
    .catch((err) => console.log("failed: ", err)
    );

  const mintAlgoNFT = async () => {
    const SERVICE_ID = "65ee7d1e52792c01607abfa5";
    const JOB_NAME = "mintAlgoNFT"

    tokenDataObj.jobName = JOB_NAME;
    tokenDataObj.serviceID = SERVICE_ID;
    tokenDataObj.firebaseMessagingToken = await fetchToken();
    let signedLogicSig = constructLogicSig();



    tokenDataObj.datafileURL.json.assetName = props.tokenData.params.name;
    tokenDataObj.datafileURL.json.assetUnitName = props.tokenData.params.unitName;
    tokenDataObj.datafileURL.json.totalSupply = props.tokenData.params.total;
    tokenDataObj.datafileURL.json.decimals = props.tokenData.params.decimals;
    tokenDataObj.datafileURL.json.assetURL = props.tokenData.params.url ?? "";
    tokenDataObj.datafileURL.json.receiver = props.algorandAddress;
    tokenDataObj.datafileURL.json.signedLogicSig = Array.from(signedLogicSig);

    const result = await API.createJob(tokenDataObj);
    if (result.success) {
      console.log("Result", result);
      props.setTokenData({})
    }
  }

  const mintEthNFT = async () => {
    const SERVICE_ID = "65efa9eb52792c01607abfc3";
    const JOB_NAME = "mintEthNFT"

    tokenDataObj.jobName = JOB_NAME;
    tokenDataObj.serviceID = SERVICE_ID;

    tokenDataObj.firebaseMessagingToken = await fetchToken();

    tokenDataObj.datafileURL.json.assetName = props.tokenData.params.name;
    tokenDataObj.datafileURL.json.assetUnitName = props.tokenData.params["unit-name"];
    tokenDataObj.datafileURL.json.totalSupply = props.tokenData.params.total;
    tokenDataObj.datafileURL.json.decimals = props.tokenData.params.decimals;
    tokenDataObj.datafileURL.json.assetURL = props.tokenData.params.url ?? "";
    tokenDataObj.datafileURL.json.receiver = props.ethereumAddress;

    const result = await API.createJob(tokenDataObj);
    if (result.success) {
      console.log("Result", result);
      props.setTokenData({})
    }
  }

  return (<React.Fragment>
    <Modal show={open} onHide={handleModalClose}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Token Swap Result</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <p>The swap was {notificationData.status}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Your new token identifier on {props.originPlatform === "algo" ? "Ethereum" : "Algorand"} is {notificationData.returnData?.nftContractAddress}
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  href={props.originPlatform === "algo" ?
                    `https://sepolia.etherscan.io/address/${notificationData.returnData?.nftContractAddress}`
                    : `https://testnet.explorer.perawallet.app/asset/${notificationData.returnData?.nftContractAddress}`}
                  target="_blank"
                  className="mt-3">
                  Token details on Explorer
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
    <Form.Control as="textarea" readOnly={true} value={JSON.stringify(props.tokenData, undefined, 2)} rows={10} />
    <Button className="btn-wallet"
      onClick={props.originPlatform === "algo" ? mintEthNFT : mintAlgoNFT}>
      {props.originPlatform === "algo" ? "Swap for Ethereum Token" : "Swap for Algorand Token"}
    </Button>
  </React.Fragment>)
}