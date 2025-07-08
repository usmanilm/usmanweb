const CACHE_NAME = 'usman-portfolio-cache-v1';
const urlsToCache = [
  '/', // Your start URL
  '/index.html',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/vendor/bootstrap/css/bootstrap.min.css',
  '/assets/vendor/bootstrap-icons/bootstrap-icons.css',
  '/assets/vendor/aos/aos.css',
  '/assets/vendor/glightbox/css/glightbox.min.css',
  '/assets/vendor/swiper/swiper-bundle.min.css',
  '/assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
  '/assets/vendor/aos/aos.js',
  '/assets/vendor/purecounter/purecounter_vanilla.js',
  '/assets/vendor/typed.js/typed.umd.js',
  '/assets/vendor/waypoints/noframework.waypoints.js',
  '/assets/vendor/glightbox/js/glightbox.min.js',
  '/assets/vendor/imagesloaded/imagesloaded.pkgd.min.js',
  '/assets/vendor/isotope-layout/isotope.pkgd.min.js',
  '/assets/vendor/swiper/swiper-bundle.min.js',
  // Add paths to your images, particularly those crucial for initial load
  '/assets/img/profile2.png',
  '/assets/img/favicon.png',
  '/assets/img/apple-touch-icon.png',
  '/assets/img/misc/signature-1.webp',
  // Add other critical assets like portfolio images if you want them offline
  '/assets/img/portfolio/e-commerce-platform.jpg',
  '/assets/img/portfolio/custom-software-development.jpg',
  '/assets/img/portfolio/it-consulting.jpg',
  '/assets/img/portfolio/portfolio-4.webp',
  '/assets/img/portfolio/portfolio-5.webp',
  '/assets/img/portfolio/portfolio-6.webp',
  '/assets/img/portfolio/cloud-solutions-migration.jpg',
  '/assets/img/portfolio/cyber-security-consulting.jpg',
  '/assets/img/portfolio/data-analytics-bi.jpg',
  '/assets/img/portfolio/data-warehouse.jpg',
  '/assets/img/portfolio/digital-marketing-strategy.jpg',
  '/assets/img/portfolio/enterprise-crm-integration.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
