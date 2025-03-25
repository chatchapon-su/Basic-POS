const BASE_URL = "http://yourdomain:8004"

window.onload = async () => {
    loaddata()
}

const loaddata = async () => {
    try {

        let date_ob = new Date();

        // ดึงข้อมูลวันที่
        let date2 = ("0" + date_ob.getDate()).slice(-2);

        // ดึงข้อมูลเดือน
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        // ดึงข้อมูลปี
        let year = date_ob.getFullYear();

        // สร้างรูปแบบ YYYY-MM-DD
        let formatted_date = year + "-" + month + "-" + date2;

        console.log("Date:", formatted_date);


        let datetime = document.querySelector('input[name=datetime]')
        datetime.value=formatted_date
        const orderall = await axios.get(`${BASE_URL}/pindatebuy/${formatted_date}`)
        let orderalls = orderall.data[0]
        console.log(orderalls)
        let pindetail = document.getElementById('orderdetail')
        let htmlpindetail = '<div class="orderdetailofbox">'
        for (let i = orderalls.length - 1; i >= 0; i--) {
            console.log(orderalls[i].productid)
            const responseproduce = await axios.get(`${BASE_URL}/products/${orderalls[i].productid}`)
            const productdatail = responseproduce.data[0]
            if (productdatail) { // ตรวจสอบว่ามีข้อมูลสินค้าหรือไม่
                console.log(productdatail.productname)


                if(i < orderalls.length-1){
                    console.log(`Date : ${orderalls[i].date} : ${orderalls[i+1].date}`)
                    if(orderalls[i].date==orderalls[i+1].date){
                        htmlpindetail += `<div class="orderdetailbox">
                        Product name : ${productdatail.productname}
                        Time : ${orderalls[i].time}
                        Amount : ${orderalls[i].amount}
                        </div>`
                    }else{
                        htmlpindetail+=`Date : ${orderalls[i].date}`
                        htmlpindetail += `<div class="orderdetailbox">
                        Product name : ${productdatail.productname}
                        Time : ${orderalls[i].time}
                        Amount : ${orderalls[i].amount}
                        </div>`
                    }
                }else{
                    htmlpindetail+=`Date : ${orderalls[i].date}`
                    htmlpindetail += `<div class="orderdetailbox">
                    Product name : ${productdatail.productname}
                    Time : ${orderalls[i].time}
					Amount : ${orderalls[i].amount}
                    </div>`
                }
            } else {
                console.log(`Product with productid ${orderalls[i].productid} not found`)
            }
        }
        htmlpindetail += '</div>'
        pindetail.innerHTML = htmlpindetail
    } catch (error) {
        console.log("Load Data Error", error.message)
    }
}

const buydate = async()=>{
    try{
        let datetime = document.querySelector('input[name=datetime]').value
        console.log('Date time : ',datetime)

        const orderall = await axios.get(`${BASE_URL}/pindatebuy/${datetime}`)
        let orderalls = orderall.data[0]
        console.log(orderalls)
        let pindetail = document.getElementById('orderdetail')
        let htmlpindetail = '<div class="orderdetailofbox">'
        for (let i = orderalls.length - 1; i >= 0; i--) {
            console.log(orderalls[i].productid)
            const responseproduce = await axios.get(`${BASE_URL}/products/${orderalls[i].productid}`)
            const productdatail = responseproduce.data[0]
            if (productdatail) { // ตรวจสอบว่ามีข้อมูลสินค้าหรือไม่
                console.log(productdatail.productname)


                if(i < orderalls.length-1){
                    console.log(`Date : ${orderalls[i].date} : ${orderalls[i+1].date}`)
                    if(orderalls[i].date==orderalls[i+1].date){
                        htmlpindetail += `<div class="orderdetailbox">
                        Product name : ${productdatail.productname}
                        Time : ${orderalls[i].time}
                        Amount : ${orderalls[i].amount}
                        </div>`
                    }else{
                        htmlpindetail+=`Date : ${orderalls[i].date}`
                        htmlpindetail += `<div class="orderdetailbox">
                        Product name : ${productdatail.productname}
                        Time : ${orderalls[i].time}
                        Amount : ${orderalls[i].amount}
                        </div>`
                    }
                }else{
                    htmlpindetail+=`Date : ${orderalls[i].date}`
                    htmlpindetail += `<div class="orderdetailbox">
                    Product name : ${productdatail.productname}
                    Time : ${orderalls[i].time}
					Amount : ${orderalls[i].amount}
                    </div>`
                }
            } else {
                console.log(`Product with productid ${orderalls[i].productid} not found`)
            }
        }
        htmlpindetail += '</div>'
        pindetail.innerHTML = htmlpindetail
        
    }catch(error){
        console.log("Buy Date Error")
    }
}