import { useEffect, useState } from "react";

const blankSlot = {
  date: "",
  time: "",
};

const blankPrescription = {
  patientId: "",
  medicationId: "",
  dosage: "",
  directions: "",
  notes: "",
};

// doctors use this page for appointments, availability, patients, and prescriptions
function DoctorPortal({ accessToken, apiBase, user }) {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [slotForm, setSlotForm] = useState(blankSlot);
  const [prescriptionForm, setPrescriptionForm] = useState(blankPrescription);
  const [message, setMessage] = useState("");
  const [savingSlot, setSavingSlot] = useState(false);
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const headers = { Authorization: `Bearer ${accessToken}` };

  // split these so the page can show pending and approved visits separately
  const pendingAppointments = appointments.filter((appointment) => appointment.status === "pending");
  const scheduledAppointments = appointments.filter((appointment) => appointment.status === "scheduled");

  async function loadPortalData() {
    await Promise.all([
      loadAppointments(),
      loadSlots(),
      loadPatients(),
      loadMedications(),
      loadPrescriptions(),
    ]);
  }

  async function loadAppointments() {
    try {
      const res = await fetch(`${apiBase}/api/appointments`, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not load appointments.");
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function loadSlots() {
    try {
      const res = await fetch(`${apiBase}/api/appointments/availability`, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not load availability.");
      }

      setSlots(data.slots || []);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function loadPatients() {
    try {
      const res = await fetch(`${apiBase}/api/appointments/patients`, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not load patients.");
      }

      setPatients(data.patients || []);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function loadMedications() {
    try {
      const res = await fetch(`${apiBase}/api/pharmacy/prescription-medications`, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not load medications.");
      }

      setMedications(data.medications || []);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function loadPrescriptions() {
    try {
      const res = await fetch(`${apiBase}/api/pharmacy/prescriptions`, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not load prescriptions.");
      }

      setPrescriptions(data.prescriptions || []);
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    // load everything the doctor portal needs when the page opens
    loadPortalData();
  }, []);

  async function addSlot() {
    setMessage("");

    if (!slotForm.date || !slotForm.time) {
      setMessage("Date and time are required.");
      return;
    }

    setSavingSlot(true);

    try {
      const res = await fetch(`${apiBase}/api/appointments/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(slotForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not add slot.");
      }

      setMessage("Availability added.");
      setSlotForm(blankSlot);
      loadSlots();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSavingSlot(false);
    }
  }

  async function deleteSlot(slotId) {
    setMessage("");

    try {
      const res = await fetch(`${apiBase}/api/appointments/availability/${slotId}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not remove slot.");
      }

      setMessage("Availability removed.");
      loadSlots();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function updateAppointment(appointmentId, status) {
    setMessage("");
    setUpdatingId(appointmentId);

    try {
      const res = await fetch(`${apiBase}/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not update appointment.");
      }

      setMessage(status === "scheduled" ? "Appointment approved." : "Appointment rejected.");
      loadPortalData();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUpdatingId("");
    }
  }

  async function submitPrescription() {
    setMessage("");

    if (!prescriptionForm.patientId || !prescriptionForm.medicationId || !prescriptionForm.dosage || !prescriptionForm.directions) {
      setMessage("Patient, medication, dosage, and directions are required.");
      return;
    }

    setSavingPrescription(true);

    try {
      const res = await fetch(`${apiBase}/api/pharmacy/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(prescriptionForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not create prescription.");
      }

      // once this saves, the patient dashboard can see it as an active prescription
      setMessage("Prescription sent to patient.");
      setPrescriptionForm(blankPrescription);
      loadPrescriptions();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSavingPrescription(false);
    }
  }

  async function removePrescription(prescriptionId) {
    setMessage("");

    try {
      const res = await fetch(`${apiBase}/api/pharmacy/prescriptions/${prescriptionId}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not remove prescription.");
      }

      setMessage("Prescription removed.");
      loadPrescriptions();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <main className="doctor-page">
      <div className="doctor-inner">
        <div className="doctor-header">
          <div>
            <h1>Doctor Portal</h1>
            <p>Dr. {user?.name} - Manage requests, availability, patients, and prescriptions.</p>
          </div>
        </div>

        {message && <p className="doctor-message">{message}</p>}

        <div className="doctor-layout">
          <section className="card doctor-section">
            <h2>Pending Requests</h2>
            {pendingAppointments.length === 0 ? (
              <p className="dashboard-empty">No pending appointment requests.</p>
            ) : (
              <div className="doctor-list">
                {pendingAppointments.map((appointment) => (
                  <div key={appointment.id} className="doctor-request">
                    <div>
                      <strong>{appointment.patientName}</strong>
                      <p>{appointment.date} at {appointment.time}</p>
                      <p>{appointment.type}</p>
                      <p>{appointment.reason}</p>
                      {appointment.comments && <p>{appointment.comments}</p>}
                    </div>
                    <div className="doctor-actions">
                      <button
                        className="btn-submit"
                        disabled={updatingId === appointment.id}
                        onClick={() => updateAppointment(appointment.id, "scheduled")}
                        type="button"
                      >
                        Approve
                      </button>
                      <button
                        className="btn-danger"
                        disabled={updatingId === appointment.id}
                        onClick={() => updateAppointment(appointment.id, "rejected")}
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card doctor-section">
            <h2>Add Availability</h2>
            <label className="dashboard-label">
              Date
              <input
                className="dashboard-input"
                type="date"
                value={slotForm.date}
                onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
              />
            </label>

            <label className="dashboard-label">
              Time
              <input
                className="dashboard-input"
                type="time"
                value={slotForm.time}
                onChange={(e) => setSlotForm({ ...slotForm, time: e.target.value })}
              />
            </label>

            <button className="btn-submit" disabled={savingSlot} onClick={addSlot} type="button">
              {savingSlot ? "Saving..." : "Add Slot"}
            </button>
          </section>

          <section className="card doctor-section doctor-wide">
            <h2>Create Prescription</h2>

            {patients.length === 0 ? (
              <p className="dashboard-empty">Patients will show here after they request appointments with you.</p>
            ) : (
              <>
                <div className="doctor-prescription-grid">
                  <label className="dashboard-label">
                    Patient
                    <select
                      className="dashboard-input"
                      value={prescriptionForm.patientId}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patientId: e.target.value })}
                    >
                      <option value="">Select patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} ({patient.email})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="dashboard-label">
                    Medication
                    <select
                      className="dashboard-input"
                      value={prescriptionForm.medicationId}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicationId: e.target.value })}
                    >
                      <option value="">Select medication</option>
                      {medications.map((medication) => (
                        <option key={medication.id} value={medication.id}>
                          {medication.name} {medication.strength}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="doctor-prescription-grid">
                  <label className="dashboard-label">
                    Dosage
                    <input
                      className="dashboard-input"
                      value={prescriptionForm.dosage}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                      placeholder="Example: 1 tablet"
                    />
                  </label>

                  <label className="dashboard-label">
                    Directions
                    <input
                      className="dashboard-input"
                      value={prescriptionForm.directions}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, directions: e.target.value })}
                      placeholder="Example: Take once daily"
                    />
                  </label>
                </div>

                <label className="dashboard-label">
                  Notes
                  <textarea
                    className="dashboard-input dashboard-textarea"
                    value={prescriptionForm.notes}
                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                    placeholder="Optional notes for the patient or pharmacy"
                  />
                </label>

                <button className="btn-submit" disabled={savingPrescription} onClick={submitPrescription} type="button">
                  {savingPrescription ? "Sending..." : "Send Prescription"}
                </button>
              </>
            )}
          </section>

          <section className="card doctor-section doctor-wide">
            <h2>My Prescriptions</h2>
            {prescriptions.length === 0 ? (
              <p className="dashboard-empty">No active prescriptions written yet.</p>
            ) : (
              <div className="doctor-list">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="doctor-request">
                    <div>
                      <strong>{prescription.medicationName}</strong>
                      <p>{prescription.patientName} ({prescription.patientEmail})</p>
                      <p>Dosage: {prescription.dosage}</p>
                      <p>Directions: {prescription.directions}</p>
                      {prescription.notes && <p>Notes: {prescription.notes}</p>}
                    </div>
                    <button className="dashboard-link-btn" onClick={() => removePrescription(prescription.id)} type="button">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card doctor-section doctor-wide">
            <h2>My Availability</h2>
            {slots.length === 0 ? (
              <p className="dashboard-empty">No availability added yet.</p>
            ) : (
              <div className="doctor-slot-list">
                {slots.map((slot) => (
                  <div key={slot.id} className="doctor-slot-row">
                    <span>{slot.date} at {slot.time}</span>
                    <button className="dashboard-link-btn" onClick={() => deleteSlot(slot.id)} type="button">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card doctor-section doctor-wide">
            <h2>Scheduled Appointments</h2>
            {scheduledAppointments.length === 0 ? (
              <p className="dashboard-empty">No scheduled appointments.</p>
            ) : (
              <div className="doctor-list">
                {scheduledAppointments.map((appointment) => (
                  <div key={appointment.id} className="doctor-request">
                    <div>
                      <strong>{appointment.patientName}</strong>
                      <p>{appointment.date} at {appointment.time}</p>
                      <p>{appointment.type}</p>
                      <p>{appointment.reason}</p>
                    </div>
                    <span className="doctor-status">{appointment.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card doctor-section doctor-wide">
            <h2>My Patients</h2>
            {patients.length === 0 ? (
              <p className="dashboard-empty">Patients will show here after appointment requests are made.</p>
            ) : (
              <div className="doctor-patient-grid">
                {patients.map((patient) => (
                  <div key={patient.id} className="doctor-patient-card">
                    <h3>{patient.name}</h3>
                    <p>{patient.email}</p>
                    {patient.phone && <p>Phone: {patient.phone}</p>}
                    {patient.height && <p>Height: {patient.height}</p>}
                    {patient.weight && <p>Weight: {patient.weight}</p>}
                    {patient.allergies && <p>Allergies: {patient.allergies}</p>}
                    {patient.doctorNotes && <p>Notes: {patient.doctorNotes}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default DoctorPortal;