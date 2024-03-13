import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import algosdk from 'algosdk';
import { API } from '../helpers';
import { onMessageListener, fetchToken } from "../firebase";

const mnemonic = "idle oppose bronze obscure coyote bridge option unveil swim patrol beyond crisp auction chicken egg plate master proof hill example stone finish remind absorb elbow";
const logicSigBase64 = "BTEQgQQSMRQxABIQMRKBABIQRIEBQw==";

export const BurnAssetForm = (props) => {
  // const [notificationData, setNotificationData] = useState([]);
  // const [open, setOpen] = useState(false);

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
      // setNotificationData(payload.notification.body.split(","));
      // setOpen(true);
      console.log("payload", payload);
    })
    .catch((err) => console.log("failed: ", err)
    );

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
    <Form.Control as="textarea" readOnly={true} value={JSON.stringify(props.tokenData, undefined, 2)} rows={10} />
    <Button className="btn-wallet"
      onClick={mintEthNFT}>
      {props.originPlatform === "algo" ? "Swap for Ethereum Token" : "Swap for Algorand Token"}
    </Button>
  </React.Fragment>)
}