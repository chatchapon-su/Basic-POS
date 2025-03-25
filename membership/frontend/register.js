const BASE_URL = "http://yourdomain:8003"

const validateUserData = (userdata) => {
    let errors = [];
    if (!userdata.firstname) errors.push("Firstname");
    if (!userdata.lastname) errors.push("Lastname");
    if (!userdata.phone) errors.push("Phone");
    if (!userdata.address) errors.push("Address");
    if (!userdata.password) errors.push("Password");
    return errors;
}

const register = async () => {
    try {
        let firstname = document.querySelector('input[name="firstname"]').value.trim();
        let lastname = document.querySelector('input[name="lastname"]').value.trim();
        let phone = document.querySelector('input[name="phone"]').value.trim();
        let address = document.querySelector('textarea[name="address"]').value.trim();
        let password = document.querySelector('input[name="password"]').value.trim();
        let messagelogin = document.getElementById('messagelogin');

        let userdata = {
            phone,
            firstname,
            lastname,
            address,
            password
        };

        console.log(userdata);

        let errors = validateUserData(userdata);
        if (errors.length > 0) {
            throw {
                message: `Please fill in the following fields: ${errors.join(", ")}`
            };
        }

        const response = await axios.post(`${BASE_URL}/users`, userdata);
        messagelogin.innerHTML = "Registration successful!";
        messagelogin.style.color = "green";
        console.log(response.data);
        window.location.href = `index.html?userid=${phone}`;
    } catch (error) {
        console.error("Registration Error:", error);
        let messagelogin = document.getElementById('messagelogin');
        messagelogin.innerHTML = error.message || "An error occurred. Please try again.";
        messagelogin.style.color = "red";
    }
}
