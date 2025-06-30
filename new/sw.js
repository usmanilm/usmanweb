const CACHE_NAME = 'usman-portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://placehold.co/150x150/1a73e8/ffffff?text=Usman', /* Profile image placeholder */
    'https://placehold.co/400x300/e0e0e0/333333?text=About+Image', /* About image placeholder */
    'https://placehold.co/600x400/add8e6/000000?text=Consulting',
    'https://placehold.co/600x400/90ee90/000000?text=Digital+Marketing',
    'https://placehold.co/600x400/ffb6c1/000000?text=Software+Dev',
    'https://placehold.co/600x400/ffd700/000000?text=Data+Analytics',
    'https://placehold.co/600x400/dda0dd/000000?text=Cloud+Solutions',
    'https://placehold.co/600x400/87cefa/000000?text=Security',
    'https://placehold.co/600x400/c0c0c0/000000?text=Project+A',
    'https://placehold.co/600x400/d3d3d3/000000?text=Project+B',
    'https://placehold.co/600x400/b0c4de/000000?text=Project+C'
];

// Install event: caches the static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
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
                            return fetchResponse;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and can only be consumed once. We must clone it so that
                        // the browser can consume one and we can consume the other.
                        const responseToCache = fetchResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    }
                );
            })
    );
});

// Activate event: cleans up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
