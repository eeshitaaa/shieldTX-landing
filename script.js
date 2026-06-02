const revealTargets = document.querySelectorAll("[data-reveal]:not(.save-card)");
const saveCards = document.querySelectorAll(".save-card[data-reveal]");
const saveCardGrid = document.querySelector(".save-card-grid");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

revealTargets.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  revealObserver.observe(target);
});

const replaySaveCards = () => {
  saveCards.forEach((card) => {
    card.classList.remove("is-visible");
  });

  window.requestAnimationFrame(() => {
    saveCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 110}ms`;
      card.classList.add("is-visible");
    });
  });
};

if (saveCardGrid && saveCards.length) {
  const saveCardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          replaySaveCards();
        } else {
          saveCards.forEach((card) => {
            card.classList.remove("is-visible");
          });
        }
      });
    },
    { threshold: 0.22, rootMargin: "-10% 0px -18% 0px" }
  );

  saveCardsObserver.observe(saveCardGrid);
}

const hero = document.querySelector(".hero");
const heroMedia = document.querySelector(".hero-media");
const heroMotionLayer = document.querySelector(".hero-motion-layer");
const phoneShowcase = document.querySelector(".phone-showcase");
const phoneFrame = document.querySelector("[data-phone-frame]");
const phoneVideo = document.querySelector(".phone-video");

let ticking = false;
let pointerX = 0;

if (phoneVideo) {
  phoneVideo.preload = "auto";
  phoneVideo.defaultPlaybackRate = 0.65;
  phoneVideo.playbackRate = 0.65;
  phoneVideo.addEventListener("loadedmetadata", () => {
    phoneVideo.playbackRate = 0.65;
  });
  phoneVideo.load();
  phoneVideo.play().catch(() => {});
}

const updateScrollEffects = () => {
  if (hero && heroMedia) {
    const heroRect = hero.getBoundingClientRect();
    const progress = Math.min(Math.max(-heroRect.top / heroRect.height, 0), 1);
    heroMedia.style.setProperty("--hero-drift", `${progress * 28}px`);
    heroMedia.style.setProperty("--hero-x", `${pointerX * 14}px`);
    heroMotionLayer?.style.setProperty("--hero-drift", `${progress * 28}px`);
    heroMotionLayer?.style.setProperty("--hero-x", `${pointerX * 14}px`);
  }

  if (phoneShowcase && phoneFrame) {
    const phoneRect = phoneShowcase.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const targetProgress = Math.min(Math.max((viewport * 0.92 - phoneRect.top) / (viewport * 0.9), 0), 1);
    phoneFrame.style.setProperty("--phone-progress", targetProgress.toFixed(3));
    if (targetProgress > 0.05) {
      phoneVideo?.play().catch(() => {});
    }
  }

  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener(
  "pointermove",
  (event) => {
    pointerX = event.clientX / window.innerWidth - 0.5;

    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true }
);

updateScrollEffects();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.matches("[data-beta-open]")) return;

    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", targetId);
  });
});

document.querySelector(".wallet-scan-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
});

const betaSection = document.querySelector(".private-beta-section");
const betaCard = document.querySelector("[data-beta-card]");
const betaOpenButtons = document.querySelectorAll("[data-beta-open]");
const betaForm = document.querySelector("[data-beta-form]");
const betaSteps = [...document.querySelectorAll("[data-beta-step]")];
const betaProgress = document.querySelector("[data-beta-progress]");
const betaBack = document.querySelector("[data-beta-back]");
const betaNext = document.querySelector("[data-beta-next]");
const betaSubmit = document.querySelector("[data-beta-submit]");
const betaDone = document.querySelector("[data-beta-done]");
const betaClose = document.querySelector("[data-beta-close]");
const betaError = document.querySelector("[data-beta-error]");
const platformSelect = document.querySelector("[data-platform-select]");
const platformTrigger = document.querySelector("[data-platform-trigger]");
const platformLabel = document.querySelector("[data-platform-label]");
const platformChecks = [...document.querySelectorAll('[name="platforms"]')];
let betaStepIndex = 0;

function closeBetaCard() {
  betaSection?.classList.remove("is-open");
  betaCard?.setAttribute("aria-hidden", "true");
  if (betaError) betaError.hidden = true;
}

function openBetaCard(trigger) {
  betaSection?.classList.add("is-open");
  betaCard?.setAttribute("aria-hidden", "false");
  setBetaStep(0);

  if (trigger?.tagName === "A" && betaSection) {
    betaSection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", "#access");
    return;
  }

  if (window.matchMedia("(max-width: 860px)").matches) {
    window.setTimeout(() => {
      betaCard?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 180);
  }
}

function setBetaStep(index) {
  betaStepIndex = Math.max(0, Math.min(index, betaSteps.length - 1));
  const activeStep = betaSteps[betaStepIndex]?.dataset.betaStep;

  betaSteps.forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex === betaStepIndex);
  });

  const isResult = activeStep === "result";
  const progressSteps = isResult ? 4 : betaStepIndex + 1;
  if (betaProgress) betaProgress.style.width = `${Math.min(progressSteps / 3, 1) * 100}%`;
  if (betaBack) betaBack.hidden = betaStepIndex === 0 || isResult;
  if (betaNext) betaNext.hidden = betaStepIndex >= 2 || isResult;
  if (betaSubmit) betaSubmit.hidden = betaStepIndex !== 2 || isResult;
  if (betaDone) betaDone.hidden = !isResult;
  if (betaError) betaError.hidden = true;
}

function betaCurrentStepValid() {
  const currentStep = betaSteps[betaStepIndex];
  if (!currentStep) return true;
  const requiredFields = [...currentStep.querySelectorAll("input[required], select[required]")];
  return requiredFields.every((field) => field.checkValidity());
}

function updatePlatformLabel() {
  if (!platformSelect || !platformLabel) return;

  const selected = platformChecks.filter((input) => input.checked).map((input) => input.value);
  platformSelect.classList.toggle("has-value", selected.length > 0);
  platformLabel.textContent = selected.length ? selected.join(", ") : "Select platforms...";
}

function closePlatformSelect() {
  platformSelect?.classList.remove("is-open");
  platformTrigger?.setAttribute("aria-expanded", "false");
}

betaOpenButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openBetaCard(button);
  });
});

betaNext?.addEventListener("click", () => {
  if (!betaCurrentStepValid()) {
    if (betaError) betaError.hidden = false;
    return;
  }
  setBetaStep(betaStepIndex + 1);
});

betaBack?.addEventListener("click", () => {
  setBetaStep(betaStepIndex - 1);
});

betaClose?.addEventListener("click", closeBetaCard);

betaForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!betaCurrentStepValid()) {
    if (betaError) betaError.hidden = false;
    return;
  }
  setBetaStep(3);
});

betaDone?.addEventListener("click", () => {
  betaForm?.reset();
  updatePlatformLabel();
  setBetaStep(0);
});

platformTrigger?.addEventListener("click", () => {
  const open = !platformSelect?.classList.contains("is-open");
  platformSelect?.classList.toggle("is-open", open);
  platformTrigger.setAttribute("aria-expanded", String(open));
});

platformChecks.forEach((input) => {
  input.addEventListener("change", updatePlatformLabel);
});

document.addEventListener("click", (event) => {
  if (!platformSelect?.contains(event.target)) closePlatformSelect();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePlatformSelect();
});

setBetaStep(0);
updatePlatformLabel();
