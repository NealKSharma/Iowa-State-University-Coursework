import { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5050").replace(/\/$/, "");

function Dashboard({ user, accessToken, onNavigate }) {
  const [health, setHealth] = useState({ height: "", weight: "", allergies: "", doctorNotes: "", phone: "" });
  const [healthMsg, setHealthMsg] = useState("");
  const [healthSaving, setHealthSaving] = useState(false);

  const [nextAppointment, setNextAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${accessToken}` };

    fetch(`${API_BASE}/api/appointments`, { headers })
      .then((r) => r.json())
      .then((data) => {
        const upcoming = (data.appointments || [])
          .filter((a) => a.status === "scheduled")
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setNextAppointment(upcoming[0] || null);
      })
      .catch(() => { });

    fetch(`${API_BASE}/api/pharmacy/medications`, { headers })
      .then((r) => r.json())
      .then((data) => {
        const assigned = (data.medications || []).filter((m) => m.access === "assigned");
        setPrescriptions(assigned);
      })
      .catch(() => { });

    fetch(`${API_BASE}/api/users/me/health`, { headers })
      .then((r) => r.json())
      .then((data) => setHealth(data))
      .catch(() => { });

    fetch(`${API_BASE}/api/notifications`, { headers })
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => { });
  }, [accessToken]);

  async function markAllRead() {
    await fetch(`${API_BASE}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => { });

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function saveHealth() {
    setHealthMsg("");
    setHealthSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/me/health`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(health),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setHealthMsg("");
      setShowHealthForm(false);
    } catch (err) {
      setHealthMsg(err.message);
    } finally {
      setHealthSaving(false);
    }
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>{user?.name} | {user?.email}</p>
        </div>

        <div className="dashboard-grid">
          <section className="card dashboard-section">
            <h2>Next Appointment</h2>
            {nextAppointment ? (
              <div className="dashboard-appt">
                <p className="dashboard-appt-reason">{nextAppointment.reason}</p>
                <p>{nextAppointment.date} at {nextAppointment.time}</p>
                {nextAppointment.doctorName && <p>Dr. {nextAppointment.doctorName}</p>}
              </div>
            ) : (
              <p className="dashboard-empty">No upcoming appointments.</p>
            )}
            <button className="dashboard-link-btn" onClick={() => onNavigate("appointments")} type="button">
              View all appointments
            </button>
          </section>

          <section className="card dashboard-section">
            <h2>Active Prescriptions</h2>
            {prescriptions.length === 0 ? (
              <p className="dashboard-empty">No active prescriptions.</p>
            ) : (
              <ul className="dashboard-rx-list">
                {prescriptions.map((p) => (
                  <li key={p.id} className="dashboard-rx-item">
                    <span>{p.name} {p.strength}</span>
                    <span>{p.assignedDosage}</span>
                  </li>
                ))}
              </ul>
            )}
            <button className="dashboard-link-btn" onClick={() => onNavigate("pharmacy")} type="button">
              View pharmacy
            </button>
          </section>

          <section className="card dashboard-section dashboard-full-width">
            <div className="dashboard-notif-header">
              <h2>Notifications</h2>
              {notifications.some((n) => !n.read) && (
                <button className="dashboard-link-btn" onClick={markAllRead} type="button">
                  Mark all as read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="dashboard-empty">No notifications.</p>
            ) : (
              <ul className="dashboard-notif-list">
                {notifications.map((n) => (
                  <li key={n.id} className={n.read ? "dashboard-notif-item" : "dashboard-notif-item unread"}>
                    <span>{n.message}</span>
                    <span className="dashboard-notif-date">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card dashboard-section dashboard-full-width">
            <h2>Health Details</h2>
            <p className="dashboard-section-desc">This information is visible to your doctors.</p>

            {!showHealthForm && (health.height || health.weight || health.allergies || health.doctorNotes) ? (
              <>
                <div className="dashboard-health-grid">
                  {health.height && (
                    <div>
                      <p className="dashboard-label">Height</p>
                      <p>{health.height}</p>
                    </div>
                  )}
                  {health.weight && (
                    <div>
                      <p className="dashboard-label">Weight</p>
                      <p>{health.weight}</p>
                    </div>
                  )}
                </div>

                {health.allergies && (
                  <div>
                    <p className="dashboard-label">Known Allergies</p>
                    <p>{health.allergies}</p>
                  </div>
                )}

                {health.doctorNotes && (
                  <div>
                    <p className="dashboard-label">Notes for Doctor</p>
                    <p>{health.doctorNotes}</p>
                  </div>
                )}

                <button className="btn-admin-secondary" onClick={() => setShowHealthForm(true)} type="button">
                  Update Details
                </button>
              </>
            ) : !showHealthForm ? (
              <button className="btn-admin-secondary" onClick={() => setShowHealthForm(true)} type="button">
                Add Details
              </button>
            ) : (
              <>
                <div className="dashboard-health-grid">
                  <label className="dashboard-label">
                    Height
                    <input
                      className="dashboard-input"
                      placeholder="e.g. 5ft 10in"
                      value={health.height}
                      onChange={(e) => setHealth({ ...health, height: e.target.value })}
                    />
                  </label>

                  <label className="dashboard-label">
                    Weight
                    <input
                      className="dashboard-input"
                      placeholder="e.g. 160 lbs"
                      value={health.weight}
                      onChange={(e) => setHealth({ ...health, weight: e.target.value })}
                    />
                  </label>
                </div>

                <label className="dashboard-label">
                  Known Allergies
                  <input
                    className="dashboard-input"
                    placeholder="e.g. Penicillin, Peanuts"
                    value={health.allergies}
                    onChange={(e) => setHealth({ ...health, allergies: e.target.value })}
                  />
                </label>

                <label className="dashboard-label">
                  Notes for Doctor
                  <textarea
                    className="dashboard-input dashboard-textarea"
                    placeholder="Anything you want your doctor to know"
                    value={health.doctorNotes}
                    onChange={(e) => setHealth({ ...health, doctorNotes: e.target.value })}
                  />
                </label>

                {healthMsg && <p className="dashboard-msg">{healthMsg}</p>}

                <div className="flex gap-3">
                  <button className="btn-submit" disabled={healthSaving} onClick={saveHealth} type="button">
                    {healthSaving ? "Saving..." : "Save"}
                  </button>
                  <button className="btn-admin-secondary" onClick={() => setShowHealthForm(false)} type="button">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;