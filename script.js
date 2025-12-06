// Global variables
let scene, camera, renderer;
let particleGeometry, particleMaterial, particles;

// Initialize the scene
function init() {
    // 1. Setup Scene
    scene = new THREE.Scene();

    // 2. Setup Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 250; // Set camera far enough to see the sphere

    // 3. Setup Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Call the function to create the particle sphere
    createParticleSphere();

    // Handle window resizing
    window.addEventListener("resize", onWindowResize, false);

    // Start the animation loop
    animate();
}

document.addEventListener("DOMContentLoaded", () => {
    // This ensures the script runs only after the entire HTML document is loaded

    // ================================================================
    // 1. SCROLL REVEAL (Intersection Observer API)
    // ================================================================

    /**
     * Goal: Watch elements with the class 'reveal-on-scroll'. When they
     * enter the viewport, remove the 'is-hidden' class to trigger the
     * CSS fade-in/slide-up transition.
     */

    // Configuration for the observer
    const observerOptions = {
        root: null, // null means the viewport is the root container
        rootMargin: "0px",
        // Trigger when 15% of the element is visible
        threshold: 0.15,
    };

    // The callback function that runs when an observed element's visibility changes
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            // Check if the observed element is currently intersecting (visible)
            if (entry.isIntersecting) {
                // Remove the 'is-hidden' class, triggering the CSS transition
                entry.target.classList.remove("is-hidden");

                // Stop observing the element once it has been revealed (performance optimization)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Find all elements marked for a scroll transition (from your HTML)
    const elementsToObserve = document.querySelectorAll(".reveal-on-scroll");

    // Loop through them to prepare them for observation
    elementsToObserve.forEach((element) => {
        // IMPORTANT: We initially add the 'is-hidden' class to all elements
        // that aren't already hidden in the HTML, ensuring they start invisible.
        // In the combined file we already added it, but doing it here is safer
        // if you missed it in HTML.
        if (!element.classList.contains("is-hidden")) {
            element.classList.add("is-hidden");
        }

        // Start watching the element
        scrollObserver.observe(element);
    });

    // ================================================================
    // 2. SMOOTH SCROLL FOR NAVIGATION LINKS
    // ================================================================

    /**
     * Goal: Override the default instant jump when clicking internal hash links
     * and replace it with a smooth, animated scroll.
     */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            // Prevent the browser's default action (the instant jump)
            e.preventDefault();

            // Get the target element ID (e.g., '#about' from href="#about")
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Use the native browser method for smooth scrolling
                targetElement.scrollIntoView({
                    behavior: "smooth",
                });
            }
        });
    });

    // ================================================================
    // 3. CONTACT FORM SUBMISSION (Front-end Placeholder)
    // ================================================================

    /**
     * Goal: Handle form submission without a page reload.
     * NOTE: This is front-end only. For a real site, you must integrate
     * a backend service (e.g., Formspree, Netlify Forms, or an API endpoint)
     * to actually send the email.
     */
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
});

function createParticleSphere() {
    // Settings (you can adjust these to change the look)
    const particleCount = 50000; // Total number of particles
    const radius = 100; // Radius of the main sphere
    const thickness = 15; // Thickness of the shell/variations

    particleGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    // The core loop from the image:
    for (let j = 0; j < particleCount; j++) {
        // --- Calculate Spherical Coordinates with Variation ---

        // 1. Angle (theta in spherical coords, 0 to 2*PI)
        const angle = (j / particleCount) * Math.PI * 2;

        // 2. Radius Variation (controls the 'shell' thickness)
        const radiusVariation = radius * (Math.random() - 0.5) * thickness;

        // 3. Position Calculation (Uses randomized angles for a scattered sphere)
        const x = radiusVariation * Math.cos(angle);
        const y = radiusVariation * Math.sin(angle) * (Math.random() - 0.5);
        const z = radiusVariation * Math.sin(angle) * Math.random(); // This line looks unique to the image code

        // Add positions (x, y, z) to the array
        positions.push(x, y, z);

        // --- Calculate Color (HSL based) ---

        // Hue calculation for the rainbow/gradient effect
        const hue = (j % 100) / 100 + 0.7 * (j / particleCount) * 0.3; // Creates the color blend

        // Create a THREE.Color object
        const color = new THREE.Color().setHSL(hue, 1, 0.6); // HSL: hue, saturation (1.0), lightness (0.6)

        // Add color components (R, G, B) to the array
        colors.push(color.r, color.g, color.b);

        // NOTE: The image snippet also had a 'size' array push, but we will handle size via the material.
        // const size = 0.12 + Math.random() * 0.06;
        // sizes.push(size);
    }

    // Set the geometry attributes
    particleGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
    );

    // Create the material for the particles
    particleMaterial = new THREE.PointsMaterial({
        size: 2.5, // The base size of the points
        vertexColors: true, // IMPORTANT: Enables per-particle coloring
        blending: THREE.AdditiveBlending, // Makes the colors glow/blend
        transparent: true,
    });

    // Create the particle system (Points)
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotation is what gives the sphere life
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
}

// Resizing function
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the application
init();
