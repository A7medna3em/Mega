// ============================================================
// MEGA Phone And More — Link in Bio
// ============================================================


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
  const status = document.getElementById("modalStatus");

  function openModal() {
    overlay.classList.add("is-open");
  }

  function closeModal() {
    overlay.classList.remove("is-open");
  }

  trigger.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    status.textContent = "";
    status.className = "modal-status";

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        status.textContent = "Your complaint has been sent. Thank you!";
        status.classList.add("is-success");
        form.reset();
        setTimeout(closeModal, 1800);
      })
      .catch(() => {
        status.textContent = "Something went wrong. Please try again.";
        status.classList.add("is-error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Complaint";
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
