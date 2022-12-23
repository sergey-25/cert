// Change this number to force a new service worker install

// const { async } = require("./bundle");

// and app update
const SERVICE_WORKER_VERSION = 145

// Cache the app main files
const filesToCache = [
    'style.css',
    'bundle.js',
    'index.html',
    "assets/it_dgc_certificates.json",
    "assets/it_dgc_public_keys.json",
    "assets/icons/icon-128x128.png",
    "assets/icons/icon-152x152.png",
    "assets/icons/icon-384x384.png",
    "assets/icons/icon-512x512.png",
    "assets/icons/icon-96x96.png",
    "assets/icons/icon-144x144.png",
    "assets/icons/icon-192x192.png",
    "assets/icons/icon-48x48.png",
    "assets/icons/icon-72x72.png",
    "qr-scanner-worker.min.js",
    "qr-scanner-worker.min.js.map",
  ];
  
const staticCacheName = `app-cache-v6`;
const dynamicCacheName = 'd-app-v6'
  

self.addEventListener('install', async event => {
  const cashe = await caches.open(staticCacheName)
    console.log('Attempting to install service worker and cache static assets');
    cache.addAll(filesToCache);
    // event.waitUntil(
    //     caches.open(staticCacheName)
    //     .then(cache => {
    //       return cache.addAll(filesToCache);
    //     })
    // );
});


self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .filter(name => name !== dynamicCacheName)
      .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch', event => {
  const {request} = event

  const url = new URL(request.url)
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})


async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('/offline.html')
  }
}

// // Delete the old app cached files
// self.addEventListener('activate', function (event) {
//   event.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(
//         cacheNames
//           .filter(function (cacheName) {
//             // Return true if you want to remove this cache,
//             // but remember that caches are shared across
//             // the whole origin
//             if (cacheName !== staticCacheName) {
//               //console.warn(`${cacheName} will be purged from Cache Storage`);
//               return false;
//             }
//           })
//           .map(function (cacheName) {
//             return caches.delete(cacheName);
//           }),
//       );
//     }),
//   );
// });



// // Cache the valueset .json files
// self.addEventListener('fetch', event => {
 
//     //console.log('Fetch event for ', event.request.url);
//     event.respondWith(
//         caches.match(event.request)
//         .then(response => {
//         if (response) {
//             //console.log('Found ', event.request.url, ' in cache');
//             return response;
//         }

//         //console.log('Network request for ', event.request.url);
//         return fetch(event.request)
//           .then(response => {
          
//                return caches.open(staticCacheName).then(cache => {
//                 console.log('caching:', event.request.url)
//                 cache.put(event.request.url, response.clone());
//                 return response;
//               });
           
            
//             });

//           }).catch(error => {

//           // TODO 6 - Respond with custom offline page

//           })
//     );
// });


// // Wait for user prompt before force replacing an existing service worker
// // as explained by: https://whatwebcando.today/articles/handling-service-worker-updates/
// self.addEventListener('message', (event) => {
//   if (event.data === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });