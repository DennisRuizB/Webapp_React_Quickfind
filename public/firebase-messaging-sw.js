// Importa Firebase scripts para el service worker
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCk_QrhGojGOQ_PXgSW5Sw0VO3hN_RBQbo",
    authDomain: "fq-ea-dennis.firebaseapp.com",
    projectId: "fq-ea-dennis",
    storageBucket: "fq-ea-dennis.firebasestorage.app",
    messagingSenderId: "355189445983",
    appId: "1:355189445983:web:5a0c4e2062fb99fbded2ea",
});

const messaging = firebase.messaging();

self.addEventListener('install', (event) => {
    console.log('Service Worker instalado:', event);
    self.skipWaiting(); // Activar inmediatamente
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activado:', event);
});

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    console.log('Notification title:', payload.notification.title);
    console.log('Notification body:', payload.notification.body);
    console.log('Data:', payload.data);
    const notificationTitle = payload.notification.title || 'Notificación Firebase';
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo192.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
