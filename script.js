// ============================================================
// MEGA Phone And More — Link in Bio
// ============================================================

// All outbound destinations live here. Edit these values only.
const links = {
  whatsapp: "https://whatsapp.com/channel/0029Vb7lGWuEquiZL7Ujm505/",
  instagram: "https://www.instagram.com/megaphone_eg?igsh=bWR5bDRpOXA2ZjVq&utm_source=qr",
  facebook: "https://www.facebook.com/share/1NwhVxJhsv/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@mega.phone_eg?_r=1&_t=ZS-97cMXStoM09",
  instapay: "https://ipn.eg/S/ilkia/instapay/93TGEt",
  rating: "https://maps.app.goo.gl/5PYBJnXiV4zfto4z8?g_st=ic"
};

// Wire each link card to its destination from the `links` object above.
function applyLinks() {
  document.querySelectorAll("[data-link]").forEach((card) => {
    const key = card.getAttribute("data-link");
    const url = links[key];

    if (url) {
      card.setAttribute("href", url);
    } else {
      // No URL configured yet: keep the card visible but inert.
      card.removeAttribute("href");
      card.setAttribute("aria-disabled", "true");
      card.addEventListener("click", (e) => e.preventDefault());
    }
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

// ---------- Vodafone Cash: expand to reveal numbers, tap to copy ----------
function initVfCash() {
  const card = document.getElementById("vfCashCard");
  const trigger = document.getElementById("vfCashTrigger");

  trigger.addEventListener("click", () => {
    const isOpen = card.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  card.querySelectorAll(".vf-number-row").forEach((row) => {
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
  applyLinks();
  initParallax();
  initVfCash();
  initComplaintModal();
  initFabContact();
  initPullToRefresh();
});
