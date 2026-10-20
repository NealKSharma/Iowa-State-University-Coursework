// management.js - Saint Cy's Hospital admin dashboard
// SE/COM S 3190 - Spring 2026 - AH17

let dashboardState = null;
let searchTerm = "";
let roleFilter = "All Roles";

async function loadData() {
  const res = await fetch("../data/data.json");
  if (!res.ok) throw new Error("Failed to load data.json");
  return res.json();
}

function renderOverview(overview) {
  const el = document.getElementById("adminOverviewContainer");
  if (!el) return;

  el.innerHTML = `
    <div class="sc-appt-card h-100">
      <span class="sc-badge mb-3">${overview.department}</span>
      <h2 class="sc-section-title mb-2">${overview.name}</h2>
      <p class="sc-section-sub mb-3">${overview.title}</p>
      <div class="d-grid gap-2 small text-secondary">
        <div><i class="bi bi-clock me-2 text-danger" aria-hidden="true"></i>${overview.shift}</div>
        <div><i class="bi bi-building me-2 text-danger" aria-hidden="true"></i>${overview.location}</div>
        <div><i class="bi bi-shield-check me-2 text-danger" aria-hidden="true"></i>${overview.focus}</div>
      </div>
      <p class="sc-appt-desc mt-3 mb-0">${overview.message}</p>
    </div>`;
}

function renderMetrics(metrics) {
  const el = document.getElementById("adminMetricsContainer");
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

function populateRoleOptions() {
  if (!dashboardState) return;

  const roleSelect = document.getElementById("newUserRole");
  const filterSelect = document.getElementById("roleFilterSelect");
  if (!roleSelect || !filterSelect) return;

  roleSelect.innerHTML = dashboardState.roles.map(role => `
    <option value="${role}">${role}</option>`).join("");

  filterSelect.innerHTML = [`All Roles`, ...dashboardState.roles].map(role => `
    <option value="${role}" ${role === roleFilter ? "selected" : ""}>${role}</option>`).join("");
}

function getStatusClass(status) {
  if (status === "Active") return "text-bg-success";
  if (status === "Pending") return "text-bg-warning";
  if (status === "Suspended") return "text-bg-danger";
  return "text-bg-secondary";
}

function renderAccessRequests(requests) {
  const el = document.getElementById("accessRequestsContainer");
  if (!el) return;

  el.innerHTML = requests.map(request => `
    <div class="col-md-6">
      <div class="sc-appt-card h-100">
        <div class="sc-appt-header">
          <span class="sc-badge">${request.type}</span>
          <span class="badge ${getStatusClass(request.status)}">${request.status}</span>
        </div>
        <h5 class="sc-appt-doctor">${request.user}</h5>
        <p class="sc-appt-time mb-1"><i class="bi bi-person-badge me-2" aria-hidden="true"></i>${request.requestedRole}</p>
        <p class="sc-appt-time mb-1"><i class="bi bi-building me-2" aria-hidden="true"></i>${request.department}</p>
        <p class="sc-appt-desc mb-2">${request.reason}</p>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-sm btn-danger" onclick="approveRequest('${request.requestId}')">Approve</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="dismissRequest('${request.requestId}')">Dismiss</button>
        </div>
      </div>
    </div>`).join("");
}

function getFilteredUsers() {
  if (!dashboardState) return [];

  return dashboardState.users.filter(user => {
    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
    const haystack = `${user.name} ${user.role} ${user.department} ${user.email}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });
}

function renderUsers() {
  const el = document.getElementById("userTableBody");
  if (!el || !dashboardState) return;

  const users = getFilteredUsers();
  if (users.length === 0) {
    el.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-secondary py-4">No users match the current filters.</td>
      </tr>`;
    return;
  }

  el.innerHTML = users.map(user => `
    <tr>
      <td>
        <div class="fw-bold">${user.name}</div>
        <div class="small text-secondary">${user.email}</div>
      </td>
      <td>${user.department}</td>
      <td>
        <select class="form-select form-select-sm" onchange="updateUserRole('${user.userId}', this.value)">
          ${dashboardState.roles.map(role => `
            <option value="${role}" ${role === user.role ? "selected" : ""}>${role}</option>`).join("")}
        </select>
      </td>
      <td>
        <span class="badge ${getStatusClass(user.status)}">${user.status}</span>
      </td>
      <td class="small text-secondary">${user.lastUpdated}</td>
      <td>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="toggleUserStatus('${user.userId}')">${user.status === "Suspended" ? "Activate" : "Suspend"}</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="resetUserPassword('${user.userId}')">Reset Password</button>
        </div>
      </td>
    </tr>`).join("");
}

function setCreateMessage(message) {
  const el = document.getElementById("createUserMessage");
  if (!el) return;
  el.textContent = message;
}

function updateMetric(label, value) {
  if (!dashboardState) return;
  const metric = dashboardState.metrics.find(item => item.label === label);
  if (metric) metric.value = String(value);
}

function refreshDerivedMetrics() {
  if (!dashboardState) return;
  const activeUsers = dashboardState.users.filter(user => user.status === "Active").length;
  const pendingUsers = dashboardState.users.filter(user => user.status === "Pending").length;
  const suspendedUsers = dashboardState.users.filter(user => user.status === "Suspended").length;

  updateMetric("Active Accounts", activeUsers);
  updateMetric("Pending Requests", dashboardState.accessRequests.length);
  updateMetric("Suspended Users", suspendedUsers);
  updateMetric("Role Changes Today", pendingUsers);
  renderMetrics(dashboardState.metrics);
}

function createUser(event) {
  event.preventDefault();
  if (!dashboardState) return;

  const name = document.getElementById("newUserName").value.trim();
  const email = document.getElementById("newUserEmail").value.trim();
  const role = document.getElementById("newUserRole").value;
  const status = document.getElementById("newUserStatus").value;
  const department = document.getElementById("newUserDepartment").value.trim();

  if (!name || !email || !role || !status || !department) return;

  const nextId = `USR${String(dashboardState.users.length + 1).padStart(3, "0")}`;
  dashboardState.users.unshift({
    userId: nextId,
    name,
    email,
    role,
    status,
    department,
    lastUpdated: "March 9, 2026"
  });

  document.getElementById("userCreateForm").reset();
  populateRoleOptions();
  renderUsers();
  refreshDerivedMetrics();
  setCreateMessage(`Created ${name} as a ${role} account.`);
}

function updateUserRole(userId, nextRole) {
  if (!dashboardState) return;
  const user = dashboardState.users.find(entry => entry.userId === userId);
  if (!user) return;

  user.role = nextRole;
  user.lastUpdated = "March 9, 2026";
  renderUsers();
  setCreateMessage(`Updated ${user.name}'s role to ${nextRole}.`);
}

function toggleUserStatus(userId) {
  if (!dashboardState) return;
  const user = dashboardState.users.find(entry => entry.userId === userId);
  if (!user) return;

  user.status = user.status === "Suspended" ? "Active" : "Suspended";
  user.lastUpdated = "March 9, 2026";
  renderUsers();
  refreshDerivedMetrics();
  setCreateMessage(`${user.name} is now ${user.status}.`);
}

function resetUserPassword(userId) {
  if (!dashboardState) return;
  const user = dashboardState.users.find(entry => entry.userId === userId);
  if (!user) return;

  user.lastUpdated = "March 9, 2026";
  renderUsers();
  setCreateMessage(`Password reset email sent to ${user.email}.`);
}

function approveRequest(requestId) {
  if (!dashboardState) return;
  const request = dashboardState.accessRequests.find(entry => entry.requestId === requestId);
  if (!request) return;

  const existingUser = dashboardState.users.find(user => user.email === request.email);
  if (existingUser) {
    existingUser.role = request.requestedRole;
    existingUser.department = request.department;
    existingUser.status = "Active";
    existingUser.lastUpdated = "March 9, 2026";
  }

  dashboardState.accessRequests = dashboardState.accessRequests.filter(entry => entry.requestId !== requestId);
  renderAccessRequests(dashboardState.accessRequests);
  renderUsers();
  refreshDerivedMetrics();
  setCreateMessage(`Approved access request for ${request.user}.`);
}

function dismissRequest(requestId) {
  if (!dashboardState) return;
  const request = dashboardState.accessRequests.find(entry => entry.requestId === requestId);
  if (!request) return;

  dashboardState.accessRequests = dashboardState.accessRequests.filter(entry => entry.requestId !== requestId);
  renderAccessRequests(dashboardState.accessRequests);
  refreshDerivedMetrics();
  setCreateMessage(`Dismissed access request for ${request.user}.`);
}

function attachEvents() {
  const form = document.getElementById("userCreateForm");
  const searchInput = document.getElementById("userSearchInput");
  const roleSelect = document.getElementById("roleFilterSelect");

  if (form) form.addEventListener("submit", createUser);
  if (searchInput) {
    searchInput.addEventListener("input", event => {
      searchTerm = event.target.value;
      renderUsers();
    });
  }
  if (roleSelect) {
    roleSelect.addEventListener("change", event => {
      roleFilter = event.target.value;
      renderUsers();
    });
  }
}

async function init() {
  try {
    const data = await loadData();
    dashboardState = data.managementDashboard;
    if (!dashboardState) throw new Error("managementDashboard missing from data.json");

    renderOverview(dashboardState.overview);
    populateRoleOptions();
    renderAccessRequests(dashboardState.accessRequests);
    renderUsers();
    refreshDerivedMetrics();
    attachEvents();
  } catch (err) {
    console.error("management.js:", err);
  }
}

document.addEventListener("DOMContentLoaded", init);

window.updateUserRole = updateUserRole;
window.toggleUserStatus = toggleUserStatus;
window.resetUserPassword = resetUserPassword;
window.approveRequest = approveRequest;
window.dismissRequest = dismissRequest;
