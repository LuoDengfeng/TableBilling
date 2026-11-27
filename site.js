(() => {
  "use strict";

  const storageKey = "table-billing-site-language";
  let preference = "auto";

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "zh" || saved === "en") preference = saved;
  } catch {
    // Language selection still works when browser storage is unavailable.
  }

  function systemLanguage() {
    const language = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    return /^zh(?:-|$)/i.test(language) ? "zh" : "en";
  }

  function applyLanguage() {
    const language = preference === "auto" ? systemLanguage() : preference;
    document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";

    const title = document.querySelector("title");
    if (title && title.dataset[language]) title.textContent = title.dataset[language];

    const description = document.querySelector('meta[name="description"]');
    if (description && description.dataset[language]) description.content = description.dataset[language];

    document.querySelectorAll("[data-language]").forEach((content) => {
      content.hidden = content.dataset.language !== language;
    });
    document.querySelectorAll("[data-set-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.setLanguage === preference));
    });
    document.querySelectorAll(".language-picker").forEach((picker) => {
      picker.setAttribute("aria-label", language === "zh" ? "选择语言" : "Choose language");
    });
  }

  function initializePicker() {
    applyLanguage();
    document.querySelectorAll("[data-set-language]").forEach((button) => {
      button.addEventListener("click", () => {
        preference = button.dataset.setLanguage;
        try {
          if (preference === "auto") localStorage.removeItem(storageKey);
          else localStorage.setItem(storageKey, preference);
        } catch {
          // Keep the selected language for this page without requiring storage.
        }
        applyLanguage();
      });
    });
    document.querySelectorAll(".language-picker").forEach((picker) => {
      picker.hidden = false;
    });
  }

  // Set the language before the stylesheet and page content are rendered.
  applyLanguage();
  window.addEventListener("languagechange", () => {
    if (preference === "auto") applyLanguage();
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePicker, { once: true });
  } else {
    initializePicker();
  }
})();
