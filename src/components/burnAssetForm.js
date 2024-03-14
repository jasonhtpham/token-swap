import React, { useState } from 'react';
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import algosdk from 'algosdk';
import { API } from '../helpers';
import { onMessageListener, fetchToken } from "../firebase";

const mnemonic = "idle oppose bronze obscure coyote bridge option unveil swim patrol beyond crisp auction chicken egg plate master proof hill example stone finish remind absorb elbow";
const logicSigBase64 = "BTEQgQQSMRQxABIQMRKBABIQRIEBQw==";

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

  onMessageListener()
    .then((payload) => {
      payload.data.returnData = JSON.parse(payload.data.returnData);
      setNotificationData(payload.data);
      setOpen(true);
    })
    .catch((err) => console.log("failed: ", err)
    );

  const handleModalClose = () => setOpen(false);

  // Construct LogicSig for AssetOptin in Algorand
  const constructLogicSig = () => {
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    const compiledProgram = new Uint8Array(Buffer.from(logicSigBase64, "base64"));
    let lsig = new algosdk.LogicSig(compiledProgram);
    const signedLogicSig = lsig.signProgram(account.sk);

    return signedLogicSig;
  };

  // Swap token by burn one and create one
  const burnAsset = async () => {

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
      onClick={mintEthNFT}>
      {props.originPlatform === "algo" ? "Swap for Ethereum Token" : "Swap for Algorand Token"}
    </Button>
  </React.Fragment>)
}