document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const birthdate = document.getElementById("birthdate").value;
    const password = document.getElementById("password").value;

    const requestData = { fullName, email, phone, birthdate, password };

    try {
        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        alert(data.message);

        if (data.success) {
            // ✅ Save to localStorage so user is considered "logged in"
            localStorage.setItem('currentUserEmail', email);
            localStorage.setItem('currentUserName', fullName);

            // ✅ Redirect to personal area
            window.location.href = '/personal-area';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
    }
});
