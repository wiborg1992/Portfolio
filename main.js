// Konstanter og konfiguration
const CONFIG = {
  ANIMATION_DURATION: 1.5,
  PROGRESS_STEPS: 60,
  MOBILE_BREAKPOINT: "(max-width: 768px)",
  CIRCLE_THRESHOLD: 0.6,
};

// Menu Controller
class MenuController {
  constructor() {
    this.menuButton = document.querySelector(".menu-button");
    this.closeButton = document.querySelector(".close-button");
    this.menuOverlay = document.querySelector(".menu-overlay");
    this.body = document.body;
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    if (!this.menuButton || !this.menuOverlay || !this.closeButton) {
      console.error("Menu elementer blev ikke fundet!");
      return;
    }

    // Get initial positions of logo and hire-me button
    this.storeInitialPositions();

    this.setupEventListeners();
  }

  storeInitialPositions() {
    // Store positions for smooth animation
    const logoWrap = document.querySelector(".mainnav .logo-wrap");
    const hireMe = document.querySelector(".mainnav .hire-me");

    if (logoWrap && hireMe) {
      // Get position data
      this.logoPosition = logoWrap.getBoundingClientRect();
      this.hireMePosition = hireMe.getBoundingClientRect();
    }
  }

  setupEventListeners() {
    this.menuButton.addEventListener("click", () => this.toggleMenu());
    this.closeButton.addEventListener("click", () => this.toggleMenu());

    this.menuOverlay.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        if (this.isMenuOpen) this.toggleMenu();
      });
    });

    this.menuOverlay.addEventListener("click", (event) => {
      if (event.target === this.menuOverlay && this.isMenuOpen) {
        this.toggleMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.isMenuOpen) {
        this.toggleMenu();
      }
    });

    // Monitor for window resizes to update positions
    window.addEventListener("resize", () => {
      if (!this.isMenuOpen) {
        this.storeInitialPositions();
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuButton.textContent = this.isMenuOpen ? "LUK" : "MENU";
    this.menuOverlay.classList.toggle("active");
    this.body.classList.toggle("lock-scroll");

    // Use smooth animation instead of abrupt change
    if (this.isMenuOpen) {
      // Smooth transition to menu open state
      gsap.fromTo(
        ".menu-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      // Fade in the menu items one by one
      gsap.fromTo(
        ".menu-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
        }
      );

      // Fade in social icons
      gsap.fromTo(
        ".social-menu",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.3, ease: "power2.out" }
      );
    } else {
      // Smooth transition to menu closed state
      gsap.to(".menu-overlay", {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }
}

// Page Transition Controller - NYE VERSION
class PageTransitionController {
  constructor() {
    this.loading = document.querySelector(".loading");
    this.init();
  }

  init() {
    if (!this.loading) {
      console.error("Loading element not found");
      return;
    }

    // Bestem hvilken side vi er på
    let currentPage = "index";
    if (window.location.pathname.includes("about.html")) {
      currentPage = "about";
    } else if (window.location.pathname.includes("projects.html")) {
      currentPage = "projects";
    }
    this.loading.setAttribute("data-page", currentPage);

    // Vis initial loading
    this.showInitialLoading();

    // Setup link listeners
    this.setupLinkListeners();
  }

  setupLinkListeners() {
    // Find alle links efter DOM er loadet
    setTimeout(() => {
      const allLinks = document.querySelectorAll("a[href]");

      allLinks.forEach((link) => {
        const href = link.getAttribute("href");

        // Check om det er et internt link til about, index eller projects
        if (
          href &&
          (href.includes("about.html") ||
            href.includes("index.html") ||
            href.includes("projects.html") ||
            href === "index" ||
            href === "about" ||
            href === "projects")
        ) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            this.showTransition(href);
          });
        }
      });
    }, 100);
  }

  showInitialLoading() {
    if (!this.loading) return;

    // Loading er allerede synlig fra CSS, så vi skal bare vente lidt før fade out
    // Fade out efter 0.5 sekunder
    setTimeout(() => {
      this.loading.classList.add("loading--out");

      setTimeout(() => {
        this.loading.style.visibility = "hidden";
        this.loading.style.opacity = "0";
        this.loading.classList.remove("loading--out");
      }, 700);
    }, 500);
  }

  showTransition(href) {
    if (!this.loading) return;
    // Bestem destination
    let destinationPage = "index";
    if (href.includes("about.html")) {
      destinationPage = "about";
    } else if (href.includes("projects.html")) {
      destinationPage = "projects";
    }

    // Opdater data-page
    this.loading.setAttribute("data-page", destinationPage);
    // Vis loading screen
    this.loading.style.visibility = "visible";
    this.loading.style.opacity = "1";
    this.loading.classList.add("loading--in");

    // Naviger efter 1 sekund
    setTimeout(() => {
      window.location.href = href;
    }, 1000);
  }
}

// Initialiser når DOM er ready
document.addEventListener("DOMContentLoaded", () => {
  new MenuController();
  new PageTransitionController();
});

// Eye Movement Controller
class EyeMovementController {
  constructor() {
    this.eyes = document.querySelectorAll(".eye");
    this.init();
  }

  init() {
    if (!window.matchMedia(CONFIG.MOBILE_BREAKPOINT).matches) {
      document.addEventListener("mousemove", (e) => this.handleEyeMovement(e));
    }
  }

  handleEyeMovement(e) {
    this.eyes.forEach((eye) => {
      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), 6);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }
}

// Progress Circle Controller
class ProgressCircleController {
  constructor() {
    this.circles = document.querySelectorAll(".progress-circle");
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries, observer) => this.handleIntersection(entries, observer),
      { threshold: CONFIG.CIRCLE_THRESHOLD }
    );

    this.circles.forEach((circle) => observer.observe(circle));
  }

  handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.animateCircle(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }

  animateCircle(circle) {
    const percentage = parseInt(circle.getAttribute("data-percentage"));
    const progressBar = circle.querySelector(".progress-bar");
    const progressText = circle.querySelector(".progress-text");
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    progressBar.style.transition = `stroke-dashoffset ${CONFIG.ANIMATION_DURATION}s ease-in-out`;
    progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
    progressBar.style.strokeDashoffset = circumference;

    setTimeout(() => {
      progressBar.style.strokeDashoffset = offset;
      this.animateCountUp(progressText, percentage);
    }, 100);
  }

  animateCountUp(element, target) {
    let count = 0;
    const duration = CONFIG.ANIMATION_DURATION * 1000;
    const steps = CONFIG.PROGRESS_STEPS;
    const increment = target / steps;
    const stepDuration = duration / steps;

    const interval = setInterval(() => {
      count = Math.min(count + increment, target);
      element.textContent = Math.round(count) + "%";

      if (count >= target) {
        clearInterval(interval);
      }
    }, stepDuration);
  }
}

// Notebook Controller
class NotebookController {
  constructor() {
    this.notebook = document.querySelector(".notebook-img");
    this.handwritingPaths = document.querySelectorAll(".handwriting");
    this.isAnimating = false;
    this.pathLengths = new Map();
    this.currentTimeline = null;
    this.init();
  }

  init() {
    if (!this.notebook || !this.handwritingPaths.length) return;

    this.setupPaths();
    this.setupEventListeners();
  }

  setupPaths() {
    this.handwritingPaths.forEach((path) => {
      const length = path.getTotalLength();
      this.pathLengths.set(path, length);

      // Indstil initial tilstand
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = length;
      path.style.transition = "none";
    });

    // Force reflow
    this.handwritingPaths[0].getBoundingClientRect();

    // Genaktiver transitions
    this.handwritingPaths.forEach((path) => {
      path.style.transition = `stroke-dashoffset ${CONFIG.ANIMATION_DURATION}s ease-in-out`;
    });
  }

  setupEventListeners() {
    this.notebook.addEventListener("mouseenter", () =>
      this.animateHandwriting(true)
    );
    this.notebook.addEventListener("mouseleave", () =>
      this.animateHandwriting(false)
    );
  }

  animateHandwriting(show) {
    // Hvis der er en aktiv animation, afbryd den
    if (this.currentTimeline) {
      this.currentTimeline.kill();
    }

    this.currentTimeline = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        this.currentTimeline = null;
      },
    });

    // Forskellige varigheder for ind og ud animation
    const duration = show ? CONFIG.ANIMATION_DURATION : 1.2;

    this.handwritingPaths.forEach((path, index) => {
      const length = this.pathLengths.get(path);
      this.currentTimeline.to(
        path,
        {
          strokeDashoffset: show ? 0 : length,
          duration: duration,
          ease: show ? "power2.out" : "power2.inOut",
        },
        show ? index * 0.1 : index * 0.05 // Lettere forskydning på både ind og ud
      );
    });
  }
}

// Initialiser alt når DOM'en er klar
// Pointer/Cursor Controller for projects page illustration
class PointerController {
  constructor() {
    this.pointer = null;
    this.illustration = null;
    this.isActive = false;
    this.init();
  }

  init() {
    // Only initialize on projects page
    if (!document.body.classList.contains("projects-page")) {
      return;
    }

    this.pointer = document.querySelector(".projects-page .pointer");
    this.illustration = document.querySelector(".projects-page .illustration");

    if (!this.pointer || !this.illustration) {
      return;
    }

    // Only enable on desktop
    if (window.matchMedia(CONFIG.MOBILE_BREAKPOINT).matches) {
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Track mouse movement when over the illustration
    this.illustration.addEventListener("mouseenter", () => {
      this.isActive = true;
    });

    this.illustration.addEventListener("mouseleave", () => {
      this.isActive = false;
      // Reset to center position when mouse leaves
      this.resetPointer();
    });

    // Track mouse movement
    this.illustration.addEventListener("mousemove", (e) => {
      if (this.isActive) {
        this.updatePointerPosition(e);
      }
    });
  }

  updatePointerPosition(e) {
    if (!this.pointer || !this.illustration) return;

    const rect = this.illustration.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage position within the illustration
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Constrain to reasonable bounds (within the laptop screen area)
    // Adjust these values based on where the cursor should appear
    const minX = 15;
    const maxX = 85;
    const minY = 35;
    const maxY = 75;

    const constrainedX = Math.max(minX, Math.min(maxX, xPercent));
    const constrainedY = Math.max(minY, Math.min(maxY, yPercent));

    // Update pointer position with smooth transition
    this.pointer.style.transform = `translate(${constrainedX}%, ${constrainedY}%)`;
  }

  resetPointer() {
    if (!this.pointer) return;
    // Reset to center of screen area
    this.pointer.style.transform = "translate(50%, 55%)";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EyeMovementController();
  new ProgressCircleController();
  new NotebookController();
  // PointerController removed - no longer needed for projects page
  // new PointerController();
});

/* Udkommenteret kode - gem til senere
document.addEventListener("DOMContentLoaded", function () {
  const circles = document.querySelectorAll(".progress-circle");
  // ... resten af den udkommenterede kode ... */

// Mobile Menu Controller
const burgerMenu = document.querySelector(".burger-menu");
const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");
const closeMenuButton = document.querySelector(".close-menu");

function toggleMobileMenu() {
  mobileMenuOverlay.classList.toggle("active");
  document.body.classList.toggle("menu-open");

  if (mobileMenuOverlay.classList.contains("active")) {
    // Animate menu items when opening
    gsap.fromTo(
      ".mobile-menu-nav .menu-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    // Animate social menu
    gsap.fromTo(
      ".mobile-menu-footer",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out",
      }
    );
  }
}

// Event listeners
burgerMenu.addEventListener("click", toggleMobileMenu);
closeMenuButton.addEventListener("click", toggleMobileMenu);

// Close menu when clicking outside
mobileMenuOverlay.addEventListener("click", (e) => {
  if (e.target === mobileMenuOverlay) {
    toggleMobileMenu();
  }
});

// Close menu when pressing escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenuOverlay.classList.contains("active")) {
    toggleMobileMenu();
  }
});
// Prevent body scroll when menu is open
document.body.addEventListener(
  "touchmove",
  (e) => {
    if (document.body.classList.contains("menu-open")) {
      e.preventDefault();
    }
  },
  { passive: false }
);
