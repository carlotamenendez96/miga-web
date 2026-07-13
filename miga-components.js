/**
 * MIGA · Utilidades JS del sistema de componentes
 * - MigaCrumbProgress: sincroniza pasos con fieldsets del formulario
 */
(function () {
  "use strict";

  function initCrumbProgress(root) {
    var form = root.closest("form") || root;
    var steps = root.querySelectorAll(".miga-crumb-progress__step");
    var fieldsets = form.querySelectorAll("[data-miga-step]");
    if (!steps.length) return;

    function setStep(index) {
      steps.forEach(function (step, i) {
        step.classList.remove(
          "miga-crumb-progress__step--done",
          "miga-crumb-progress__step--current"
        );
        if (i < index) step.classList.add("miga-crumb-progress__step--done");
        if (i === index) step.classList.add("miga-crumb-progress__step--current");
      });
      root.setAttribute("aria-valuenow", String(index + 1));
    }

    if (fieldsets.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var idx = Number(entry.target.getAttribute("data-miga-step"));
              if (!isNaN(idx)) setStep(idx);
            }
          });
        },
        { root: null, rootMargin: "-20% 0px -55% 0px", threshold: 0 }
      );
      fieldsets.forEach(function (fs) {
        observer.observe(fs);
      });
    }

    root.addEventListener("click", function (e) {
      var step = e.target.closest(".miga-crumb-progress__step");
      if (!step || !step.dataset.step) return;
      var target = form.querySelector(
        '[data-miga-step="' + step.dataset.step + '"]'
      );
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function initCrumbTrail(trail) {
    var items = trail.querySelectorAll(".miga-crumb-trail__item");
    if (!items.length) return;

    var activeIndex = Number(trail.dataset.active) || 0;
    items.forEach(function (item, i) {
      item.classList.remove("miga-crumb-trail__item--active", "miga-crumb-trail__item--done");
      if (i < activeIndex) item.classList.add("miga-crumb-trail__item--done");
      if (i === activeIndex) item.classList.add("miga-crumb-trail__item--active");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-miga-crumb-progress]").forEach(initCrumbProgress);
    document.querySelectorAll(".miga-crumb-trail").forEach(initCrumbTrail);
  });
})();
