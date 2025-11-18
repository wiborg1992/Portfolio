// Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuButtons = document.querySelectorAll(".menu-button");
  const closeButton = document.querySelector(".close-button");
  const menuOverlay = document.querySelector(".menu-overlay");
  const body = document.body;

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      menuOverlay.classList.add("active");
      body.classList.add("lock-scroll");
    });
  });

  closeButton.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
    body.classList.remove("lock-scroll");
  });
});

// Progress Bars Animation
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar");
  const progressTexts = document.querySelectorAll(".progress-text");

  progressBars.forEach((bar, index) => {
    const percent = progressTexts[index].textContent;
    const value = parseInt(percent);
    const circumference = 2 * Math.PI * 45; // r = 45
    const offset = circumference - (value / 100) * circumference;

    bar.style.strokeDasharray = circumference;
    bar.style.strokeDashoffset = circumference;

    setTimeout(() => {
      bar.style.strokeDashoffset = offset;
    }, 100);
  });
}

// Trigger progress animation when section is in view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateProgressBars();
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.addEventListener("DOMContentLoaded", function () {
  const progressSection = document.querySelector(".progress-section");
  if (progressSection) {
    observer.observe(progressSection);
  }
});
