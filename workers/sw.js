//naming of cache
const staticCacheName = "staticCache1.0"
const dynamicCacheName = 'site-dynamic-v1'

const assets = [
	"/",
	"/index.html",
	"/css/styles.css",
	"/pages/fallback.html"
]

const limitCacheSize = (cacheName, numberOfAllowedFiles) => {
	// Åbn den angivede cache
	caches.open(cacheName).then(cache => {
		// Hent array af cache keys 
		cache.keys().then(keys => {
			// Hvis mængden af filer overstiger det tilladte
			if(keys.length > numberOfAllowedFiles) {
				// Slet første index (ældste fil) og kør funktion igen indtil antal er nået
				cache.delete(keys[0]).then(limitCacheSize(cacheName, numberOfAllowedFiles))
			}
		})
	})
}

// register servise worker
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../workers/sw.js')
	.then(reg => console.log('service worker registered', reg))
	.catch(err => console.error('service worker not registered', err)) 
}

// Install Service Worker
self.addEventListener('install', event => {
	console.log('Service Worker has been installed');
	caches.open(staticCacheName).then(cache => {
		console.log("Skriver til cache");
		cache.addAll(assets)
	})
})

// Install Service Worker
self.addEventListener('activate', event => {
	console.log('Service Worker has been activated');
	event.waitUntil(
		caches.keys().then(keys => {
			const filteredKeys = keys.filter(key => key !== staticCacheName)
			console.log(filteredKeys);
			filteredKeys.map(key => caches.delete(key))
		})
	)
})

// Fetch event
self.addEventListener('fetch', event => {
	console.log(event);
	if(!(event.request.url.indexOf('http') === 0)) return

	event.respondWith(
		caches.match(event.request).then(async fetchRes => {
			caches.put(event.put(event.request.url, fetchRes.clone()))

			return fetchRes
		}).catch(() => {
			return caches.match('/pages/fallback.html')
		})
	)

	// dynamisk cache
	// event.respondWith(
	// 	// Kig efter file match i cache 
	// 	caches.match(event.request).then(cacheRes => {
	// 		// Returner match fra cache - ellers hent fil på server
	// 		return cacheRes || fetch(event.request).then(fetchRes => {
	// 			// Tilføjer nye sider til cachen
	// 			return caches.open(dynamicCacheName).then(cache => {
	// 				// Bruger put til at tilføje sider til vores cache
	// 				// Læg mærke til metoden clone
	// 				cache.put(event.request.url, fetchRes.clone())
	// 				// Returnerer fetch request
	// 				return fetchRes
	// 			})
	// 		})
	// 	})
	// )

	limitCacheSize(staticCacheName, 8)

})