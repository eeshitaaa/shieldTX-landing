const revealTargets = document.querySelectorAll("[data-reveal]");

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

const hero = document.querySelector(".hero");
const heroMedia = document.querySelector(".hero-media");
const heroMotionLayer = document.querySelector(".hero-motion-layer");
const phoneShowcase = document.querySelector(".phone-showcase");
const phoneFrame = document.querySelector("[data-phone-frame]");
const phoneVideo = document.querySelector(".phone-video");
const compareConsole = document.querySelector("[data-compare-console]");

const compareVerdicts = {
  shieldtx: {
    title: "ShieldTX",
    copy: "Private execution, wallet de-linking, and low overhead without giving up custody."
  },
  direct: {
    title: "Direct Hyperliquid",
    copy: "Native custody stays intact, but your fills and patterns remain visible to copy bots."
  },
  multi: {
    title: "Multi-Wallet",
    copy: "More wallets add work, but timing and behavior still link the trail back together."
  },
  cex: {
    title: "CEX",
    copy: "Confidentiality improves, but custody, venue access, and composability move out of your hands."
  }
};

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

if (compareConsole) {
  const compareButtons = compareConsole.querySelectorAll("[data-compare-option]");
  const compareTitle = compareConsole.querySelector("[data-compare-title]");
  const compareCopy = compareConsole.querySelector("[data-compare-copy]");

  const setCompareOption = (option) => {
    const verdict = compareVerdicts[option];
    if (!verdict) return;

    compareConsole.dataset.activeOption = option;
    compareButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.compareOption === option);
    });
    if (compareTitle) compareTitle.textContent = verdict.title;
    if (compareCopy) compareCopy.textContent = verdict.copy;
  };

  compareButtons.forEach((button) => {
    button.addEventListener("click", () => setCompareOption(button.dataset.compareOption));
    button.addEventListener("mouseenter", () => setCompareOption(button.dataset.compareOption));
  });

  compareConsole.addEventListener("pointermove", (event) => {
    const rect = compareConsole.getBoundingClientRect();
    compareConsole.style.setProperty("--compare-x", `${event.clientX - rect.left}px`);
    compareConsole.style.setProperty("--compare-y", `${event.clientY - rect.top}px`);
  });
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
const betaError = document.querySelector("[data-beta-error]");
let betaStepIndex = 0;

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

betaOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    betaSection?.classList.add("is-open");
    betaCard?.setAttribute("aria-hidden", "false");
    setBetaStep(0);
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
  setBetaStep(0);
});

setBetaStep(0);
