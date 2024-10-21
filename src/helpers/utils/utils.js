import CryptoJS from 'crypto-js';
import algosdk from 'algosdk';

const mnemonic = "idle oppose bronze obscure coyote bridge option unveil swim patrol beyond crisp auction chicken egg plate master proof hill example stone finish remind absorb elbow";
const logicSigBase64 = "BTEQgQQSMRQxABIQMRKBABIQRIEBQw==";

// Construct LogicSig for AssetOptin in Algorand
const constructLogicSig = () => {
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  const compiledProgram = new Uint8Array(Buffer.from(logicSigBase64, "base64"));
  let lsig = new algosdk.LogicSig(compiledProgram);
  const signedLogicSig = lsig.signProgram(account.sk);

  return signedLogicSig;
};

const constructSignature = () => {
  const message = process.env.REACT_APP_SCHARE_API_KEY + process.env.REACT_APP_SCHARE_SERVICE_NAME;
  const hmac = CryptoJS.HmacSHA256(message, process.env.REACT_APP_SCHARE_SECRET_KEY);
  const hash = hmac.toString(CryptoJS.enc.Hex);
  return hash;
}

export {
  constructLogicSig,
  constructSignature,
}