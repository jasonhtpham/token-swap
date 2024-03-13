import React from 'react';
import algosdk from 'algosdk';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { BurnAssetForm } from './burnAssetForm';
// import Web3 from 'web3';

// // connect to ethereum
// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// connect to the algorand node
const algod = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);

export const CheckAssetForm = (props) => {
  const [tokenId, setTokenId] = useState("");
  const [tokenData, setTokenData] = useState();
  const [originPlatform, setOriginPlatform] = useState("");

  // Get Token information from Algorand 
  const checkTokenAlgorand = async () => {
    const tokenData = await algod.getAssetByID(tokenId).do();
    setTokenData(tokenData);
  };

  // Get Token information from Ethereum 
  const checkTokenEthereum = () => {
    // const companyContract = new web3.eth.Contract(tokenABI, tokenId);
    // const _tokenData = {};

    // companyContract.methods.name().call({ from: props.ethereumAdress }).then((result) => {
    //   _tokenData.name = result;
    // }).catch((error) => {
    //   console.error(error);
    // });

    // companyContract.methods.unitName().call({ from: props.ethereumAdress }).then((result) => {
    //   _tokenData.unitName = result;
    // }).catch((error) => {
    //   console.error(error);
    // });

    // companyContract.methods.totalSupply().call({ from: props.ethereumAdress }).then((result) => {
    //   _tokenData.totalSupply = result;
    // }).catch((error) => {
    //   console.error(error);
    // });
    // setTokenData(tokenData);
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
    {tokenData
      ? <BurnAssetForm originPlatform={originPlatform} tokenData={tokenData} ethereumAddress={props.ethereumAddress} algorandAddress={props.algorandAddress} />
      : null
    }
  </React.Fragment>
}