// ============================================================
// MEGA Phone And More — Link in Bio
// ============================================================

// ---------- Loading screen ----------
function initLoadingScreen() {
  const screen = document.getElementById("loadingScreen");
  if (!screen) {
    document.body.classList.add("is-loaded");
    return;
  }

  const reveal = () => {
    document.body.classList.add("is-loaded");
    screen.classList.add("is-hidden");
    screen.addEventListener("transitionend", () => screen.remove(), { once: true });
  };

  // Minimum display time so the loading animation is perceptible,
  // capped so slow connections don't feel stuck.
  const minTime = new Promise((resolve) => setTimeout(resolve, 700));
  const pageReady = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });
  const failSafe = new Promise((resolve) => setTimeout(resolve, 2500));

  Promise.race([Promise.all([minTime, pageReady]), failSafe]).then(reveal);
}

// ---------- Toast notifications ----------
function showToast(message, type = "success") {
  const stack = document.getElementById("toastStack");
  if (!stack) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = type === "error"
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-check"></i>';

  const text = document.createElement("span");
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  stack.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("is-visible"));

  setTimeout(() => {
    toast.classList.add("is-leaving");
    toast.classList.remove("is-visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 3600);
}

// ---------- Touch ripple feedback on link cards ----------
function initTouchRipple() {
  const targets = document.querySelectorAll(".link-card, .link-card-trigger");
  targets.forEach((el) => {
    el.addEventListener("touchstart", (e) => {
      const host = el.classList.contains("link-card") ? el : el.closest(".link-card");
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const touch = e.touches[0];
      const size = Math.max(rect.width, rect.height) * 1.4;
      const ripple = document.createElement("span");
      ripple.className = "link-card-ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (touch.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (touch.clientY - rect.top - size / 2) + "px";
      host.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    }, { passive: true });
  });
}

// ---------- Dynamic background on scroll ----------
function initParallax() {
  const scrollArea = document.querySelector(".scroll-area");
  const page = document.querySelector(".page");
  let ticking = false;

  scrollArea.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const shift = Math.min(scrollArea.scrollTop * 0.12, 60);
      page.style.setProperty("--bg-shift", shift + "px");
      ticking = false;
    });
  });
}

// ---------- Expandable cards: generic open/close toggle ----------
function initExpandableCards() {
  document.querySelectorAll(".link-card--expandable").forEach((card) => {
    const trigger = card.querySelector(".link-card-trigger");
    trigger.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
}

// ---------- Vodafone Cash: tap a number to copy it ----------
function initVfCashCopy() {
  document.querySelectorAll(".vf-number-row").forEach((row) => {
    row.addEventListener("click", async () => {
      const number = row.getAttribute("data-number");
      const copyLabel = row.querySelector(".vf-copy");
      const copyText = row.querySelector(".vf-copy-text");
      const originalText = copyText.textContent;

      try {
        await navigator.clipboard.writeText(number);
        copyText.textContent = "Copied";
        copyLabel.classList.add("is-copied");
      } catch (err) {
        copyText.textContent = "Copy failed";
      }

      setTimeout(() => {
        copyText.textContent = originalText;
        copyLabel.classList.remove("is-copied");
      }, 1500);
    });
  });
}

// ---------- EmailJS ----------
// Replace these with your own IDs from https://dashboard.emailjs.com
// The recipient address is set inside your EmailJS template, so it never
// needs to appear here or anywhere on the page.
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

emailjs.init(EMAILJS_PUBLIC_KEY);

// ---------- Complaint modal ----------
function initComplaintModal() {
  const trigger = document.getElementById("complaintTrigger");
  const overlay = document.getElementById("complaintModal");
  const closeBtn = document.getElementById("modalClose");
  const form = document.getElementById("complaintForm");
  const submitBtn = document.getElementById("modalSubmit");
  const submitLabel = submitBtn.querySelector(".modal-submit-label");
  const status = document.getElementById("modalStatus");

  const fields = {
    name: {
      input: document.getElementById("complaintName"),
      error: document.getElementById("complaintNameError"),
      validate: (v) => v.trim().length > 0,
      message: "Please enter your name.",
    },
    email: {
      input: document.getElementById("complaintEmail"),
      error: document.getElementById("complaintEmailError"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: "Please enter a valid email address.",
    },
    message: {
      input: document.getElementById("complaintMessage"),
      error: document.getElementById("complaintMessageError"),
      validate: (v) => v.trim().length > 0,
      message: "Please describe your complaint.",
    },
  };

  function setFieldError(field, show) {
    const wrapper = field.input.closest(".modal-field");
    if (show) {
      field.error.textContent = field.message;
      wrapper.classList.add("has-error");
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.error.textContent = "";
      wrapper.classList.remove("has-error");
      field.input.removeAttribute("aria-invalid");
    }
  }

  function validateField(key) {
    const field = fields[key];
    const valid = field.validate(field.input.value);
    setFieldError(field, !valid);
    return valid;
  }

  function validateAll() {
    return Object.keys(fields)
      .map((key) => validateField(key))
      .every(Boolean);
  }

  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener("blur", () => validateField(key));
    fields[key].input.addEventListener("input", () => {
      const wrapper = fields[key].input.closest(".modal-field");
      if (wrapper.classList.contains("has-error")) validateField(key);
    });
  });

  function openModal() {
    overlay.classList.add("is-open");
    setTimeout(() => fields.name.input.focus(), 300);
  }

  function closeModal() {
    overlay.classList.remove("is-open");
    trigger.focus();
  }

  trigger.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateAll()) {
      const firstInvalid = Object.keys(fields).find(
        (key) => !fields[key].validate(fields[key].input.value)
      );
      if (firstInvalid) fields[firstInvalid].input.focus();
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = "Sending...";
    status.textContent = "";
    status.className = "modal-status";

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        status.textContent = "Your complaint has been sent. Thank you!";
        status.classList.add("is-success");
        showToast("Complaint sent successfully.", "success");
        form.reset();
        Object.keys(fields).forEach((key) => setFieldError(fields[key], false));
        setTimeout(closeModal, 1800);
      })
      .catch(() => {
        status.textContent = "Something went wrong. Please try again.";
        status.classList.add("is-error");
        showToast("Something went wrong. Please try again.", "error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitLabel.textContent = "Send Complaint";
      });
  });
}

// ---------- Floating contact button: extend on tap (touch devices) ----------
function initFabContact() {
  const fab = document.querySelector(".fab-contact");
  if (!fab) return;

  fab.addEventListener("touchstart", () => {
    fab.classList.add("is-active");
    setTimeout(() => fab.classList.remove("is-active"), 2000);
  });
}

// ---------- Pull to refresh ----------
function initPullToRefresh() {
  const scrollArea = document.querySelector(".scroll-area");
  const indicator = document.getElementById("pullRefresh");
  const threshold = 70;
  let startY = 0;
  let pulling = false;

  scrollArea.addEventListener("touchstart", (e) => {
    pulling = scrollArea.scrollTop === 0;
    startY = e.touches[0].clientY;
  }, { passive: true });

  scrollArea.addEventListener("touchmove", (e) => {
    if (!pulling) return;
    const delta = e.touches[0].clientY - startY;
    if (delta <= 0) return;

    const pull = Math.min(delta, threshold * 1.5);
    indicator.style.height = pull + "px";
    indicator.style.setProperty("--pull-rotate", Math.min(pull / threshold, 1) * 360 + "deg");
    indicator.classList.add("is-visible");
    indicator.classList.toggle("is-ready", pull >= threshold);

    if (delta > 10) e.preventDefault();
  }, { passive: false });

  scrollArea.addEventListener("touchend", () => {
    if (!pulling) return;
    pulling = false;

    if (indicator.classList.contains("is-ready")) {
      indicator.style.height = threshold + "px";
      setTimeout(() => location.reload(), 300);
    } else {
      indicator.style.height = "0px";
      indicator.classList.remove("is-visible", "is-ready");
    }
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  initParallax();
  initExpandableCards();
  initVfCashCopy();
  initComplaintModal();
  initFabContact();
  initPullToRefresh();
});
