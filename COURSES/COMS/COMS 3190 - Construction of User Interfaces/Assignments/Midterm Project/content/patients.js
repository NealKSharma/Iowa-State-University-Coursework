// patients.js — Neal Sharma (Member 1)
// SE/COM S 3190 · Spring 2026 · AH17

async function loadData() {
  const res = await fetch("../data/data.json");
  if (!res.ok) throw new Error("Failed to load data.json");
  return res.json();
}

function renderAppointments(appointments) {
  const el = document.getElementById("appointmentsContainer");
  if (!el) return;
  el.innerHTML = appointments.map(a => `
    <div class="col-md-4">
      <div class="sc-appt-card">
        <div class="sc-appt-header">
          <span class="sc-badge">${a.department}</span>
          <span class="sc-appt-status ${a.status === 'Upcoming' ? 'status-upcoming' : 'status-past'}">${a.status}</span>
        </div>
        <h5 class="sc-appt-doctor">${a.doctor}</h5>
        <p class="sc-appt-date"><i class="bi bi-calendar3 me-2" aria-hidden="true"></i>${a.date}</p>
        <p class="sc-appt-time"><i class="bi bi-clock me-2" aria-hidden="true"></i>${a.time}</p>
        <p class="sc-appt-desc">${a.description}</p>
      </div>
    </div>`).join("");
}

function renderPharmacy(medications) {
  const el = document.getElementById("pharmacyContainer");
  if (!el) return;
  el.innerHTML = medications.map(m => `
    <div class="col-sm-6 col-lg-3">
      <div class="sc-med-card">
        <img src="${m.image_url}" alt="Image of ${m.name}, a ${m.category} medication" loading="lazy" />
        <div class="sc-med-body">
          <span class="sc-badge mb-2 d-inline-block">${m.category}</span>
          <h5 class="sc-med-name">${m.name}</h5>
          <p class="sc-med-desc">${m.description}</p>
          <small class="sc-med-access"><i class="bi bi-lock me-1" aria-hidden="true"></i>${m.access_level}</small>
        </div>
      </div>
    </div>`).join("");
}

function renderDetails(patient) {
  const el = document.getElementById("detailsContainer");
  if (!el) return;

  const fields = [
    { label: "Full Name",       key: "name" },
    { label: "Date of Birth",   key: "dob" },
    { label: "Email",           key: "email" },
    { label: "Phone",           key: "phone" },
    { label: "Insurance",       key: "insurance" },
    { label: "Primary Doctor",  key: "primary_doctor" }
  ];

  el.innerHTML = fields.map(f => `
    <div class="sc-detail-row">
      <span class="sc-detail-label">${f.label}</span>
      <div class="sc-detail-right">
        <span class="sc-detail-value" id="val-${f.key}">${patient[f.key]}</span>
        <input class="sc-detail-input" id="inp-${f.key}" value="${patient[f.key]}" style="display:none" />
        <button class="sc-edit-btn" onclick="editField('${f.key}')" id="btn-${f.key}" aria-label="Edit ${f.label}">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="sc-save-btn" onclick="saveField('${f.key}')" id="save-${f.key}" style="display:none" aria-label="Save ${f.label}">
          Save
        </button>
      </div>
    </div>`).join("");
}

function editField(key) {
  document.getElementById("val-" + key).style.display = "none";
  document.getElementById("inp-" + key).style.display = "inline-block";
  document.getElementById("btn-" + key).style.display = "none";
  document.getElementById("save-" + key).style.display = "inline-block";
  document.getElementById("inp-" + key).focus();
}

function saveField(key) {
  const newVal = document.getElementById("inp-" + key).value;
  document.getElementById("val-" + key).textContent = newVal;
  document.getElementById("val-" + key).style.display = "inline";
  document.getElementById("inp-" + key).style.display = "none";
  document.getElementById("btn-" + key).style.display = "inline-block";
  document.getElementById("save-" + key).style.display = "none";
}

async function init() {
  try {
    const data = await loadData();
    renderAppointments(data.appointments);
    renderPharmacy(data.pharmacy);
    renderDetails(data.patient);
  } catch (err) {
    console.error("patients.js:", err);
  }
}

document.addEventListener("DOMContentLoaded", init);