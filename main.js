document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu-lin");
  const overlay = document.getElementById("menu-overlay");
  const closeButton = document.getElementById("close-button");

  // Åbn menuen
  menuButton.addEventListener("click", () => {
    overlay.classList.add("show");
  });

  // Luk menuen
  closeButton.addEventListener("click", () => {
    overlay.classList.remove("show");
  });

  // Luk hvis man klikker udenfor menuen
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.classList.remove("show");
    }
  });
});

document.addEventListener("mousemove", (e) => {
  const eyes = document.querySelectorAll(".eye");

  eyes.forEach((eye) => {
    /* Find centrum af hvert øje */
    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    /* Beregn musens afstand til øjets centrum */
    const deltaX = e.clientX - eyeCenterX;
    const deltaY = e.clientY - eyeCenterY;

    /* Beregn retningen */
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), 6); // Maks 6px bevægelse

    /* Flyt øjnene i retning af musen */
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    /* Opdater øjnenes position */
    eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});

const notebook = document.querySelector(".notebook-img");

document.addEventListener("DOMContentLoaded", () => {
  if (notebook) {
    notebook.addEventListener("mouseenter", () => {
      console.log("Mouse entered notebook!"); // Debugging
      gsap.to(".handwriting", {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out",
      });
    });

    notebook.addEventListener("mouseleave", () => {
      console.log("Mouse left notebook!"); // Debugging
      gsap.to(".handwriting", {
        strokeDashoffset: 220,
        duration: 1,
        ease: "power2.in",
      });
    });
  } else {
    console.error("Notebook element not found!");
  }
});

// Eksisterende kode med tilføjet onUpdate
notebook.addEventListener("mouseenter", () => {
  console.log("Mouse entered notebook!");
  gsap.to(".handwriting", {
    strokeDashoffset: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: "power2.out",
    onUpdate: function () {
      this.targets().forEach((path) => {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = `${pathLength} ${pathLength}`;
      });
    },
  });
});

// Mobile menu toggle
document.querySelector(".burger-menu").addEventListener("click", function () {
  this.classList.toggle("active");
  document.querySelector(".mobile-menu").classList.toggle("active");
});

// Luk menu ved klik udenfor
document.addEventListener("click", function (e) {
  if (!e.target.closest(".burger-menu") && !e.target.closest(".mobile-menu")) {
    document.querySelector(".burger-menu").classList.remove("active");
    document.querySelector(".mobile-menu").classList.remove("active");
  }
});

// I din main.js
if (window.matchMedia("(max-width: 768px)").matches) {
  document.removeEventListener("mousemove", eyeMovementHandler);
}

// Fjern også GSAP animationer på mobile
if (window.innerWidth <= 1083) {
  gsap.to(".eyes", { autoAlpha: 0 });
}
