const BASE_URL = "http://yourdomain:8004"

let productselectdata={}

const searchbarcode = async() =>{
    try{
        let barcode = document.querySelector('input[name=codebar]')
        console.log("Barcode : ",barcode.value)
        if(barcode.value){
            const startbarcode = await axios.get(`${BASE_URL}/productsbarcodestart/${barcode.value}`)
            let productdata = startbarcode.data
            console.log("productdata : ",productdata)

            let products = document.getElementById('products')
            let htmlproduct='<div class="orderbox">'
            for(let i=0;i<productdata.length;i++){
                htmlproduct+=`<div>
                <button onclick=chooseproductsetting(${productdata[i].productid},'${productdata[i].productname}',${productdata[i].stock},${productdata[i].prices},'${productdata[i].status}')>
                Product ID : ${productdata[i].productid}
                Productname : ${productdata[i].productname}
                Price : ${productdata[i].prices}
                Stock : ${productdata[i].stock}
                Status : ${productdata[i].status}
                Barcode : ${productdata[i].barcode}</button>
                </div>`
            }
            htmlproduct+='</div>'
            products.innerHTML=htmlproduct
            let barcodestatus = document.getElementById('barcodestatus')
            barcodestatus.innerHTML=""
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

const chooseproductsetting = (productid,productname,stock,prices,status) =>{
    try{
        console.log("Product Detail : ",productid,productname,prices,status,stock)
        
        let userdetail = document.getElementById('userdetail')
        let htmluserdetail = `<p id="userdetail">Product Detail : </p>
        <p>Product ID : ${productid}</p>
        <p>Product Name : ${productname}</p>
        <p>Prices : ${prices}</p>
        <p>Status : ${status}</p>`

        userdetail.innerHTML=htmluserdetail

        if(status=='cancel'){
            let htmlamount = document.getElementById('amount')
            htmlamount.innerHTML=""
            let changestatus = document.getElementById('changestatus')
            changestatus.innerHTML=`<button onclick=changeproductstatus()>Selling</button>`
        }else{
            let htmlamount = document.getElementById('amount')
            htmlamount.innerHTML='<p id="amount">Amount</p><input type="number" name="amount">'
            let changestatus = document.getElementById('changestatus')
            changestatus.innerHTML=`<button onclick=changeproductstatus()>Cancel</button>`
        }

        productselectdata={
            productid:productid,
            productname:productname,
            prices:prices,
            status:status,
            stock:stock
        }
        console.log("productselectdata : ",productselectdata)
    }catch(error){
        console.log("chooseproductsetting Error:", error);
    }
}

const changeproductstatus = async()=>{
    try{

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

        if(productselectdata.status=='cancel'){
            productselectdata.status='selling'
        }else{
            productselectdata.status='cancel'
        }


        //chooseproductsetting = (productselectdata.productid,productselectdata.productname,productselectdata.stock,productselectdata.prices,productselectdata.status)


        let updatestock = {
            productid: productselectdata.productid,
            productname:productselectdata.productname,
            prices:productselectdata.prices,
            stock:productselectdata.stock,
            status:productselectdata.status
        };

        console.log("updatestock : ",updatestock)

        if(productselectdata.status=='cancel'){
            let changestatus = document.getElementById('changestatus')
            changestatus.innerHTML=`<button onclick=changeproductstatus()>Selling</button>`
        }else{
            let changestatus = document.getElementById('changestatus')
            changestatus.innerHTML=`<button onclick=changeproductstatus()>Cancel</button>`
        }

        const updatestockdata = await axios.put(`${BASE_URL}/productstock/${productselectdata.productid}`,updatestock)
        searchbarcode()
        chooseproductsetting(updatestock.productid,updatestock.productname,updatestock.stock,updatestock.prices,updatestock.status)
    }catch(error){
        console.log("Confirm Order Error");
    }
}

const addstock = async()=>{
    try{

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

        let productstatus = document.getElementById('productstatus')
        console.log("productselectdata length : ",productselectdata)
        if(productselectdata.productid){
            if(productselectdata.status=="cancel"){
                productstatus.innerHTML="สินค้าถูกยกเลิกการขายแล้วกรุณาเปิดขายสินค้าด้วยค่ะ"
            }else{
                
                let amount = document.querySelector('input[name=amount]').value
                if(amount){
                    let pindata={
                        date:formatted_date,
                        time:formatted_time,
                        productid:productselectdata.productid,
                        amount:amount	
                    }

                    console.log("pindata : ",pindata)

                    const pinstock = await axios.post(`${BASE_URL}/pin`,pindata)

                    productselectdata.stock=parseInt(productselectdata.stock)+parseInt(amount)

                    let updatestock = {
                        productid: productselectdata.productid,
                        productname:productselectdata.productname,
                        prices:productselectdata.prices,
                        stock:productselectdata.stock,
                        status:productselectdata.status
                    };

                    console.log("updatestock : ",updatestock)

                    //chooseproductsetting = (updatestock.productid,updatestock.productname,updatestock.stock,updatestock.prices,updatestock.status)

                    const updatestockdata = await axios.put(`${BASE_URL}/productstock/${productselectdata.productid}`,updatestock)
                    searchbarcode()
                    productstatus.innerHTML="เพิ่ม stock สินค้าเสร็จสิ้น"
                }else{
                    productstatus.innerHTML=" กรุณากรอกจำนวนสินค้าที่ต้องการเพิ่ม"
                }
                
            }
        }else{
            productstatus.innerHTML="กรุณาเลือกสินค้า"
        }
        

    }catch(error){
        console.log("addstock Error");
    }
}

const valibateData = (productdata) =>{
    let errors = []
    if(!productdata.productname){
        errors.push('select productname')
    }
    if(!productdata.prices){
        errors.push('select prices')
    }
    if(!productdata.stock){
        errors.push('select stock')
    }
    if(!productdata.barcode){
        errors.push('select barcode')
    }
    return errors
}

const createproduct = async () => {
    try {
        // ดึงข้อมูลจาก input
        let productImageInput = document.querySelector('input[name=productimage]');
        let productImage = productImageInput.files[0]; // ดึงไฟล์ภาพ
        let productname = document.querySelector('input[name=productname]').value;
        let prices = document.querySelector('input[name=prices]').value;
        let stock = document.querySelector('input[name=stock]').value;
        let barcode = document.querySelector('input[name=barcode]').value;

        let createpro = document.getElementById('createpro');

        // สร้าง FormData สำหรับส่งข้อมูล
        let formData = new FormData();
        formData.append('productImageInput', productImage); // ใส่ไฟล์ลงใน FormData
        formData.append('productname', productname);
        formData.append('prices', prices);
        formData.append('stock', stock);
        formData.append('barcode', barcode);
        formData.append('status', 'selling');

        // สร้าง productdata สำหรับการตรวจสอบข้อมูล
        let productdata = {
            productname: productname,
            prices: prices,
            stock: stock,
            barcode: barcode,
            status: "selling"
        };

        // ตรวจสอบความถูกต้องของข้อมูล
        let errors = valibateData(productdata);
        if (errors.length > 0) {
            throw {
                message: 'Please fill out the information completely.',
                errors: errors
            };
        }

        if (barcode.length == 13) {
            // ส่งข้อมูลไปยัง API
            const response = await axios.post(`${BASE_URL}/createproducts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // ตรวจสอบ ID ของผลิตภัณฑ์
            const checkproductsid = await axios.get(`${BASE_URL}/checkproductsid`);
            let maxproductid = checkproductsid.data[0];

            console.log("maxproductid : ", maxproductid);

            // ดึงวันและเวลา
            let date_ob = new Date();
            let date2 = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let formatted_date = year + "-" + month + "-" + date2;
            let hours = ("0" + date_ob.getHours()).slice(-2);
            let minutes = ("0" + date_ob.getMinutes()).slice(-2);
            let seconds = ("0" + date_ob.getSeconds()).slice(-2);
            let formatted_time = hours + ":" + minutes + ":" + seconds;

            console.log("Date:", formatted_date);
            console.log("Time:", formatted_time);

            let idproduct = maxproductid.productid;
            console.log("idproduct : ", idproduct);

            let pinupdatedata = {
                date: formatted_date,
                time: formatted_time,
                productid: idproduct,
                amount: stock
            };

            console.log("pinupdatedata : ", pinupdatedata);
            const responsepin = await axios.post(`${BASE_URL}/pin`, pinupdatedata);

            createpro.innerHTML = "Create Success";
        } else {
            createpro.innerHTML = "กรุณาตรวจสอบ Barcode";
        }

        console.log("productdata : ", productdata);
    } catch (error) {
        console.error("Create product Error:", error); // แสดงข้อผิดพลาด
        let createpro = document.getElementById('createpro');
        createpro.innerHTML = "กรุณาตรวจสอบอีกครั้ง";
    }
};