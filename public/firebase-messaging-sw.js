// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyALrYOL0S63viZ4x01hAl1qNRCp48-74cc",
  authDomain: "token-swap-d3f19.firebaseapp.com",
  projectId: "token-swap-d3f19",
  storageBucket: "token-swap-d3f19.appspot.com",
  messagingSenderId: "124103780912",
  appId: "1:124103780912:web:6b4b0d6e607fd1d986dbf5"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});