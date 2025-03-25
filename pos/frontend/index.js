const BASE_URL = "http://yourdomain:8004"

let productidselect =[]
let usersid = ''

window.onload=async()=>{
    loaddata()
}

const loaddata = async()=>{
    try{
        if(productidselect.length>0){
            let products = document.getElementById('products')
            let htmlproduct='<div>'
            htmlproduct+=`<table style="width:100%">
            <tr>
            <th>productid</th>
            <th>productname</th>
            <th>prices</th>
            <th>amount</th>
            <th>stock</th>
            <th>Cancel</th>
            </tr>`
            for(let i=0;i<productidselect.length;i++){
                htmlproduct+=`
                <tr>
                    <td>${productidselect[i].productid}</td>
                    <td>${productidselect[i].productname}</td>
                    <td>${productidselect[i].prices}</td>
                    <td>${productidselect[i].amount}</td>
                    <td>${productidselect[i].stock}</td>
                    <td><button onclick=cancelproduct(${productidselect[i].productid})>Cancel</button></td>
                </tr>`
            }
            htmlproduct+=`</table>`
            htmlproduct+='</div>'
            products.innerHTML=htmlproduct
        }else{
            let products = document.getElementById('products')
            let htmlproduct=''
            products.innerHTML=htmlproduct
        }
        let total = 0
        for(let i =0;i<productidselect.length;i++){
            total=total+(productidselect[i].prices*productidselect[i].amount)
        }
        let order = document.getElementById('order')
        let htmlorder = `<p>ยอดรวม : ${total}</p>`
        order.innerHTML=htmlorder
    }catch(error){
        console.log("Load Data Error")
    }
}

const cancelproduct = async(productid)=>{
    try{
        let productupdata=[];
        for(let i=0;i<productidselect.length;i++){
            if(productidselect[i].productid !== productid){
                productupdata.push(productidselect[i]);
            }
        }
        productidselect=productupdata;
        console.log("productidselect : ",productidselect)
        loaddata();
    }catch(error){
        console.log("Cancel product Error:", error);
    }
}

const sell=async()=>{
    try{
        let userid = document.querySelector('input[name=userid]')
        const response = await axios.get(`${BASE_URL}/users/${userid.value}`)
        const userdata=response.data
        console.log(userdata)
        if(userdata.firstname){
            let userdetail = document.getElementById('userdetail')
            userdetail.innerHTML=`<div clas="userdetail">
                <p>รายละเอียดสมาชิก :</p>
                <p>ชื่อ : ${userdata.firstname} นามสกุล : ${userdata.lastname}</p>
            </div>`
        }else{
            let userdetail = document.getElementById('userdetail')
            userdetail.innerHTML=`<div clas="userdetail">
                <p>รายละเอียดสมาชิก :</p>
                <p>ไม่พบ ข้อมูล Member</p>
            </div>`
        }
        usersid=userdata.phone
        console.log("User Id : ",usersid)
    }catch(error){
        console.log("Load User Error")
        let userdetail = document.getElementById('userdetail')
        userdetail.innerHTML=`<div clas="userdetail">
            <p>รายละเอียดสมาชิก :</p>
            <p>กรุณาตรวจสอบอีกครั้ง</p>
        </div>`
    }
}

const add = (productid,productname,prices,stock) => {
    try {
        let found = false;
        for (let i = 0; i < productidselect.length; i++) {
            if (productidselect[i].productid === productid) {
                if(productidselect[i].amount<stock){
                    productidselect[i].amount++;
                }
                found = true;
                break;
            }
        }
        if (!found) {
            if(stock>=1){
                productidselect.push({
                    productid: productid,
                    productname:productname,
                    prices:prices,
                    stock:stock,
                    amount: 1
                });
            }
        }
        console.log("productidselect : ", productidselect);
        loaddata()
    } catch (error) {
        console.log("Add product Error:", error);
    }
};

const searchbarcode = async() =>{
    try{
        let barcode = document.querySelector('input[name=barcode]')
        console.log("Barcode : ",barcode.value.length)
        if(barcode.value){
            if(barcode.value.length==13){
                const response = await axios.get(`${BASE_URL}/productsbarcode/${barcode.value}`)
                let productdata = response.data[0]
                console.log("productdata : ",productdata)
                if(productdata.status!="cancel"){
                    add(productdata.productid,productdata.productname,productdata.prices,productdata.stock)
                    let barcodestatus = document.getElementById('barcodestatus')
                    barcodestatus.innerHTML=""
                }else{
                    let barcodestatus = document.getElementById('barcodestatus')
                    barcodestatus.innerHTML="ขออภัย สินค้าถูกยกเลิกการขายแล้ว"
                }
            }else{
                let barcodestatus = document.getElementById('barcodestatus')
                barcodestatus.innerHTML="กรุณาตรวจสอบอีกครั้ง"
            }
        }else{
            let barcodestatus = document.getElementById('barcodestatus')
            barcodestatus.innerHTML="กรุณากรอกหมายเลข Barcodes"
        }
    }catch(error){
        console.log("searchbarcode Error:", error);
        let barcodestatus = document.getElementById('barcodestatus')
        barcodestatus.innerHTML="กรุณาตรวจสอบอีกครั้ง"
    }
}


const confirmorder = async()=>{
    try{
        if(productidselect.length<=0){
            let statushtml=document.getElementById('status')
            statushtml.innerHTML="กรุณาเลือกสินค้าก่อนชำระเงิน"
        }else{
            let date_ob = new Date();

            // ดึงข้อมูลวันที่
            let date2 = ("0" + date_ob.getDate()).slice(-2);

            // ดึงข้อมูลเดือน
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

            // ดึงข้อมูลปี
            let year = date_ob.getFullYear();

            // สร้างรูปแบบ YYYY-MM-DD
            let formatted_date = year + "-" + month + "-" + date2;

            // ดึงข้อมูลชั่วโมง
            let hours = ("0" + date_ob.getHours()).slice(-2);

            // ดึงข้อมูลนาที
            let minutes = ("0" + date_ob.getMinutes()).slice(-2);

            // ดึงข้อมูลวินาที
            let seconds = ("0" + date_ob.getSeconds()).slice(-2);

            // สร้างรูปแบบ HH:MM:SS
            let formatted_time = hours + ":" + minutes + ":" + seconds;

            console.log("Date:", formatted_date);
            console.log("Time:", formatted_time);

            const responseorderid = await axios.get(`${BASE_URL}/pos`);
            let orderid = responseorderid.data[0].orderid;

            for (let i = 0; i < productidselect.length; i++) {
                let orderdata = {
                    date: formatted_date,
                    time: formatted_time,
                    userid: usersid||0,
                    productid: productidselect[i].productid,
                    amount: productidselect[i].amount,
                    orderid: orderid+1
                };

                console.log("orderdata : ",orderdata);
                const response = await axios.post(`${BASE_URL}/pos`,orderdata)

                let updatestock = {
                    productid: productidselect[i].productid,
                    productname:productidselect[i].productname,
                    prices:productidselect[i].prices,
                    stock:productidselect[i].stock-productidselect[i].amount
                };

                console.log("updatestock : ",updatestock)

                const updatestockdata = await axios.put(`${BASE_URL}/productstock/${productidselect[i].productid}`,updatestock)
            }
			
			//if(usersid.length>0){
				let total = 0
				for(let i=0;i<productidselect.length;i++){
					total=total+(productidselect[i].prices*productidselect[i].amount)
				}
				let membershipdata = {
						total:total,
				}
			//}
			
			const updatemembership = await axios.put(`${BASE_URL}/membership/${usersid}`,membershipdata);

            usersid=''
			
			let uservalue = document.querySelector('input[name=userid]');

			uservalue.value = "";
			
			let userdetail = document.getElementById('userdetail')
            userdetail.innerHTML=`<div clas="userdetail">
                <p>รายละเอียดสมาชิก :</p>
            </div>`

            productidselect=[]
            console.log("productidselect : ",productidselect)

            let statushtml=document.getElementById('status')
            statushtml.innerHTML=""

            loaddata()
        }
    }catch(error){
        console.log("Confirm Order Error");
    }
}

const createbill = async()=>{
    try{
        
        if(productidselect.length<=0){
            let statushtml=document.getElementById('status')
            statushtml.innerHTML="กรุณาเลือกสินค้าก่อนสร้างบิล"
        }else{
            let statushtml=document.getElementById('status')
            statushtml.innerHTML=""
            document.getElementById("myForm").style.display = "block";

            let billdetail = document.getElementById('billdetail')
            let htmlbilldetail = '<div>'
            htmlbilldetail+='<div class="shopdetail"><p>ร้าน อมตังค์</p>'
            htmlbilldetail+='<p>อ.เมืองนครปฐม จ.นครปฐม ต.ป๋องแป๋ง 73000</p>'
            htmlbilldetail+='<p>เบอร์โทรศัพท์ : 0617854985</p></div><hr>'
            let total = 0
            for(let i=0;i<productidselect.length;i++){
                total=total+(productidselect[i].prices*productidselect[i].amount)
                htmlbilldetail+=`
                <p>${productidselect[i].productname} ราคา ${productidselect[i].prices} บาท จำนวน ${productidselect[i].amount} คิดเป็น ${productidselect[i].prices*productidselect[i].amount} บาท</p>`
            }
            htmlbilldetail+=`<p>Total : ${total}</p>`
            htmlbilldetail+='</div>'
            billdetail.innerHTML=htmlbilldetail
        }
    }catch(error){
        console.log("Create Bill Error");
    }
}

const closebill = ()=>{
    document.getElementById("myForm").style.display = "none";
}