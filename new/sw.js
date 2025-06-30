const CACHE_NAME = 'usman-portfolio-v2'; // Increment cache version for updates
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    // Profile Image
    'https://scontent.flhe5-1.fna.fbcdn.net/v/t39.30808-6/483478627_10163281384940774_942338982432644931_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFEpOBEDM-5LQyMr8ItCA2K8eHU65FYAAbx4dTrkVgABoq3KdZDAGG-Nfr15pSY0g-YWm67bC_EE4Vie9U4gAJh&_nc_ohc=tyVU5f45N5EQ7kNvwFTsdua&_nc_oc=AdnraGJrK3JwqC6L-CfzyQ5Xm8dpZduWtjy9RwUgCtaRhtIm32HlNt2yM2qvGrvnLPtroyM122_5GL7vYxP_bygU&_nc_zt=23&_nc_ht=scontent.flhe5-1.fna&_nc_gid=32m9vpydiICOkFeDnFYYDQ&oh=00_AfMfv5gxT1eunQMaFWuLd54g4W7a83hD4bnVp6_yoJF0jA&oe=6868BF6E',
    // About image
    'https://images.unsplash.com/photo-1552664730-d307ca884997?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // Service images
    'https://images.unsplash.com/photo-1551288259-fcf52d7d7904?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', /* Corrected from original due to typo */
    'https://images.unsplash.com/photo-1542744095-fcf52d7d7904?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1521737711867-ee1375b48695?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1586324209564-96d557342981?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1593642531955-b62e17bbd959?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // Portfolio images
    'https://images.unsplash.com/photo-1556761175-5973dd3474d7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1496171367476-4d98a002679e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1542831371-d28ea6d2039c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

// Install event: caches the static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Install event triggered.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching assets.');
                return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting()) // Activates the new SW immediately
                    .catch(error => {
                        console.error('Service Worker: Failed to cache some assets:', error);
                        // Even if some assets fail, the SW can still install.
                        // You might want to handle critical assets differently.
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
