// function loginWithEmail() {
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     if (email === "user@example.com" && password === "password123") {
//         alert('Logged in successfully with email!');
//         window.location.href = 'appointment.html'; // Redirect to appointment page
//     } else {
//         alert('Invalid email or password!');
//     }
// }

// function loginWithPhone() {
//     const phone = document.getElementById('phone').value;
//     const smsCode = document.getElementById('smsCode').value;

//     if (phone === "1234567890" && smsCode === "1234") {
//         alert('Logged in successfully with phone!');
//         window.location.href = 'appointment.html'; // Redirect to appointment page
//     } else {
//         alert('Invalid phone number or SMS code!');
//     }
// }

document.getElementById('loginForm').onsubmit = async function (event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);

            // Save user email to localStorage after successful login
            localStorage.setItem("currentUserEmail", formData.email);

            // Redirect to personal area
            window.location.href = "/personal-area";
        } else {
            alert(`Login failed: ${result.message}`);
        }
    } catch (error) {
        alert('Failed to connect to server.');
        console.error('Error:', error);
    }
};
