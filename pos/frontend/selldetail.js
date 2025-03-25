const BASE_URL = "http://yourdomain:8004"

window.onload=async()=>{
    loaddata()
}

const loaddata = async()=>{
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

        const response = await axios(`${BASE_URL}/posrank/${formatted_date}`)
        let rankid = response.data
        console.log(rankid[0][0])
        let rank = document.getElementById('rank')
    
        let htmlrank = '<div class="rankofbox">'
        let count = 1
        for (let i = 0; i < 5; i++) {
            if(i<rankid[0].length){
                const responseproduce = await axios(`${BASE_URL}/products/${rankid[0][i].productid}`)
                const productdatail = responseproduce.data
                console.log(productdatail[0].productname)
                htmlrank += `<div class="rankbox">
                <h2>ขายดีอันดับ ${count}</h2>
                <p>${productdatail[0].productname}</p>
                <p>ยอดขาย : ${rankid[0][i].total}</p>
                </div>`
            }else{
                break
            }
            
            count++
        }
        htmlrank += '</div>'
        rank.innerHTML = htmlrank

        let datetime = document.querySelector('input[name=datetime]')
        datetime.value=formatted_date
        const orderall = await axios.get(`${BASE_URL}/posdatesell/${formatted_date}`)
        let orderalls = orderall.data[0]
        console.log(orderalls)
        let orderdetail = document.getElementById('orderdetail')
        let htmlorderdetail = '<div class="orderdetailofbox">'
        for (let i = orderalls.length - 1; i >= 0; i--) {
            const responseproduce = await axios(`${BASE_URL}/products/${orderalls[i].productid}`)
            const productdatail = responseproduce.data[0]
            let username=''
            if(orderalls[i].userid!=0){
                const responseusers = await axios(`${BASE_URL}/users/${orderalls[i].userid}`)
                let usersdata = responseusers.data
                console.log("User Data : ",orderalls[i].userid)
                username=usersdata.firstname+" "+usersdata.lastname
            }else{
                username='ไม่ได้เป็นสมาชิก'
            }
            if(i < orderalls.length-1){
                console.log(`Date : ${orderalls[i].date} : ${orderalls[i+1].date}`)
                if(orderalls[i].date==orderalls[i+1].date){
                    htmlorderdetail+=`<div class="orderdetailbox">
                    Order ID : ${orderalls[i].orderid}
                    Productname : ${productdatail.productname}
                    Time : ${orderalls[i].time}
                    Customer : ${username}
                    Amount: ${orderalls[i].amount}
                    </div>`
                }else{
                    htmlorderdetail+=`Date : ${orderalls[i].date}`
                    htmlorderdetail+=`<div class="orderdetailbox">
                    Order ID : ${orderalls[i].orderid}
                    Productname : ${productdatail.productname}
                    Time : ${orderalls[i].time}
                    Customer : ${username}
                    Amount: ${orderalls[i].amount}
                    </div>`
                }
            }else{
                htmlorderdetail+=`Date : ${orderalls[i].date}`
                htmlorderdetail+=`<div class="orderdetailbox">
                Order ID : ${orderalls[i].orderid}
                Productname : ${productdatail.productname}
                Time : ${orderalls[i].time}
                Customer : ${username}
                Amount: ${orderalls[i].amount}
                </div>`
            }
            
        }
        htmlorderdetail += "</div>"
        orderdetail.innerHTML=htmlorderdetail
    } catch (error) {
        console.log("Load Data Error")
    }
    
}

const selldate = async()=>{
    try{
        let datetime = document.querySelector('input[name=datetime]').value
        console.log('Date time : ',datetime)
        const orderall = await axios.get(`${BASE_URL}/posdatesell/${datetime}`)
        let orderalls = orderall.data[0]
        console.log(orderalls)
        let orderdetail = document.getElementById('orderdetail')
        let htmlorderdetail = '<div class="orderdetailofbox">'
        for (let i = orderalls.length - 1; i >= 0; i--) {
            const responseproduce = await axios(`${BASE_URL}/products/${orderalls[i].productid}`)
            const productdatail = responseproduce.data[0]
            let username=''
            if(orderalls[i].userid!=0){
                const responseusers = await axios(`${BASE_URL}/users/${orderalls[i].userid}`)
                let usersdata = responseusers.data
                console.log("User Data : ",orderalls[i].userid)
                username=usersdata.firstname+" "+usersdata.lastname
            }else{
                username='ไม่ได้เป็นสมาชิก'
            }
            if(i < orderalls.length-1){
                console.log(`Date : ${orderalls[i].date} : ${orderalls[i+1].date}`)
                if(orderalls[i].date==orderalls[i+1].date){
                    htmlorderdetail+=`<div class="orderdetailbox">
                    Order ID : ${orderalls[i].orderid}
                    Productname : ${productdatail.productname}
                    Time : ${orderalls[i].time}
                    Customer : ${username}
                    Amount: ${orderalls[i].amount}
                    </div>`
                }else{
                    htmlorderdetail+=`Date : ${orderalls[i].date}`
                    htmlorderdetail+=`<div class="orderdetailbox">
                    Order ID : ${orderalls[i].orderid}
                    Productname : ${productdatail.productname}
                    Time : ${orderalls[i].time}
                    Customer : ${username}
                    Amount: ${orderalls[i].amount}
                    </div>`
                }
            }else{
                htmlorderdetail+=`Date : ${orderalls[i].date}`
                htmlorderdetail+=`<div class="orderdetailbox">
                Order ID : ${orderalls[i].orderid}
                Productname : ${productdatail.productname}
                Time : ${orderalls[i].time}
                Customer : ${username}
                Amount: ${orderalls[i].amount}
                </div>`
            }
            
        }
        htmlorderdetail += "</div>"
        orderdetail.innerHTML=htmlorderdetail
    }catch(error){
        console.log("Date time Error")
    }
}