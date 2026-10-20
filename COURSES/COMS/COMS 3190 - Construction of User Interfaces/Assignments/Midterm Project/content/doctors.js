// doctors.js - Devank Uppal (Member 2)
// SE/COM S 3190 - Spring 2026 - AH17

async function loadData() {
  const res = await fetch("../data/data.json");
  if (!res.ok) throw new Error("Failed to load data.json");
  return res.json();
}

function renderOverview(overview) {
  const el = document.getElementById("doctorOverviewContainer");
  if (!el) return;

  el.innerHTML = `
    <div class="sc-appt-card h-100">
      ${overview.photoUrl ? `
      <img
        src="${overview.photoUrl}"
        alt="${overview.photoAlt || `Photo of ${overview.name}`}"
        class="sc-doctor-photo mb-3"
        loading="lazy"
      />` : ""}
      <span class="sc-badge mb-3">${overview.department}</span>
      <h2 class="sc-section-title mb-2">${overview.name}</h2>
      <p class="sc-section-sub mb-3">${overview.specialty}</p>
      <div class="d-grid gap-2 small text-secondary">
        <div><i class="bi bi-clock me-2 text-danger" aria-hidden="true"></i>${overview.shift}</div>
        <div><i class="bi bi-geo-alt me-2 text-danger" aria-hidden="true"></i>${overview.location}</div>
        <div><i class="bi bi-heart-pulse me-2 text-danger" aria-hidden="true"></i>${overview.focus}</div>
      </div>
      <p class="sc-appt-desc mt-3 mb-0">${overview.message}</p>
    </div>`;
}

function renderMetrics(metrics) {
  const el = document.getElementById("doctorMetricsContainer");
  if (!el) return;

  el.innerHTML = metrics.map(metric => `
    <div class="col-sm-6">
      <div class="sc-appt-card text-center h-100">
        <div class="sc-stat-number">${metric.value}</div>
        <div class="sc-stat-label">${metric.label}</div>
        <p class="sc-appt-desc mt-3 mb-0">${metric.detail}</p>
      </div>
    </div>`).join("");
}

function renderSchedule(schedule) {
  const el = document.getElementById("doctorScheduleContainer");
  if (!el) return;

  el.innerHTML = schedule.map(item => `
    <div class="col-md-6 col-xl-3">
      <div class="sc-appt-card">
        <div class="sc-appt-header">
          <span class="sc-badge">${item.type}</span>
          <span class="badge ${item.statusClass}">${item.status}</span>
        </div>
        <h5 class="sc-appt-doctor">${item.patient}</h5>
        <p class="sc-appt-date"><i class="bi bi-calendar3 me-2" aria-hidden="true"></i>${item.date}</p>
        <p class="sc-appt-time"><i class="bi bi-clock me-2" aria-hidden="true"></i>${item.time}</p>
        <p class="sc-appt-time"><i class="bi bi-door-open me-2" aria-hidden="true"></i>${item.location}</p>
        <p class="sc-appt-desc mb-1">${item.reason}</p>
        <small class="sc-med-access">${item.nextAction}</small>
      </div>
    </div>`).join("");
}

function renderRoster(patients) {
  const el = document.getElementById("patientRosterContainer");
  if (!el) return;

  el.innerHTML = patients.map(patient => `
    <div class="col-md-6 col-xl-4">
      <div class="sc-appt-card h-100">
        ${patient.imageUrl ? `
        <img
          src="${patient.imageUrl}"
          alt="${patient.imageAlt || `Photo of ${patient.name}`}"
          class="sc-patient-photo mb-3"
          loading="lazy"
        />` : ""}
        <div class="sc-appt-header">
          <span class="sc-badge">${patient.unit}</span>
          <span class="badge ${patient.priorityClass}">${patient.priority}</span>
        </div>
        <h5 class="sc-appt-doctor">${patient.name}</h5>
        <p class="sc-appt-time mb-1"><i class="bi bi-person-vcard me-2" aria-hidden="true"></i>${patient.age} years old</p>
        <p class="sc-appt-time mb-1"><i class="bi bi-clipboard2-pulse me-2" aria-hidden="true"></i>${patient.condition}</p>
        <p class="sc-appt-time mb-1"><i class="bi bi-calendar-check me-2" aria-hidden="true"></i>Last visit: ${patient.lastVisit}</p>
        <p class="sc-appt-desc mb-1">${patient.summary}</p>
        <small class="sc-med-access">${patient.nextStep}</small>
      </div>
    </div>`).join("");
}

function renderPrescriptionQueue(queue) {
  const el = document.getElementById("prescriptionQueueContainer");
  if (!el) return;

  el.innerHTML = queue.map(item => `
    <div class="col-md-6">
      <div class="sc-med-card">
        ${item.imageUrl ? `
        <img
          src="${item.imageUrl}"
          alt="${item.imageAlt || `Photo of ${item.patient}`}"
          class="sc-queue-photo"
          loading="lazy"
        />` : ""}
        <div class="sc-med-body">
          <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
            <span class="sc-badge">${item.status}</span>
            <small class="text-secondary">${item.patient}</small>
          </div>
          <h5 class="sc-med-name">${item.medication}</h5>
          <p class="sc-med-desc mb-2">${item.instructions}</p>
          <p class="sc-appt-time mb-2"><i class="bi bi-capsule me-2" aria-hidden="true"></i>${item.dosage}</p>
          <small class="sc-med-access">${item.action}</small>
        </div>
      </div>
    </div>`).join("");
}

function renderDetails(profile) {
  const el = document.getElementById("doctorDetailsContainer");
  if (!el) return;

  const fields = [
    { label: "Email", value: profile.email },
    { label: "Phone", value: profile.phone },
    { label: "Office", value: profile.office },
    { label: "License", value: profile.license },
    { label: "Nurse Line", value: profile.nurseLine },
    { label: "Availability", value: profile.availability }
  ];

  el.innerHTML = fields.map(field => `
    <div class="sc-detail-row">
      <span class="sc-detail-label">${field.label}</span>
      <span class="sc-detail-value text-end">${field.value}</span>
    </div>`).join("");
}

async function init() {
  try {
    const data = await loadData();
    const dashboard = data.doctorDashboard;
    if (!dashboard) throw new Error("doctorDashboard missing from data.json");

    renderOverview(dashboard.overview);
    renderMetrics(dashboard.metrics);
    renderSchedule(dashboard.schedule);
    renderRoster(dashboard.patients);
    renderPrescriptionQueue(dashboard.prescriptionQueue);
    renderDetails(dashboard.profile);
  } catch (err) {
    console.error("doctors.js:", err);
  }
}

document.addEventListener("DOMContentLoaded", init);
