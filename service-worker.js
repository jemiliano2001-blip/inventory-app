// Service Worker for Inventory App
const CACHE_NAME = 'inventory-app-v1.0.0';
const STATIC_CACHE = 'inventory-static-v1.0.0';
const DYNAMIC_CACHE = 'inventory-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  // External CDN resources (will be cached on first load)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests to external services
  if (url.origin !== location.origin && !url.hostname.includes('cdn.')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            console.log('Service Worker: Caching new resource', request.url);
            return networkResponse;
          })
          .catch((error) => {
            console.log('Service Worker: Network request failed', request.url, error);
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return cached version of the same resource type
            return caches.match(request.url);
          });
      })
  );
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'inventory-sync') {
    event.waitUntil(syncInventoryData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación del inventario',
    icon: '/manifest.json',
    badge: '/manifest.json',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/%3E%3Ccircle cx="12" cy="12" r="3"/%3E%3C/svg%3E'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cline x1="18" y1="6" x2="6" y2="18"/%3E%3Cline x1="6" y1="6" x2="18" y2="18"/%3E%3C/svg%3E'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Inventario Central', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/#dashboard')
    );
  }
});

// Sync inventory data when back online
async function syncInventoryData() {
  try {
    console.log('Service Worker: Syncing inventory data...');
    
    // Get pending operations from IndexedDB
    const pendingOps = await getPendingOperations();
    
    if (pendingOps.length > 0) {
      console.log(`Service Worker: Found ${pendingOps.length} pending operations`);
      
      // Process each pending operation
      for (const operation of pendingOps) {
        try {
          await processPendingOperation(operation);
          await removePendingOperation(operation.id);
        } catch (error) {
          console.error('Service Worker: Failed to sync operation', operation, error);
        }
      }
      
      console.log('Service Worker: Sync completed');
    }
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingOperations() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InventoryApp', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingOperations'], 'readonly');
      const store = transaction.objectStore('pendingOperations');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function processPendingOperation(operation) {
  // Process the operation based on its type
  const response = await fetch('/api/inventory', {
    method: operation.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(operation.data)
  });
  
  if (!response.ok) {
    throw new Error(`Operation failed: ${response.status}`);
  }
  
  return response;
}

async function removePendingOperation(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InventoryApp', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingOperations'], 'readwrite');
      const store = transaction.objectStore('pendingOperations');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Initialize IndexedDB if not exists
self.addEventListener('install', (event) => {
  event.waitUntil(
    new Promise((resolve, reject) => {
      const request = indexedDB.open('InventoryApp', 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Create pending operations store
        if (!db.objectStoreNames.contains('pendingOperations')) {
          const store = db.createObjectStore('pendingOperations', { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    })
  );
});

