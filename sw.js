const cacheName = 'version1';

const cacheAssets = [
  'index.html',
  './styles/index.css',
  './js/sw.js'
]

self.addEventListener('install', (e) => {
  console.log('service worker installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('service worker: caching files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  console.log('service worker activated');
  //remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('service worker: clearing old cache');
            return caches.delete(cache);
          }
        })
      )
    })
  )
})

//call fetch
self.addEventListener('fetch', (e => {
  console.log('Service worker: fetching');
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  )
}))
