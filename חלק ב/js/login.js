function loginWithEmail() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === "user@example.com" && password === "password123") {
        alert('Logged in successfully with email!');
        window.location.href = 'appointment.html'; // Redirect to appointment page
    } else {
        alert('Invalid email or password!');
    }
}

function loginWithPhone() {
    const phone = document.getElementById('phone').value;
    const smsCode = document.getElementById('smsCode').value;

    if (phone === "1234567890" && smsCode === "1234") {
        alert('Logged in successfully with phone!');
        window.location.href = 'appointment.html'; // Redirect to appointment page
    } else {
        alert('Invalid phone number or SMS code!');
    }
}
