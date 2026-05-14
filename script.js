const revealTargets = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const header = document.querySelector(".site-header");

window.addEventListener(
  "scroll",
  () => {
    const alpha = Math.min(window.scrollY / 420, 1);
    header.style.background = `rgba(5, 5, 5, ${0.72 + alpha * 0.18})`;
  },
  { passive: true }
);
