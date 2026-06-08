// ── Mobile nav ──────────────────────────────────────────────────────────
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
const topLines = toggle.querySelector(".line-top");
const midLines = toggle.querySelector(".line-mid");
const botLines = toggle.querySelector(".line-bot");
let open = false;

function toggleMenu(state) {
  open = state !== undefined ? state : !open;

  links.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);

  // Morphs the lines smoothly between Hamburger and Close X configurations
  if (open) {
    topLines.setAttribute("d", "M6 18L18 6M6 6l12 12");
    midLines.style.opacity = "0";
    botLines.setAttribute("d", "M6 18L18 6M6 6l12 12");
  } else {
    topLines.setAttribute("d", "M4 6h16");
    midLines.style.opacity = "1";
    botLines.setAttribute("d", "M4 18h16");
  }
}

toggle.addEventListener("click", () => toggleMenu());

// Close layout on link click option choices
links.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => toggleMenu(false));
});

// ── Scroll reveal ───────────────────────────────────────────────────────
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
    rootMargin: "0px 0px -50px 0px", // Triggers early for smooth transition entries
  },
);

// Fallback protection: if sections are outside window view or Observer fails, load them
if ("IntersectionObserver" in window) {
  revealSections.forEach((el) => observer.observe(el));
} else {
  revealSections.forEach((el) => el.classList.add("visible"));
}

// ── Contact form ────────────────────────────────────────────────────────
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const btn = document.getElementById("form-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "form-status";
  status.textContent = "";

  const name = form.name.value.trim();
  const email = form.email.value.trim().toLowerCase();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    status.className = "form-status error";
    status.textContent = "Please fill in all fields.";
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    status.className = "form-status error";
    status.textContent = "Please enter a valid email address.";
    return;
  }

  btn.textContent = "Sending...";
  btn.disabled = true;

  try {
    // Points to your new API function endpoint relative path
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      status.className = "form-status success";
      status.textContent = "Message sent. We will be in touch.";
      form.reset();
    } else {
      throw new Error(data.message || "Send failed");
    }
  } catch (error) {
    console.error("Submission fallback triggered:", error);
    // Fallback directly to mailto client redirection if API fails
    const mailto = `mailto:hello@redetafrica.com?subject=${encodeURIComponent("Enquiry from " + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message)}`;
    window.location.href = mailto;
  } finally {
    btn.innerHTML = `Send Message <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>`;
    btn.disabled = false;
  }
});
