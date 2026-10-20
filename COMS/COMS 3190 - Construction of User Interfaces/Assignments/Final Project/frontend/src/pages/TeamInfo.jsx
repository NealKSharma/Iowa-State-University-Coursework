function TeamInfo() {
  return (
    <main className="team-page">
      <div className="team-inner">
        <section className="team-header">
          <p className="eyebrow">Saint Cy's Hospital</p>
          <h1>Team Info and FAQ</h1>
          <p>Project information for Saint Cy's Hospital Management Website.</p>
        </section>

        <section className="team-grid">
          <div className="card team-card">
            <h2>Team Members</h2>
            <p>Neal Sharma - nea1@iastate.edu</p>
            <p>Devank Uppal - duppal@iastate.edu</p>
          </div>

          <div className="card team-card">
            <h2>Course</h2>
            <p>COMS 3190 - Construction of User Interfaces</p>
            <p>Iowa State University</p>
            <p>Spring 2026</p>
          </div>

          <div className="card team-card">
            <h2>Project Summary</h2>
            <p>Saint Cy's is a full-stack hospital management web app with patients, doctors, pharmacists, and admins.</p>
          </div>

          <div className="card team-card">
            <h2>What does the patient do?</h2>
            <p>Patients can view dashboard details, book appointments, read notifications, and view prescriptions.</p>
          </div>

          <div className="card team-card">
            <h2>What does the doctor do?</h2>
            <p>Doctors can manage appointment requests, add available times, view patients, and create prescriptions.</p>
          </div>

          <div className="card team-card">
            <h2>What does the admin do?</h2>
            <p>Admins can manage users and review system error logs.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default TeamInfo;