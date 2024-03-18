import React from 'react';
import algosdk from 'algosdk';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { BurnAssetForm } from './burnAssetForm';
import Web3 from 'web3';
import tokenABI from '../blockchain/tokenABI';
import detectEthereumProvider from '@metamask/detect-provider';

// connect to ethereum
const provider = await detectEthereumProvider();
const web3 = new Web3(provider || "ws://localhost:8545");

// connect to the algorand node
const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);

export const CheckAssetForm = (props) => {
  const [tokenId, setTokenId] = useState("");
  const [tokenData, setTokenData] = useState({});
  const [originPlatform, setOriginPlatform] = useState("");

  // Get Token information from Algorand 
  const checkTokenAlgorand = async () => {
    const _tokenData = await algod.getAssetByID(tokenId).do();
    setTokenData(_tokenData);
  };

  // Get Token information from Ethereum 
  const checkTokenEthereum = async () => {
    const ethAddressRegEx = new RegExp(/^(0x)?[0-9a-fA-F]{40}$/);
    if (!ethAddressRegEx.test(tokenId)) {
      alert("Invalid Ethereum Address");
      return;
    }

    const tokenContract = new web3.eth.Contract(tokenABI, tokenId);
    const _tokenData = {
      params: {
        total: 1,
        decimals: 0,
        name: "",
        symbol: "",
        url: "",
        owner: "",
      }
    };

    try {
      _tokenData.params.name = await tokenContract.methods.name().call({ from: props.ethereumAdress });
      _tokenData.params.symbol = await tokenContract.methods.symbol().call({ from: props.ethereumAdress });
      _tokenData.params.url = await tokenContract.methods.tokenURI(1).call({ from: props.ethereumAdress });
      _tokenData.params.owner = await tokenContract.methods.ownerOf(1).call({ from: props.ethereumAdress });
    } catch (err) {
      console.err(err);
    }

    setTokenData(_tokenData);
  };

  // Based on user input, check for token data to ensure token existence 
  const check = async () => {
    if (originPlatform === 'algo') {
      checkTokenAlgorand();
    }
    else {
      await checkTokenEthereum();
    }
  }

  return <React.Fragment>
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
    {tokenData.params
      ? <BurnAssetForm originPlatform={originPlatform} tokenData={tokenData} setTokenData={setTokenData} ethereumAddress={props.ethereumAddress} algorandAddress={props.algorandAddress} tokenId={tokenId} peraWallet={props.peraWallet} />
      : null
    }
  </React.Fragment>
}