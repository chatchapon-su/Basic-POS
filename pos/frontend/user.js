const BASE_URL = "http://yourdomain:8004"

const valibateData = (userData) =>{
    let errors = []
    if(!userData.firstname){
        errors.push('ชื่อ')
    }
    if(!userData.lastname){
        errors.push('นามสกุล')
    }
    if(!userData.phone){
        errors.push('เบอร์โทรศัพท์')
    }else if(userData.phone.length!=10){
        errors.push("จำนวนเบอร์โทรไม่ครบ 10 หลัก")
    }else if(userData.phone[0]!=0){
        errors.push("เบอร์โทรต้องขึ้นต้นด้วยเลข 0")
    }
    if(!userData.address){
        errors.push('ที่อยู่')
    }
    return errors
}

const submitData = async()=>{

    let fname = document.querySelector('input[name=fname]')
    let lname = document.querySelector('input[name=lname]')
    let phone = document.querySelector('input[name=phone]')
    let address = document.querySelector('textarea[name=address]')

    let messageDOM = document.getElementById('message')

    try{

        let userData={
            firstname: fname.value,
            lastname: lname.value,
            phone: phone.value,
            address: address.value
        }

        console.log("Submit data : ",userData)

        const errors = valibateData(userData);
        if(errors.length > 0) {
            throw{
                message:'กรุณากรอกข้อมูล',
                errors: errors
            }
        }

        const response = await axios.post(`${BASE_URL}/users`,userData)
        console.log("Response : ",response.data);
        message="ลงทะเบียนเสร็จสิ้น"

        messageDOM.innerText = message;
        messageDOM.className = "message success";
        
    }catch(error){
        console.log("Error : ",error.message);
        console.log("Errors : ",error.errors);
        let htmldata=''
        if(error.response){
            console.log("error :",error.response);
            error.message = error.response.data.message;
            error.errors=error.response.data.error;
            console.log('Errors response Error : ',error.response.data.error)
            //let htmldata=''
            if (error.response.data.error.sqlState="23000"){
                console.log("ขออภัย หมายเลขนี้ถูกลงทะเบียนไว้แล้ว");
                error.errors={sqlMessage:"ขออภัย หมายเลขนี้ถูกลงทะเบียนไว้แล้ว"}

                htmldata = '<div>'
                htmldata+=`<div>กรุณาตรวจสอบอีกครั้ง</div>`
                htmldata+= '<div class="error">'
                htmldata+= '<div class="error-message">'
                htmldata+=`<li>ขออภัย หมายเลขนี้ถูกลงทะเบียนไว้แล้ว</li>`
                htmldata+= '</div>'

                htmldata+= '</div>'
                htmldata+='</div>'
            }
        }else{
            //let htmldata=''
            htmldata = '<div>'
            htmldata+=`<div>${error.message}</div>`
            htmldata+= '<div class="error">'
            htmldata+= '<div class="error-message">'
            for(let i = 0; i < error.errors.length; i++){
                htmldata+=`<li>${error.errors[i]}</li>`
            }
            htmldata+= '</div>'

            htmldata+= '</div>'
            htmldata+='</div>'
        }
        messageDOM.innerHTML = htmldata;
        messageDOM.className = "message danger";
    }
    
}