if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../workers/sw.js')
	.then(reg => console.log('service worker registered', reg))
	.catch(err => console.error('service worker not registered', err)) 
}

const fetchData = async () => {
    const response = await fetch("https://dummyjson.com/products/1")
    const data = await response.json()

    console.log(data);
}

const btn = document.getElementById("fetch-call")

btn.addEventListener("click", async () => {
    fetchData()
})
