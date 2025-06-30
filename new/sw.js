console.log('Service Worker script is starting to execute.'); // Added for debugging

const CACHE_NAME = 'usman-portfolio-v12'; // Increment cache version for updates
const urlsToCache = [
    './', // Represents the root of the PWA's scope (e.g., /repository-name/)
    './index.html',
    './manifest.json'
    // All other URLs removed from initial cache list for more robust installation.
    // These resources will be cached on first fetch by the fetch handler.
];

// Install event: caches the static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Install event triggered.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching core assets.');
                return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting()) // Activates the new SW immediately
                    .catch(error => {
                        console.error('Service Worker: Failed to cache some core assets during install:', error);
                        // Log which URL caused the error if possible
                        if (error.message.includes('A bad HTTP response code')) {
                            console.error('Check the URL for the failed resource. It might be incorrect or inaccessible.');
                        }
                    });
            })
            .catch(error => {
                console.error('Service Worker: Failed to open cache during install:', error);
            })
    );
});

// Fetch event: serves cached content first, then fetches from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).then(
                    fetchResponse => {
                        // Check if we received a valid response
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse; // Don't cache invalid responses
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and can only be consumed once. We must clone it so that
                        // the browser can consume one and we can consume the other.
                        const responseToCache = fetchResponse.clone();

                        // Cache all successful responses for future use, including images and CDN files
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    }
                ).catch(error => {
                    console.warn('Service Worker: Fetch failed, returning offline page (if cached):', error);
                    // This catch handles network errors. You could return a specific offline page here.
                    // For example: return caches.match('/offline.html');
                });
            })
    );
});

// Activate event: cleans up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activate event triggered.');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return clients.claim(); // Immediately control clients
        })
    );
});
