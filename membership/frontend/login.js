const BASE_URL = "http://yourdomain:8003"

const login = async () => {
    try {
        let phone = document.querySelector('input[name="phone"]').value.trim();
        let password = document.querySelector('input[name="password"]').value.trim();
        let messagelogin = document.getElementById('messagelogin');

        if (!phone || !password) {
            messagelogin.innerHTML = "Please fill in all fields.";
            return;
        }

        console.log(`Phone : ${phone}  Password : ${password}`);

        const response = await axios.get(`${BASE_URL}/users/${phone}/${password}`);
        console.log(response.data);

        let check = response.data;
        if (check.status == 1) {
            console.log("Login Success");
            window.location.href = `index.html?userid=${phone}`;
        } else {
            messagelogin.innerHTML = "Incorrect phone number or password.";
        }
    } catch (error) {
        console.log("Login Error");
        let messagelogin = document.getElementById('messagelogin');
        messagelogin.innerHTML = "An error occurred. Please try again.";
    }
}
