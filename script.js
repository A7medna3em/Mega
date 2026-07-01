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
  rating: "https://maps.app.goo.gl/5PYBJnXiV4zfto4z8?g_st=ic",
  complaint: "mailto:" + ["magedelmenshawy", "icloud.com"].join("@")
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

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  applyLinks();
  initParallax();
  initVfCash();
});
