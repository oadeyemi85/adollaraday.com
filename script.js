/********f************
    
    Project 4 
    Name: OLUKAYODE ADEYEMI
    Date: 23/04/2026
    Description:

    This JavaScript file powers all interactive behavior for the 
    "A Dollar A Day" charity website. It includes:

    1. Automatic footer year updating
    2. Image carousel with auto-play and dot navigation
    3. Donation form validation (card + bank payment methods)
    4. Volunteer form validation
    5. Contact form validation
    6. Sidebar active link highlighting

*********************/

/* ===========================
   SET CURRENT YEAR IN FOOTER
   =========================== */

// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Select all elements with id="year" (in case multiple exist)
    var yearSpanList = document.querySelectorAll("#year");

    // Get the current year (e.g., 2026)
    var currentYear = new Date().getFullYear();

    // Update each #year element with the current year
    yearSpanList.forEach(function (span) {
        span.textContent = currentYear;
    });
});


/* ===========================
   IMAGE CAROUSEL — AUTO PLAY
   =========================== */

// Start carousel after page loads
document.addEventListener("DOMContentLoaded", function () {

    // Delay start slightly to ensure images are loaded
    setTimeout(() => {
        startCarousel();
    }, 500);
});

// Initialize carousel
function startCarousel() {
    slideIndex = 0;  // Start at first slide
    showSlides();    // Begin slideshow loop
}

let slideIndex = 0; // Tracks current slide index

// Main slideshow function
function showSlides() {

    // Get all slides and dots
    let slides = document.getElementsByClassName("carousel-slide");
    let dots = document.getElementsByClassName("dot");

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Move to next slide
    slideIndex++;

    // Loop back to first slide if past last
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    // Remove active-dot class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active-dot");
    }

    // Show current slide
    slides[slideIndex - 1].style.display = "block";

    // Highlight corresponding dot
    dots[slideIndex - 1].classList.add("active-dot");

    // Auto-advance every 4 seconds
    setTimeout(showSlides, 4000);
}

// Add click events to dots for manual navigation
let dots = document.getElementsByClassName("dot");
for (let i = 0; i < dots.length; i++) {

    dots[i].addEventListener("click", function () {

        // Set slide index to clicked dot
        slideIndex = i;

        // Show selected slide
        showSlides();
    });
}

/* ===========================================
   DONATION FORM — MULTI CARD TYPE VALIDATION
   =========================================== */

// Run when the page finishes loading
document.addEventListener("DOMContentLoaded", function () {        

    // Get donation form
    const donationForm = document.getElementById("donationForm");
    if (!donationForm) return; // Stop if form doesn't exist

    // Error message for missing payment method
    const paymentMethodError = document.getElementById("paymentMethodError");

    // Card + bank field containers
    const cardFields = document.getElementById("cardFields");
    const bankFields = document.getElementById("bankFields");

    // Card input fields
    const cardNumber = document.getElementById("cardNumber");
    const expiry = document.getElementById("expiry");
    const cvv = document.getElementById("cvv");

    // Card error messages
    const cardNumberError = document.getElementById("cardNumberError");
    const expiryError = document.getElementById("expiryError");
    const cvvError = document.getElementById("cvvError");

    // Success message
    const donationSuccess = document.getElementById("donationSuccess");

    // BANK FIELDS
    const bankName = document.getElementById("bankName");
    const accountNumber = document.getElementById("accountNumber");
    const transit = document.getElementById("transit");
    const institution = document.getElementById("institution");
    const reference = document.getElementById("reference");

    // Bank error messages
    const bankNameError = document.getElementById("bankNameError");
    const accountNumberError = document.getElementById("accountNumberError");
    const transitError = document.getElementById("transitError");
    const institutionError = document.getElementById("institutionError");
    const referenceError = document.getElementById("referenceError");

    // Card number regex patterns for major card types
    const cardPatterns = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/,
        amex: /^3[47][0-9]{13}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
    };

    // Detect card type based on number prefix
    function detectCardType(number) {
        number = number.replace(/\s+/g, ""); // Remove spaces

        if (number.startsWith("4")) return "Visa";

        if (/^(5[1-5])/.test(number) || /^(22[2-9]|2[3-6][0-9]|27[01]|2720)/.test(number)) {
            return "Mastercard";
        }

        if (/^(34|37)/.test(number)) return "American Express";

        if (/^(6011|65|64[4-9])/.test(number)) return "Discover";

        return ""; // Unknown card
    }

    // Format card number as user types (#### #### #### ####)
    cardNumber.addEventListener("input", function () {

        let raw = cardNumber.value.replace(/\D/g, ""); // Remove non-digits
        let formatted = raw.replace(/(.{4})/g, "$1 ").trim(); // Add spaces
        cardNumber.value = formatted;

        const type = detectCardType(raw); // Detect card type (not displayed)
    });

    // Validate card number using detection logic
    function validateCardNumber() {
        const raw = cardNumber.value.replace(/\s+/g, "");
        const type = detectCardType(raw);

        if (!type) {
            cardNumberError.classList.add("visible");
            cardNumber.classList.add("error-field");
            return false;
        }

        cardNumberError.classList.remove("visible");
        cardNumber.classList.remove("error-field");
        return true;
    }

    // Switch between card and bank fields when payment method changes
    donationForm.addEventListener("change", function () {
        const method = donationForm.paymentMethod.value;

        if (method === "card") {
            cardFields.style.display = "block";
            bankFields.style.display = "none";
        } 
        else if (method === "bank") {
            cardFields.style.display = "none";
            bankFields.style.display = "block";
        }
    });

    // Handle donation form submission
    donationForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent page reload

        let valid = true; // Track overall form validity

        // Validate payment method selection
        if (!donationForm.paymentMethod.value) {
            paymentMethodError.classList.add("visible");
            valid = false;
        } else {
            paymentMethodError.classList.remove("visible");
        }

        /* ================
           CARD VALIDATION
           ================ */
        if (donationForm.paymentMethod.value === "card") {

            // Validate card number
            if (!validateCardNumber()) valid = false;

            // Validate expiry (MM/YY)
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(expiry.value.trim())) {
                expiryError.classList.add("visible");
                expiry.classList.add("error-field");
                valid = false;
            } else {
                expiryError.classList.remove("visible");
                expiry.classList.remove("error-field");
            }

            // Validate CVV (3 digits or 4 for Amex)
            const cvvRaw = cvv.value.trim();
            const cardType = detectCardType(cardNumber.value.replace(/\s+/g, ""));

            const cvvValid =
                (cardType === "American Express" && /^[0-9]{4}$/.test(cvvRaw)) ||
                (cardType !== "American Express" && /^[0-9]{3}$/.test(cvvRaw));

            if (!cvvValid) {
                cvvError.classList.add("visible");
                cvv.classList.add("error-field");
                valid = false;
            } else {
                cvvError.classList.remove("visible");
                cvv.classList.remove("error-field");
            }
        }

        /* ================
           BANK VALIDATION
           ================ */
        if (donationForm.paymentMethod.value === "bank") {

            // Bank name
            if (!bankName.value.trim()) {
                bankNameError.classList.add("visible");
                bankName.classList.add("error-field");
                valid = false;
            } else {
                bankNameError.classList.remove("visible");
                bankName.classList.remove("error-field");
            }

            // Account number
            if (!accountNumber.value.trim()) {
                accountNumberError.classList.add("visible");
                accountNumber.classList.add("error-field");
                valid = false;
            } else {
                accountNumberError.classList.remove("visible");
                accountNumber.classList.remove("error-field");
            }

            // Transit number (5 digits)
            if (!/^\d{5}$/.test(transit.value.trim())) {
                transitError.classList.add("visible");
                transit.classList.add("error-field");
                valid = false;
            } else {
                transitError.classList.remove("visible");
                transit.classList.remove("error-field");
            }

            // Institution number (3 digits)
            if (!/^\d{3}$/.test(institution.value.trim())) {
                institutionError.classList.add("visible");
                institution.classList.add("error-field");
                valid = false;
            } else {
                institutionError.classList.remove("visible");
                institution.classList.remove("error-field");
            }

            // Payment reference
            if (!reference.value.trim()) {
                referenceError.classList.add("visible");
                reference.classList.add("error-field");
                valid = false;
            } else {
                referenceError.classList.remove("visible");
                reference.classList.remove("error-field");
            }
        }

        /* ========================
           NAME ON CARD VALIDATION
           ======================== */
        const nameOnCard = document.getElementById("nameOnCard");
        const nameOnCardError = document.getElementById("nameOnCardError");

        if (!nameOnCard.value.trim()) {
            nameOnCardError.classList.add("visible");
            nameOnCard.classList.add("error-field");
            valid = false;
        } else {
            nameOnCardError.classList.remove("visible");
            nameOnCard.classList.remove("error-field");
        }

        /* ========================
           FINAL SUBMISSION RESULT
           ======================== */
        if (valid) {
            donationSuccess.style.display = "block"; // Show success message
            donationForm.reset();                    // Clear form
            cardFields.style.display = "none";       // Hide card fields
            bankFields.style.display = "none";       // Hide bank fields
        }
    });

    /* ======================
       RESET BUTTON BEHAVIOR
       ====================== */
    const donationReset = donationForm.querySelector('button[type="reset"]');

    donationReset.addEventListener("click", function () {

        donationSuccess.style.display = "none"; // Hide success message

        cardFields.style.display = "none"; // Hide card section
        bankFields.style.display = "none"; // Hide bank section

        // Remove all error messages
        const allErrors = donationForm.querySelectorAll(".error-message");
        allErrors.forEach(el => el.classList.remove("visible"));

        // Remove all red borders
        const allFields = donationForm.querySelectorAll(".error-field");
        allFields.forEach(el => el.classList.remove("error-field"));

        // Remove payment method error
        paymentMethodError.classList.remove("visible");
    });

});

/* ===============
   VOLUNTEER FORM
   =============== */

// Run when the page loads
document.addEventListener("DOMContentLoaded", function () {

    // Get volunteer form
    const volunteerForm = document.getElementById("volunteerForm");
    if (!volunteerForm) return; // Stop if form doesn't exist

    // Input fields
    const vName = document.getElementById("vName");
    const vEmail = document.getElementById("vEmail");
    const vPhone = document.getElementById("vPhone");
    const vReason = document.getElementById("vReason");

    // Error message elements
    const vNameError = document.getElementById("vNameError");
    const vEmailError = document.getElementById("vEmailError");
    const vPhoneError = document.getElementById("vPhoneError");
    const vReasonError = document.getElementById("vReasonError");

    // Success message
    const volunteerSuccess = document.getElementById("volunteerSuccess");

    // Handle form submission
    volunteerForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent page reload

        let isValid = true; // Track overall validity

        // Clear previous errors
        [vNameError, vEmailError, vPhoneError, vReasonError].forEach(el => el.classList.remove("visible"));
        [vName, vEmail, vPhone, vReason].forEach(field => field.classList.remove("error-field"));

        /* ========================================
           NAME VALIDATION — letters + spaces only
           ======================================== */
        const namePattern = /^[A-Za-z\s]+$/;
        if (!vName.value.trim() || !namePattern.test(vName.value.trim())) {
            isValid = false;
            vNameError.classList.add("visible");
            vName.classList.add("error-field");
        }

        /* ======================================
           EMAIL VALIDATION — basic email regex
           ====================================== */
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(vEmail.value.trim())) {
            isValid = false;
            vEmailError.classList.add("visible");
            vEmail.classList.add("error-field");
        }

        /* ======================================
           PHONE VALIDATION — must be 10 digits
           ====================================== */
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(vPhone.value.trim())) {
            isValid = false;
            vPhoneError.classList.add("visible");
            vPhone.classList.add("error-field");
        }

        /* =====================================
           REASON VALIDATION — cannot be empty
           ===================================== */
        if (!vReason.value.trim()) {
            isValid = false;
            vReasonError.classList.add("visible");
            vReason.classList.add("error-field");
        }

        /* ==============
           FINAL RESULT
           ============== */
        if (!isValid) return; // Stop if any field invalid

        // Reset form + show success message
        volunteerForm.reset();
        volunteerSuccess.style.display = "block";
    });

    /* =======================
       RESET BUTTON BEHAVIOR
       ======================= */
    const volunteerReset = volunteerForm.querySelector('button[type="reset"]');

    volunteerReset.addEventListener("click", function () {

        // Hide success message
        volunteerSuccess.style.display = "none";

        // Remove all visible errors
        [vNameError, vEmailError, vPhoneError, vReasonError].forEach(el => el.classList.remove("visible"));

        // Remove all red borders
        [vName, vEmail, vPhone, vReason].forEach(field => field.classList.remove("error-field"));
    });

});

/* =============
   CONTACT FORM 
   ============= */

// Run when the page loads
document.addEventListener("DOMContentLoaded", function () {

    // Get contact form
    var form = document.getElementById("contactForm");
    if (!form) {
        return; // Stop if form doesn't exist
    }

    // Input fields
    var nameInput = document.getElementById("name");
    var phoneInput = document.getElementById("phone");
    var emailInput = document.getElementById("email");
    var commentsInput = document.getElementById("comments");

    // Error message elements
    var nameError = document.getElementById("nameError");
    var phoneError = document.getElementById("phoneError");
    var emailError = document.getElementById("emailError");
    var commentsError = document.getElementById("commentsError");

    // Success message
    var successMessage = document.getElementById("formSuccess");

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        let isValid = true; // Track overall validity

        // Clear previous errors + borders
        [nameError, phoneError, emailError, commentsError].forEach(el => el.classList.remove("visible"));
        [nameInput, phoneInput, emailInput, commentsInput].forEach(el => el.classList.remove("error-field"));
        successMessage.style.display = "none";

        /* =========================================
           NAME VALIDATION — letters + spaces only
           ========================================= */
        const namePattern = /^[A-Za-z\s]+$/;

        if (!nameInput.value.trim() || !namePattern.test(nameInput.value.trim())) {
            isValid = false;
            nameError.textContent = "Name must contain letters only."; // Custom message
            nameError.classList.add("visible");
            nameInput.classList.add("error-field");
        }

        /* =====================================
           PHONE VALIDATION — must be 10 digits
           ===================================== */
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phoneInput.value.trim())) {
            isValid = false;
            phoneError.classList.add("visible");
            phoneInput.classList.add("error-field");
        }

        /* ======================================
           EMAIL VALIDATION — basic email regex
           ====================================== */
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            isValid = false;
            emailError.classList.add("visible");
            emailInput.classList.add("error-field");
        }

        /* =======================================
           COMMENTS VALIDATION — cannot be empty
           ======================================= */
        if (!commentsInput.value.trim()) {
            isValid = false;
            commentsError.classList.add("visible");
            commentsInput.classList.add("error-field");
        }

        /* =============
           FINAL RESULT
           ============= */
        if (!isValid) return; // Stop if any field invalid

        // Reset form + show success message
        form.reset();
        successMessage.style.display = "block";
    });

    /* =======================
       RESET BUTTON BEHAVIOR
       ======================= */
    const contactReset = form.querySelector('button[type="reset"]');

    contactReset.addEventListener("click", function () {

        // Hide success message
        successMessage.style.display = "none";

        // Remove all visible errors
        [nameError, phoneError, emailError, commentsError].forEach(el => {
            el.classList.remove("visible");
        });

        // Remove all red borders
        [nameInput, phoneInput, emailInput, commentsInput].forEach(el => {
            el.classList.remove("error-field");
        });
    });
});

/* ==============================
   SIDEBAR ACTIVE LINK HIGHLIGHT
   ============================== */

// Run when the page loads
document.addEventListener("DOMContentLoaded", function () {

    // Select all sidebar navigation links
    const sidebarLinks = document.querySelectorAll("#side-nav a");

    // Get the current page filename (e.g., "about.html")
    const currentPage = window.location.pathname.split("/").pop();

    // Loop through each sidebar link
    sidebarLinks.forEach(link => {

        // Extract the link's target page (ignores #anchors)
        const linkPage = link.getAttribute("href").split("#")[0];

        // If the link's page matches the current page, highlight it
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});
