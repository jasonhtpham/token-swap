import './App.css';
import React from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { CheckAssetForm } from './components/checkAssetForm';
import { fetchToken } from "./firebase";

// Ethereum provider
const provider = await detectEthereumProvider();

// Create the PeraWalletConnect instance outside the component
const peraWallet = new PeraWalletConnect();

function App() {
  const [algorandAddress, setAlgorandAddress] = useState(null);
  const [ethereumAddress, setEthereumAddress] = useState(null);

  const isConnectedToPeraWallet = !!algorandAddress;
  const isConnectedToMetaMask = !!ethereumAddress;

  useEffect(() => {
    fetchToken();
    // reconnect to session when the component is mounted
    peraWallet.reconnectSession().then((accounts) => {
      // Setup disconnect event listener
      peraWallet.connector?.on('disconnect', handleDisconnectAlgoWalletClick);

      if (accounts.length) {
        setAlgorandAddress(accounts[0]);
      }
    })

  }, []);

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
            ? <CheckAssetForm ethereumAddress={ethereumAddress} algorandAddress={algorandAddress} peraWallet={peraWallet} />
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
