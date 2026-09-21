/* For the Unit4 JavaScript inclusions, I chose to use a baking appointment selector on the homepage. The goal is for a visitor to set a date and time
to bake with the bakery. This gives the bakery another way to interact with the community while implementing JavaScript on the website. I have added
comments to explain each piece. Additionally, for the second requirement, I included form validation on the contact form submission. The selected
appointment is saved in localStorage, which is browser storage that can remember the selection after the page is refreshed. */

/* This is the available appointment times that a visitor can schedule with the bakery */
const appointmentTimes = ["8:00 a.m.", "10:00 a.m.", "1:00 p.m.", "3:00 p.m."];

/* This stores the localStorage key and messages used for a saved appointment. */
const appointmentData = {
    key: "northStarBakingTime",
    saved: "Your baking time is set for {date} at {time}",
    restored: "Your saved baking time is {date} at {time}"
};

/* This is the contact form requirements and feedback messages. */
const validationRules = {
    name: { message: "Please enter your name.", valid: (value) => value.trim() !== "" },
    email: { message: "Please enter a valid email address.", valid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
    items: { message: "Please enter at least 5 characters for item details.", valid: (value) => value.trim().length >= 5 }
};

/* This function runs only on the homepage because that page has the appointment form. */
function setUpAppointment() {
    /* Find the form before continuing so this code does not run on other pages. */
    const form = document.getElementById("appointment-form");

    if (!form) return;

    /* Find the form controls and look for any appointment saved during an earlier visit. */
    const dateInput = document.getElementById("appointment-date");
    const timeSelect = document.getElementById("appointment-time");
    const message = document.getElementById("appointment-message");
    const savedAppointment = localStorage.getItem(appointmentData.key);

    /* Set today's date as the earliest appointment date. */
    dateInput.min = new Date().toISOString().split("T")[0];

    /* Create one dropdown option for every time in the appointmentTimes array. */
    appointmentTimes.forEach((time) => {
        timeSelect.innerHTML += `<option value="${time}">${time}</option>`;
    });

    /* Restore the saved date and time when localStorage already has an appointment. */
    if (savedAppointment) {
        const appointment = JSON.parse(savedAppointment);
        dateInput.value = appointment.date;
        timeSelect.value = appointment.time;
        message.textContent = appointmentData.restored
            .replace("{date}", appointment.date)
            .replace("{time}", appointment.time);
    }

    /* Save a date and time after the visitor submits the appointment form. */
    form.addEventListener("submit", (event) => {
        /* Keep the page from reloading when the form is submitted. */
        event.preventDefault();

        /* Show a message if the visitor has not selected both required values. */
        if (!dateInput.value || !timeSelect.value) {
            message.textContent = "Please choose both a date and a time.";
            return;
        }

        /* Store the selected values as one appointment object in localStorage. */
        const appointment = { date: dateInput.value, time: timeSelect.value };
        localStorage.setItem(appointmentData.key, JSON.stringify(appointment));
        message.textContent = appointmentData.saved
            .replace("{date}", appointment.date)
            .replace("{time}", appointment.time);
    });
}

/* This function runs only on the Contact page, since it relates to the contact form. */
function setUpContactForm() {
    /* Find the contact form before continuing so this code does not run on other pages. */
    const form = document.getElementById("contact-form");

    if (!form) return;

    /* Validate the contact-form fields when the visitor selects Send request. */
    form.addEventListener("submit", (event) => {
        /* Stop the form until all required JavaScript checks have passed. */
        event.preventDefault();
        let isValid = true;

        /* Check each field using the matching rule in the validationRules object. */
        Object.entries(validationRules).forEach(([id, rule]) => {
            const input = document.getElementById(id);
            const error = document.getElementById(`${id}-error`);
            const validField = rule.valid(input.value);

            /* Display an error by the field and add a border when the field is invalid. */
            error.textContent = validField ? "" : rule.message;
            input.classList.toggle("input-error", !validField);

            if (!validField) isValid = false;
        });

        /* Display the final form message after every validation check. */
        document.getElementById("form-message").textContent = isValid
            ? "Your request is ready to send."
            : "Please correct the highlighted fields.";
    });
}

/* Start the homepage or Contact page code after the HTML finishes loading. */
document.addEventListener("DOMContentLoaded", () => {
    setUpAppointment();
    setUpContactForm();
});
