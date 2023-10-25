
const fetchData = async () => {
    const response = await fetch("https://dummyjson.com/products/1")
    const data = await response.json()

    console.log(data);
}

const btn = document.getElementById("fetch-call")

btn.addEventListener("click", async () => {
    fetchData()
})
