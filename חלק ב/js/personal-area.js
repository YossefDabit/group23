document.addEventListener("DOMContentLoaded", function () {
    const appointmentBtn = document.getElementById("appointmentBtn");
    const historyBtn = document.getElementById("historyBtn");
    const manageBtn = document.getElementById("manageBtn");
    const contentArea = document.getElementById("contentArea");

    function showContent(contentType) {
        contentArea.style.display = "block";
        contentArea.innerHTML = '';

        switch (contentType) {
            case "appointment":
                contentArea.innerHTML = generateAppointmentForm();
                document.getElementById("appointmentForm").addEventListener("submit", handleAppointmentSubmission);
                break;
            case "history":
                contentArea.innerHTML = `
                    <h2>Haircut History</h2>
                    <ul>
                        <li>March 1, 2025: Haircut by Yossi - 60₪</li>
                        <li>January 20, 2025: Haircut + Beard Trim by Daniel - 70₪</li>
                        <li>December 15, 2024: Beard Only by Aviv - 30₪</li>
                    </ul>
                `;
                break;
            case "manage":
                contentArea.innerHTML = `
                    <h2>Manage Appointments</h2>
                    <ul id="appointmentList">
                        <li data-appointment-id="1">March 1, 2025 - Yossi - Haircut: <button onclick="cancelAppointment(1)">Cancel</button></li>
                        <li data-appointment-id="2">January 20, 2025 - Daniel - Haircut + Beard Trim: <button onclick="cancelAppointment(2)">Cancel</button></li>
                    </ul>
                `;
                break;
        }
    }

    function generateAppointmentForm() {
        let options = '';
        for (let hour = 10; hour <= 16; hour++) { // Loop until 16
            for (let minute = 0; minute < 60; minute += 30) { // Every 30 minutes
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
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required><br>
                <label for="time">Time:</label>
                <select id="time" name="time">${options}</select><br>
                <button type="submit">Book Appointment</button>
            </form>
        `;
    }

    function handleAppointmentSubmission(event) {
        event.preventDefault();
        const date = new Date(document.getElementById("date").value);
        if (date.getDay() === 6) { // בדיקה אם היום הוא שבת
            alert("Appointments cannot be booked on Saturdays.");
            return;
        }
        alert("Appointment booked successfully!");
        // כאן יכולה להיות לוגיקה לשמירת התור במערכת או בדאטאבייס
    }

    function cancelAppointment(appointmentId) {
        const appointment = document.querySelector(`li[data-appointment-id="${appointmentId}"]`);
        appointment.remove();
        alert("Appointment cancelled successfully.");
    }

    appointmentBtn.addEventListener("click", () => showContent("appointment"));
    historyBtn.addEventListener("click", () => showContent("history"));
    manageBtn.addEventListener("click", () => showContent("manage"));
});
