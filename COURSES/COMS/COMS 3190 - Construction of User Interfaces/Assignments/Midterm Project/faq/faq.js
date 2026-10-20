// faq.js - Saint Cy's Hospital FAQ page
// SE/COM S 3190 - Spring 2026 - AH17

let faqState = null;
let activeCategory = "All Topics";
let searchTerm = "";

async function loadData() {
  const res = await fetch("../data/data.json");
  if (!res.ok) throw new Error("Failed to load data.json");
  return res.json();
}

function renderHighlights(highlights) {
  const el = document.getElementById("faqHighlightsContainer");
  if (!el) return;

  el.innerHTML = highlights.map(item => `
    <div class="col-md-4">
      <div class="sc-appt-card h-100 text-center">
        <div class="sc-feature-icon"><i class="bi ${item.icon}" aria-hidden="true"></i></div>
        <h3 class="sc-appt-doctor mb-2">${item.title}</h3>
        <p class="sc-appt-desc mb-0">${item.description}</p>
      </div>
    </div>`).join("");
}

function renderCategories(categories) {
  const el = document.getElementById("faqCategoriesContainer");
  if (!el) return;

  const allCategories = ["All Topics", ...categories];
  el.innerHTML = allCategories.map(category => `
    <button
      type="button"
      class="btn ${category === activeCategory ? "btn-danger" : "btn-outline-secondary"} btn-sm"
      data-category="${category}">
      ${category}
    </button>`).join("");

  el.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderCategories(categories);
      renderFaqItems();
    });
  });
}

function getFilteredFaqs() {
  if (!faqState) return [];

  return faqState.items.filter(item => {
    const matchesCategory = activeCategory === "All Topics" || item.category === activeCategory;
    const haystack = `${item.question} ${item.answer} ${item.category}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderFaqItems() {
  const el = document.getElementById("faqAccordion");
  const emptyState = document.getElementById("faqEmptyState");
  if (!el || !emptyState) return;

  const filtered = getFilteredFaqs();
  if (filtered.length === 0) {
    el.innerHTML = "";
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");
  el.innerHTML = filtered.map((item, index) => `
    <div class="accordion-item">
      <h2 class="accordion-header" id="heading-${index}">
        <button class="accordion-button ${index === 0 ? "" : "collapsed"}" type="button"
          data-bs-toggle="collapse" data-bs-target="#collapse-${index}"
          aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="collapse-${index}">
          <span class="me-3 fw-bold text-danger">${item.category}</span>${item.question}
        </button>
      </h2>
      <div id="collapse-${index}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}"
        aria-labelledby="heading-${index}" data-bs-parent="#faqAccordion">
        <div class="accordion-body">
          ${item.answer}
        </div>
      </div>
    </div>`).join("");
}

function renderSupportOptions(options) {
  const el = document.getElementById("supportOptionsContainer");
  if (!el) return;

  el.innerHTML = options.map(option => `
    <div class="col-md-4">
      <div class="sc-appt-card h-100">
        <div class="sc-appt-header">
          <span class="sc-badge">${option.channel}</span>
          <i class="bi ${option.icon} text-danger" aria-hidden="true"></i>
        </div>
        <h5 class="sc-appt-doctor">${option.title}</h5>
        <p class="sc-appt-desc mb-2">${option.description}</p>
        <p class="sc-appt-time mb-1"><i class="bi bi-telephone me-2" aria-hidden="true"></i>${option.contact}</p>
        <small class="sc-med-access">${option.hours}</small>
      </div>
    </div>`).join("");
}

function attachEvents() {
  const searchInput = document.getElementById("faqSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", event => {
    searchTerm = event.target.value;
    renderFaqItems();
  });
}

async function init() {
  try {
    const data = await loadData();
    faqState = data.faqPage;
    if (!faqState) throw new Error("faqPage missing from data.json");

    renderHighlights(faqState.highlights);
    renderCategories(faqState.categories);
    renderFaqItems();
    renderSupportOptions(faqState.supportOptions);
    attachEvents();
  } catch (err) {
    console.error("faq.js:", err);
  }
}

document.addEventListener("DOMContentLoaded", init);
