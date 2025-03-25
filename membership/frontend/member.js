const BASE_URL = "http://yourdomain:8003"

let selecteduserid =''

window.onload=async()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const userid = urlParams.get('userid');
    if (userid) {
        selecteduserid = userid;
        let home=document.getElementById('home')
        let htmlhome =`<a href="index.html?userid=${selecteduserid}"><h1>Tsunami</h1></a>`
        home.innerHTML=htmlhome

        let member = document.getElementById('member')
        let htmlcart =`<a href="member.html?userid=${selecteduserid}"><p>Member</p></a>`
        member.innerHTML=htmlcart

        let log = document.getElementById('login')
        let htmllog =`<a href="login.html"><p>Logout</p></a>`
        log.innerHTML=htmllog

        console.log("User ID : ",userid);
    } else {
        window.location.href = 'login.html'
    }
    loaddata();
}

const loaddata = async()=>{
    try{
        const response = await axios.get(`${BASE_URL}/users/${selecteduserid}`)
        console.log(`response : ${response.data}`)
        let userdata = response.data
        let memberpoint = document.getElementById('memberpoint')
        let firstname = document.getElementById('firstname')
        let lastname = document.getElementById('lastname')
        let address = document.getElementById('address')

        memberpoint.innerHTML=`${userdata.memberpoint}`
        firstname.innerHTML=`Firstname : ${userdata.firstname}`
        lastname.innerHTML=`Lastname : ${userdata.lastname}`
        address.innerHTML=`Address : ${userdata.address}`

    }catch(error){
        console.log("Load Data Error")
    }
}