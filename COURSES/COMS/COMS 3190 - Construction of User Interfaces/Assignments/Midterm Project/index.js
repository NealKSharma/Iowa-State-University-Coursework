// index.js — Neal Sharma (Member 1)
// SE/COM S 3190 · Spring 2026 · AH17

async function loadData() {
  const res = await fetch("data/data.json");
  if (!res.ok) throw new Error("Failed to load data.json");
  return res.json();
}

function renderStats(stats) {
  const el = document.getElementById("statsContainer");
  if (!el) return;
  el.innerHTML = stats.map(s => `
    <div class="col-6 col-md-3 sc-stat-item">
      <span class="sc-stat-number">${s.value}</span>
      <span class="sc-stat-label">${s.label}</span>
    </div>`).join("");
}

function renderFeatures(features) {
  const el = document.getElementById("featuresContainer");
  if (!el) return;
  el.innerHTML = features.map(f => `
    <div class="col-md-4">
      <div class="sc-feature-card">
        <div class="sc-feature-icon"><i class="bi ${f.icon}" aria-hidden="true"></i></div>
        <h4>${f.title}</h4>
        <p>${f.description}</p>
      </div>
    </div>`).join("");
}

async function init() {
  try {
    const data = await loadData();
    renderStats(data.hospitalStats);
    renderFeatures(data.features);
  } catch (err) {
    console.error("index.js:", err);
  }
}

document.addEventListener("DOMContentLoaded", init);