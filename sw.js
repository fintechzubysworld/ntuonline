importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDA02mVmQxC_cu2QCyq4NN8LhQIWo50V5A",
  authDomain: "ntudioka-online-c29d8.firebaseapp.com",
  projectId: "ntudioka-online-c29d8",
  storageBucket: "ntudioka-online-c29d8.firebasestorage.app",
  messagingSenderId: "1015621578149",
  appId: "1:1015621578149:web:c755b458e505fd32928c4c",
  measurementId: "G-JPVKYQRKEB"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // optional
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
