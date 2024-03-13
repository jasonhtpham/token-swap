import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyALrYOL0S63viZ4x01hAl1qNRCp48-74cc",
  authDomain: "token-swap-d3f19.firebaseapp.com",
  projectId: "token-swap-d3f19",
  storageBucket: "token-swap-d3f19.appspot.com",
  messagingSenderId: "124103780912",
  appId: "1:124103780912:web:6b4b0d6e607fd1d986dbf5"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    return;
  }
}

export async function fetchToken() {
  try {
    requestPermission();
    const token = await getToken(messaging, {
      vapidKey: process.env.FIREBASE_WEB_PUSH_KEY,
    });
    return token;
  } catch (error) {
    console.log(error);
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
