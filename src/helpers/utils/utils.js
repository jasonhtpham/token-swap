import CryptoJS from 'crypto-js';

// /**
//  * 
//  * @param {String} jobID jobID returned from SChare
//  */
// const createListener = async (jobID) => {
//   console.log("Waiting for job to complete");
//   try {
//     const sub = createClient({
//       url: process.env.REDIS_URL,
//     });
//     await sub.connect();

//     let res = null;
//     let numTries = 150; // 150 seconds since setInterval runs every second

//     let intervalId = setInterval(async () => {
//       if (numTries === 0) {
//         // clear interval, unsubscribe, and close connection
//         clearInterval(intervalId);
//         await sub.unsubscribe("job:" + jobID);
//         await sub.disconnect();
//         alert(
//           `NFT Creation job did not complete after 2.5 minutes`
//         );
//         return;
//       }

//       if (res != null) {
//         console.log(
//           "Received message on subscribed channel job:" +
//           jobID
//         );
//         // clear interval, unsubscribe, and close connection
//         clearInterval(intervalId);
//         await sub.unsubscribe("job:" + jobID);
//         await sub.disconnect();

//         let json = JSON.parse(res);
//         console.log(json);
//         if (json.status === "SUCCESS") {
//           console.log(
//             "Job has been successfully completed by the service"
//           );
//         } else {
//           alert(`NFT creation job failed`);
//         }
//       }
//       numTries--;
//     }, 1000);

//     await sub.subscribe("job:" + jobID, (message) => {
//       res = message; // 'message'
//     });
//   } catch (err) {
//     alert(err);
//   }
// }

const constructSignature = () => {
  const message = process.env.REACT_APP_SCHARE_API_KEY + process.env.REACT_APP_SCHARE_SERVICE_NAME;
  const hmac = CryptoJS.HmacSHA256(message, process.env.REACT_APP_SCHARE_SECRET_KEY);
  const hash = hmac.toString(CryptoJS.enc.Hex);
  return hash;
}

export {
  // createListener,
  constructSignature,
}