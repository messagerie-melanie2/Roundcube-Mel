// https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps/Offline_Service_workers
// https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps/Re-engageable_Notifications_Push

// import {initializeApp} from "firebase/app";
// import {getMessaging, getToken, onMessage} from "firebase/messaging";

console.log("[Service Worker] sw.js")

const cacheName = 'bnum-cache-pwa-v0.10';

self.addEventListener('install', e => {
    e.waitUntil(
        // Après l'installation du service worker, ouvre un nouveau cache
        caches.open(cacheName).then(cache => {
            // Ajoute toutes les URLs des éléments à mettre en cache
            return cache.addAll([
                '/',
                // '/css/',
                // '/img/',
                // '/js/',
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log('[Service Worker] Récupération de la ressource: ' + e.request.url);
            return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
                    console.log('[Service Worker] Mise en cache de la nouvelle ressource: ' + e.request.url);
                    cache.put(e.request, response.clone()).then(r => console.log(r));
                    return response;
                });
            });
        })
    );
});

self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push received.');
    const payload = event.data ? event.data.text() : 'no payload';
    event.waitUntil(
        self.registration.showNotification('My-pwa ServiceWorker', {
            body: payload,
        })
    );
});

// messaging.setBackgroundMessageHandler(function(payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     Customize notification here
// const notificationTitle = 'Background Message Title';
// const notificationOptions = {
//     body: 'Background Message body.',
//     icon: './firebase-logo.png'
// };
//
// return self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });