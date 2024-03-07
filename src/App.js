import './App.css';
import React from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import algosdk, { waitForConfirmation } from 'algosdk';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

// Ethereum provider
const provider = await detectEthereumProvider();

// Create the PeraWalletConnect instance outside the component
const peraWallet = new PeraWalletConnect();

const mnemonic = "idle oppose bronze obscure coyote bridge option unveil swim patrol beyond crisp auction chicken egg plate master proof hill example stone finish remind absorb elbow";
const logicSigBase64 = "BTEQgQQSMRQxABIQMRKBABIQRIEBQw==";

// connect to the algorand node
const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);
const indexerClient = new algosdk.Indexer('', 'https://testnet-idx.algonode.cloud', 443);

function App() {
  const [algorandAddress, setAlgorandAddress] = useState(null);
  const [ethereumAddress, setEthereumAddress] = useState(null);
  const [originPlatform, setOriginPlatform] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenData, setTokenData] = useState();

  const isConnectedToPeraWallet = !!algorandAddress;
  const isConnectedToMetaMask = !!ethereumAddress;

  useEffect(() => {
    // reconnect to session when the component is mounted
    peraWallet.reconnectSession().then((accounts) => {
      // Setup disconnect event listener
      peraWallet.connector?.on('disconnect', handleDisconnectAlgoWalletClick);

      if (accounts.length) {
        setAlgorandAddress(accounts[0]);
      }
    })

  }, []);

  // Construct LogicSig for AssetOptin in Algorand
  const constructLogicSig = () => {
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    const compiledProgram = new Uint8Array(Buffer.from(logicSigBase64, "base64"));
    let lsig = new algosdk.LogicSig(compiledProgram);
    const signedLogicSig = lsig.signProgram(account.sk);

    return signedLogicSig;
  };

  // Get Token information from Algorand 
  const checkTokenAlgorand = async () => {
    // const tokenData = await indexerClient.lookupAssetByID(tokenId).do();
    const tokenData = await algod.getApplicationByID(tokenId).do();
    setTokenData(tokenData);
  };

  // Get Token information from Ethereum 
  const checkTokenEthereum = () => {

  };

  // Based on user input, check for token data to ensure token existence 
  const check = async () => {
    if (originPlatform === 'algo') {
      checkTokenAlgorand();
    }
    else {
      checkTokenEthereum();
    }
  }

  // Swap token by burn one and create one
  const burnAsset = async () => {

  }

  // This form appears after token data is retrieved
  const burnAssetForm = (
    <React.Fragment>
      <Form.Control as="textarea" value={JSON.stringify(tokenData, undefined, 2)} rows={10} />
      <Button className="btn-wallet"
        onClick={burnAsset}>
        {originPlatform === "algo" ? "Swap for Ethereum Token" : "Swap for Algorand Token"}
      </Button>
    </React.Fragment>
  )

  //  This form appears when blockchain account is connected
  const checkAssetForm = (
    <React.Fragment>
      <Form.Label htmlFor="assetId">Token Identifier</Form.Label>
      <Form.Control
        type="text"
        id="assetId"
        aria-describedby="tokenIdInput"
        onChange={(e) => setTokenId(e.target.value)}
      />
      <Form.Select id="platform" aria-label="Default select example" onChange={(e) => setOriginPlatform(e.target.value)}>
        <option>Select origin platform</option>
        <option value="algo">Algorand</option>
        <option value="eth">Ethereum</option>
      </Form.Select>
      <Button className="btn-wallet"
        onClick={check}>
        {"Check"}
      </Button>
      {tokenData
        ? burnAssetForm
        : null
      }
    </React.Fragment>
  )

  return (
    <Container className='App-header'>
      <meta name="name" content="Token Swap" />
      <h1> Token Swap powered by SChare</h1>
      <Row>
        <Col>
          <Button className="btn-wallet"
            onClick={
              isConnectedToPeraWallet ? handleDisconnectAlgoWalletClick : handleConnectAlgoWalletClick
            }>
            {isConnectedToPeraWallet ? "Disconnect Algorand" : "Connect to Algorand Pera Wallet"}
          </Button>
        </Col>
        <Col>
          <Button className="btn-wallet"
            onClick={
              isConnectedToMetaMask ? handleDisconnectEthWalletClick : handleConnectEthWalletClick
            }>
            {isConnectedToMetaMask ? "Disconnect MetaMask" : "Connect to Etherem MetaMask"}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {algorandAddress && ethereumAddress
            ? checkAssetForm
            : null
          }
        </Col>
      </Row>
    </Container>
  );

  function handleConnectAlgoWalletClick() {
    peraWallet.connect().then((newAccounts) => {
      // setup the disconnect event listener
      peraWallet.connector?.on('disconnect', handleDisconnectAlgoWalletClick);

      setAlgorandAddress(newAccounts[0]);
    });
  }

  function handleDisconnectAlgoWalletClick() {
    peraWallet.disconnect();
    setAlgorandAddress(null);
  }

  async function handleDisconnectEthWalletClick() {
    await window.ethereum.request({ method: 'wallet_revokePermissions' })
  }

  async function handleConnectEthWalletClick() {
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((err) => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
    setEthereumAddress(accounts[0]);
  }

}

export default App;
