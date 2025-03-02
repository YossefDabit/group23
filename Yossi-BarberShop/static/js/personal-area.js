document.addEventListener("DOMContentLoaded", async function () {
    const appointmentBtn = document.getElementById("appointmentBtn");
    const historyBtn = document.getElementById("historyBtn");
    const manageBtn = document.getElementById("manageBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const contentArea = document.getElementById("contentArea");

    // Get logged-in user's email from localStorage
    const email = localStorage.getItem("currentUserEmail");

    if (!email) {
        alert("You need to be logged in to access this page.");
        window.location.href = "/";
        return;
    }

    // Fetch user data (including fullName) and appointments from backend
    let currentUser = null;

    async function fetchUserData() {
        try {
            const response = await fetch('http://127.0.0.1:5000/get-user-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (response.ok) {
                currentUser = result.user;
                document.querySelector("h1").innerText = `Welcome, ${currentUser.fullName}!`;
            } else {
                alert(result.message);
                localStorage.removeItem("currentUserEmail");
                window.location.href = "index.html";
            }
        } catch (error) {
            alert("Failed to fetch user data.");
            console.error('Error:', error);
        }
    }

    await fetchUserData();

    function showContent(contentType) {
        contentArea.style.display = "block";
        contentArea.innerHTML = '';

        if (contentType === "appointment") {
            contentArea.innerHTML = generateAppointmentForm();
            document.getElementById("appointmentForm").addEventListener("submit", handleAppointmentSubmission);
        } else if (contentType === "history") {
            fetchAppointmentHistory();
        } else if (contentType === "manage") {
            fetchManageAppointments();
        }
    }

    function generateAppointmentForm() {
        let options = '';
        for (let hour = 10; hour <= 16; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                let time = `${hour}:${minute === 0 ? '00' : minute}`;
                if (time === "14:00") {
                    options += `<option value="${time}" disabled style="color: red;">${time} - Not Available</option>`;
                } else {
                    options += `<option value="${time}">${time}</option>`;
                }
            }
        }
    
        return `
            <h2>Book Appointment</h2>
            <form id="appointmentForm">
                <label for="barber">Choose Barber:</label>
                <select id="barber" name="barber">
                    <option value="yossi">Yossi</option>
                    <option value="daniel">Daniel</option>
                    <option value="aviv">Aviv</option>
                    <option value="tamar">Tamar</option>
                </select><br>
    
                <label for="typeOfService">Choose Service:</label>
                <select id="typeOfService" name="typeOfService" onchange="updatePrice()">
                    <option value="Haircut">Haircut - $30</option>
                    <option value="Facial">Facial - $40</option>
                    <option value="Haircut + Facial">Haircut + Facial - $60</option>
                </select><br>
    
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required><br>
    
                <label for="time">Time:</label>
                <select id="time" name="time">${options}</select><br>
    
                <button type="submit">Book Appointment</button>
            </form>
        `;
    }
    
    

    async function handleAppointmentSubmission(event) {
        event.preventDefault();
    
        const date = new Date(document.getElementById("date").value);
        if (date.getDay() === 6) {
            alert("Appointments cannot be booked on Saturdays.");
            return;
        }
    
        const serviceType = document.getElementById("typeOfService").value;
    
        const priceMap = {
            "Haircut": 30,
            "Facial": 40,
            "Haircut + Facial": 60
        };
    
        const appointmentData = {
            email: localStorage.getItem("currentUserEmail"),  // Make sure email is retrieved correctly
            barber: document.getElementById("barber").value,
            typeOfService: serviceType,
            price: priceMap[serviceType],  // Add price directly from map
            date: document.getElementById("date").value,
            time: document.getElementById("time").value
        };
    
        try {
            const response = await fetch('http://127.0.0.1:5000/book-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            });
    
            const result = await response.json();
            alert(result.message);
            if (response.ok) fetchManageAppointments();
        } catch (error) {
            alert("Failed to book appointment.");
            console.error('Error:', error);
        }
    }
    

    async function fetchManageAppointments() {
        try {
            const response = await fetch('http://127.0.0.1:5000/get-appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: localStorage.getItem("currentUserEmail") })
            });
    
            const result = await response.json();
            if (response.ok) {
                contentArea.innerHTML = `
                    <h2>Manage Appointments</h2>
                    <ul>${result.appointments.map(appt => 
                        `<li>${appt.date} - ${appt.barber} at ${appt.time} 
                            <button onclick="cancelAppointment('${appt.date}', '${appt.time}')">Cancel</button>
                        </li>`
                    ).join('')}</ul>`;
            } else {
                contentArea.innerHTML = `<p>${result.message}</p>`;
            }
        } catch (error) {
            contentArea.innerHTML = `<p>Failed to fetch appointments.</p>`;
            console.error('Error:', error);
        }
    }
    
    async function cancelAppointment(date, time) {
        const confirmed = confirm("Are you sure you want to cancel this appointment?");
        if (!confirmed) return;
    
        try {
            const response = await fetch('http://127.0.0.1:5000/cancel-appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: localStorage.getItem("currentUserEmail"),
                    date,
                    time
                })
            });
    
            const result = await response.json();
            alert(result.message);
    
            if (response.ok) {
                fetchManageAppointments();  // Refresh the list after cancelling
            }
        } catch (error) {
            alert("Failed to cancel appointment.");
            console.error('Error:', error);
        }
    }
    
    // This is the key part to make cancelAppointment() work in dynamically created buttons
    window.cancelAppointment = cancelAppointment;
    
    async function fetchAppointmentHistory() {
        const email = localStorage.getItem("currentUserEmail");
    
        if (!email) {
            alert("You must be logged in to view appointment history.");
            window.location.href = "/login-page";
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:5000/get-appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                if (result.appointments.length === 0) {
                    contentArea.innerHTML = `<h2>Haircut History</h2><p>No appointments found.</p>`;
                } else {
                    contentArea.innerHTML = `
                        <h2>Haircut History</h2>
                        <ul>
                            ${result.appointments.map(appt => `
                                <li>${appt.date} - ${appt.barber} - ${appt.typeOfService} - $${appt.price} at ${appt.time}</li>
                            `).join('')}
                        </ul>`;
                }
            } else {
                alert(result.message);
                contentArea.innerHTML = `<p>Failed to load history: ${result.message}</p>`;
            }
        } catch (error) {
            contentArea.innerHTML = `<p>Failed to fetch appointment history.</p>`;
            console.error('Error:', error);
        }
    }
    
    

    function logout() {
        localStorage.removeItem("currentUserEmail");
        alert("Logged out successfully!");
        window.location.href = "/";
    }

    appointmentBtn.addEventListener("click", () => showContent("appointment"));
    historyBtn.addEventListener("click", fetchAppointmentHistory);
    manageBtn.addEventListener("click", () => showContent("manage"));
    logoutBtn.addEventListener("click", logout);
});
