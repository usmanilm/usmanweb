const CACHE_NAME = 'usman-portfolio-cache-v1';
const urlsToCache = [
  '/usmanweb/', // Your start URL
  '/usmanweb/index.html',
  '/usmanweb/assets/css/main.css',
  '/usmanweb/assets/js/main.js',
  '/usmanweb/assets/vendor/bootstrap/css/bootstrap.min.css',
  '/usmanweb/assets/vendor/bootstrap-icons/bootstrap-icons.css',
  '/usmanweb/assets/vendor/aos/aos.css',
  '/usmanweb/assets/vendor/glightbox/css/glightbox.min.css',
  '/usmanweb/assets/vendor/swiper/swiper-bundle.min.css',
  '/usmanweb/assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
  '/usmanweb/assets/vendor/aos/aos.js',
  '/usmanweb/assets/vendor/purecounter/purecounter_vanilla.js',
  '/usmanweb/assets/vendor/typed.js/typed.umd.js',
  '/usmanweb/assets/vendor/waypoints/noframework.waypoints.js',
  '/usmanweb/assets/vendor/glightbox/js/glightbox.min.js',
  '/usmanweb/assets/vendor/imagesloaded/imagesloaded.pkgd.min.js',
  '/usmanweb/assets/vendor/isotope-layout/isotope.pkgd.min.js',
  '/usmanweb/assets/vendor/swiper/swiper-bundle.min.js',
  // Add paths to your images, particularly those crucial for initial load
  '/usmanweb/assets/img/profile2.png',
  '/usmanweb/assets/img/favicon.png',
  '/usmanweb/assets/img/apple-touch-icon.png',
  '/usmanweb/assets/img/misc/signature-1.webp',
  // Add other critical assets like portfolio images if you want them offline
  '/usmanweb/assets/img/portfolio/e-commerce-platform.jpg',
  '/usmanweb/assets/img/portfolio/custom-software-development.jpg',
  '/usmanweb/assets/img/portfolio/it-consulting.jpg',
  '/usmanweb/assets/img/portfolio/portfolio-4.webp',
  '/usmanweb/assets/img/portfolio/portfolio-5.webp',
  '/usmanweb/assets/img/portfolio/portfolio-6.webp',
  '/usmanweb/assets/img/portfolio/cloud-solutions-migration.jpg',
  '/usmanweb/assets/img/portfolio/cyber-security-consulting.jpg',
  '/usmanweb/assets/img/portfolio/data-analytics-bi.jpg',
  '/usmanweb/assets/img/portfolio/data-warehouse.jpg',
  '/usmanweb/assets/img/portfolio/digital-marketing-strategy.jpg',
  '/usmanweb/assets/img/portfolio/enterprise-crm-integration.jpg'
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
