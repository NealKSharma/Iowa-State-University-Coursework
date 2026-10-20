/**
 * authors.js — Neal Sharma (Member 1)
 * Paired script for authors.html
 * SE/COM S 3190 · Spring 2026 · AH17
 */

async function loadData() {
  const res = await fetch("../data/data.json");
  if (!res.ok) throw new Error("Failed to load data.json");
  return res.json();
}

function renderAuthors(authors) {
  const el = document.getElementById("authorsContainer");
  if (!el) return;
  el.innerHTML = authors.map(a => `
    <div class="col-md-5">
      <div class="sc-author-card">
        <div class="sc-author-photo">
          <img src="../assets/myotherimages/${a.photo}" alt="Photo of ${a.name}" />
        </div>
        <div class="sc-author-info">
          <span class="sc-badge mb-2 d-inline-block">${a.role}</span>
          <h2 class="sc-author-name">${a.name}</h2>
          <p class="sc-author-meta-line">
            <i class="bi bi-mortarboard me-1" aria-hidden="true"></i>${a.year} &middot; ${a.major}
          </p>
          <a href="mailto:${a.email}" class="sc-author-email">
            <i class="bi bi-envelope me-1" aria-hidden="true"></i>${a.email}
          </a>
          <p class="sc-author-bio">${a.bio}</p>
          <p class="sc-author-course">
            <i class="bi bi-building me-1" aria-hidden="true"></i>Iowa State University &middot; SE/COM S 3190 &middot; Spring 2026
          </p>
        </div>
      </div>
    </div>`).join("");
}

async function init() {
  try {
    const data = await loadData();
    renderAuthors(data.authors);
  } catch (err) {
    console.error("authors.js:", err);
  }
}

document.addEventListener("DOMContentLoaded", init);