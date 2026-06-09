// ── Nav scroll detection ─────────────────────────────────────────────
const nav = document.querySelector("nav");

function updateNav() {
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
}

window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

// ── Mobile Navigation Toggle ──────────────────────────────────────────
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");

if (toggle && links) {
  const topLines = toggle.querySelector(".line-top");
  const midLines = toggle.querySelector(".line-mid");
  const botLines = toggle.querySelector(".line-bot");
  let open = false;

  function toggleMenu(state) {
    open = state !== undefined ? state : !open;

    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);

    // Morph paths smoothly between Hamburger menu bars and Close X configs
    if (open) {
      if (topLines) topLines.setAttribute("d", "M6 18L18 6M6 6l12 12");
      if (midLines) midLines.style.opacity = "0";
      if (botLines) botLines.setAttribute("d", "M6 18L18 6M6 6l12 12");
    } else {
      if (topLines) topLines.setAttribute("d", "M4 6h16");
      if (midLines) midLines.style.opacity = "1";
      if (botLines) botLines.setAttribute("d", "M4 18h16");
    }
  }

  toggle.addEventListener("click", () => toggleMenu());

  // Close layout drawer whenever a section shortcut link is clicked
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => toggleMenu(false));
  });
}

// ── Intersection Scroll Reveal ────────────────────────────────────────
const revealSections = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
);

// Fallback protection: if sections are outside window view or Observer fails
if ("IntersectionObserver" in window) {
  revealSections.forEach((el) => observer.observe(el));
} else {
  revealSections.forEach((el) => el.classList.add("visible"));
}

// ── Web3Forms Advanced Inline Contact Form Handler ───────────────────────
const form = document.querySelector("#contact form");

if (form) {
  // Create an inline status message block dynamically if it doesn't exist
  let status = document.getElementById("form-status");
  if (!status) {
    status = document.createElement("div");
    status.id = "form-status";
    status.style.marginTop = "15px";
    status.style.padding = "10px";
    status.style.borderRadius = "4px";
    status.style.fontSize = "14px";
    status.style.display = "none";
    form.appendChild(status);
  }

  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop page from hard reloading

    // Read values safely on submission event trigger
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.style.display = "block";
      status.style.background = "rgba(239, 68, 68, 0.1)";
      status.style.color = "#ef4444";
      status.textContent = "Please fill out all fields.";
      return;
    }

    // Set interactive visual sending state
    const originalBtnText = btn.innerHTML;
    btn.textContent = "Sending...";
    btn.disabled = true;
    status.style.display = "none";

    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        status.style.display = "block";
        status.style.background = "rgba(34, 197, 94, 0.1)";
        status.style.color = "#22c55e";
        status.textContent = "Message sent successfully! We will be in touch.";
        form.reset();
      } else {
        throw new Error(data.message || "Form submission rejected.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      status.style.display = "block";
      status.style.background = "rgba(239, 68, 68, 0.1)";
      status.style.color = "#ef4444";
      status.textContent =
        "Something went wrong. Please try again or email us directly.";
    } finally {
      // Restore button status control variables
      btn.innerHTML = originalBtnText;
      btn.disabled = false;
    }
  });
}
