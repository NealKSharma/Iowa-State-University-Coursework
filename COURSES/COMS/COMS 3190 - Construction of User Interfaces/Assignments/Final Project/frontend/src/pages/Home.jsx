// Show up in the core features section of the home page. Needs to be updated as the app rpogresses.
const features = [
  { title: "Appointment Scheduling", description: "Book, reschedule, and cancel appointments with doctors in real time." },
  { title: "Prescription Management", description: "Doctors issue prescriptions and patients view their full history." },
  { title: "Doctor Portal", description: "Doctors manage schedules, patients, and appointment queues." },
  { title: "Pharmacy Support", description: "Pharmacists view prescriptions and manage medication inventory." },
];

// list out all the roles and their discriptions.
const roles = [
  { label: "Patient", description: "Book appointments, view prescriptions, manage personal info." },
  { label: "Doctor", description: "View schedule, manage patients, issue prescriptions." },
  { label: "Pharmacist", description: "Access prescriptions, manage inventory, fulfill orders." },
  { label: "Admin", description: "Full system access - manage users, roles, and all data." },
];

function Home({ user, onNavigate }) {
  return (
    <>
      <section className="hero">
        <h1>Saint Cy's Hospital</h1>
        <p>A full-stack platform connecting patients, doctors, pharmacists, and admins.</p>
        <div className="flex justify-center gap-4">
          <button className="btn-primary" onClick={() => onNavigate(user ? "dashboard" : "login")} type="button">
            {user ? "View Dashboard" : "Log In"}
          </button>
          <button className="btn-outline" onClick={() => onNavigate(user ? "appointments" : "support")} type="button">
            {user ? "Manage Appointments" : "Support"}
          </button>
        </div>
      </section>

      <section className="section text-center">
        <h2 className="section-title">About This Project</h2>
        <p style={{ maxWidth: "40rem", margin: "0 auto" }}>
          Saint Cy's is built with React, Node.js, Express, and MongoDB Atlas. It supports role-based
          access for patients, doctors, pharmacists, and admins.
        </p>
      </section>

      <section className="section section-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Core Features</h2>
          <div className="grid grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card">
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">User Roles</h2>
          <div className="grid grid-cols-4 gap-6">
            {roles.map((r) => (
              <div key={r.label} className="card-role">
                <h3>{r.label}</h3>
                <p>{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

export default Home;
