const BASE_URL = "http://yourdomain:8003"

let MODE = 'VIEW'
let selecteduserid =''

window.onload=async()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const userid = urlParams.get('userid')
    if(userid){
        console.log(userid)
        selecteduserid = userid
        MODE = 'SHOP'
        let log = document.getElementById('login')
        let htmllog =`<a href="login.html"><p>Logout</p></a>`
        log.innerHTML=htmllog
    }else{
        let log = document.getElementById('login')
        let htmllog =`<a href="login.html"><p>Login</p></a>`
        log.innerHTML=htmllog
        console.log(MODE)
    }
    loaddata()
}

const loaddata = async()=>{
    try{
        const response = await axios(`${BASE_URL}/products`)
        const products = response.data
        console.log(products)
        let home=document.getElementById('home')
        let htmlhome =`<a href="index.html?userid=${selecteduserid}"><h1>Tsunami</h1></a>`
        home.innerHTML=htmlhome

        let member = document.getElementById('member')
        let htmlcart =`<a href="member.html?userid=${selecteduserid}"><p>Member</p></a>`
        member.innerHTML=htmlcart

        let html = document.getElementById('products')
        let htmldata = '<div class="products">'
        for(let i=0;i<products.length;i++){
            htmldata+=`<div class="box" href="">
			<img src="http://yourdomain:8003/images/${products[i].productimage}" alt="Product Image">
			<h1>Product Name : ${products[i].productname}</h1>
            <h2>Price : ${products[i].prices}</h2>
            <h2>Stock : ${products[i].stock}</h2></div>`
        }
        htmldata+='</div>'
        html.innerHTML=htmldata
    }catch(error){
        console.log("Load Data Error")
    }
}