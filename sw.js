const CACHE_NAME = 'excellence-travel-v1';
const urlsToCache = [
  '/homepage.html',
  '/homepagestyles.css',
  '/homepagescript.js',
  '/bookings.html',
  '/public/services/logo.png',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Open+Sans:wght@300;400;600&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});