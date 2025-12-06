document.addEventListener("DOMContentLoaded", () => {
    new fullpage("#fullpage", {
        autoScrolling: true,
        scrollingSpeed: 700,
        licenseKey: "gplv3-license",

        navigation: true,
        navigationTooltips: [
            "Home",
            "About",
            "Experience",
            "Projects",
            "Contact",
        ],

        // --- NEW HORIZONTAL CONFIGURATION ---
        // Enables navigation dots/bullets for horizontal slides
        slidesNavigation: true,
        // Allows keyboard control for horizontal slides (using left/right arrows)
        controlArrows: true,
        // Sets the speed of the slide transition (in milliseconds)
        slideSpeed: 1000,
    });
});

const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Here you would typically serialize the form data and send it via fetch()

        // Simple alert feedback
        alert(
            "Thank you for your message! (Note: This is a placeholder and no actual email was sent.)"
        );

        // Reset the form fields
        this.reset();
    });
}
