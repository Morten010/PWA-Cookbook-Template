//naming of cache
const staticCacheName = "staticCache1.0"

const assets = [
	"/",
	"/index.html",
	"/css/styles.css"
]

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
			filteredKeys = keys.filter(key => key !== staticCacheName)
			filteredKeys.maps(key => caches.delete(key))
		})
	)
})

// Fetch event
self.addEventListener('fetch', event => {
	console.log('Fetch event', event)
	if(!(event.request.url.indexOf('http') === 0)) return

	event.respondWith(
		caches.match(event.request).then(async fetchRes => {
			caches.put(event.put(event.request.url, fetchRes.clone()))

			return fetchRes
		})
	)
})