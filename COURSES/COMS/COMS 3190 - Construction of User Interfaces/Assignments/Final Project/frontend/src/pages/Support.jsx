function Support() {
  return (
    <main className="support-page">
      <div className="support-inner">
        <section className="support-header">
          <p className="eyebrow">Help Center</p>
          <h1>Support and Help</h1>
          <p>Find basic help for using Saint Cy's Hospital Management Website.</p>
        </section>

        <section className="support-grid">
          <div className="card support-card">
            <h2>Getting Started</h2>
            <p>New users can create an account from the signup page. Patients are sent to the dashboard after logging in.</p>
          </div>

          <div className="card support-card">
            <h2>Appointments</h2>
            <p>Patients can request appointments by selecting a doctor and an available time. Doctors approve or reject requests from the doctor portal.</p>
          </div>

          <div className="card support-card">
            <h2>Prescriptions</h2>
            <p>Doctors can send prescriptions to patients. Patients can view assigned prescriptions from the dashboard and pharmacy page.</p>
          </div>

          <div className="card support-card">
            <h2>Pharmacy</h2>
            <p>Patients can view available medications. Pharmacists and admins can manage inventory and assignments.</p>
          </div>

          <div className="card support-card">
            <h2>Account Issues</h2>
            <p>Use the Security and Settings page to update your password and profile details.</p>
          </div>

          <div className="card support-card">
            <h2>Contact</h2>
            <p>For project questions, contact Neal Sharma or Devank Uppal from Team AH17.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Support;