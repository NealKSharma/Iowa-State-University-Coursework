import { useEffect, useState } from "react";

function Appointments({ accessToken, apiBase }) {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [booking, setBooking] = useState({ type: "in-person", reason: "", comments: "", });
    const [message, setMessage] = useState("");
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState("");

    // used on every protected appointment request
    const headers = { Authorization: `Bearer ${accessToken}` };

    async function loadDoctors() {
        try {
            const res = await fetch(`${apiBase}/api/appointments/doctors`, { headers });
            const data = await res.json();
            setDoctors(data.doctors || []);
        } catch {
            setMessage("Could not load doctors.");
        }
    }

    async function loadAppointments() {
        try {
            const res = await fetch(`${apiBase}/api/appointments`, { headers });
            const data = await res.json();
            setAppointments(data.appointments || []);
        } catch {
            setMessage("Could not load appointments.");
        }
    }

    useEffect(() => {
        // first load gets the doctor list and the user's current appointments
        loadDoctors();
        loadAppointments();
    }, []);

    async function loadSlots(doctor, nextDate) {
        // clear the old time when the user switches doctor or date
        setSelectedDoctor(doctor);
        setSelectedTime("");
        setSelectedSlotId("");
        setSlots([]);

        if (!nextDate) {
            return;
        }

        setLoadingSlots(true);
        setMessage("");

        try {
            const res = await fetch(`${apiBase}/api/appointments/slots/${doctor.id}?date=${nextDate}`, { headers });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Could not load slots.");
            }

            setSlots(data.slots || []);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoadingSlots(false);
        }
    }

    async function bookAppointment() {
        setMessage("");

        // do not send the request until the required fields are picked
        if (!selectedDoctor || !selectedSlotId || !booking.reason) {
            setMessage("Choose a doctor, time, and reason.");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch(`${apiBase}/api/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    doctorId: selectedDoctor.id,
                    slotId: selectedSlotId,
                    type: booking.type,
                    reason: booking.reason,
                    comments: booking.comments,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Could not book appointment.");
            }

            // reset the form after the request is saved
            setMessage("Appointment request sent.");
            setSelectedTime("");
            setSelectedSlotId("");
            setBooking({ type: "in-person", reason: "", comments: "" });

            // reload so the new pending appointment shows right away
            loadAppointments();
            loadSlots(selectedDoctor, date);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setSaving(false);
        }
    }

    function handleDateChange(value) {
        setDate(value);

        // changing the date should also refresh the time buttons
        if (selectedDoctor) {
            loadSlots(selectedDoctor, value);
        }
    }

    return (
        <main className="appointments-page">
            <div className="appointments-inner">
                <div className="appointments-header">
                    <h1>Appointments</h1>
                    <p>Choose a doctor, select an available time, and send a request for approval.</p>
                </div>

                {message && <p className="appointments-message">{message}</p>}

                <div className="appointments-layout">
                    <section className="card appointments-section">
                        <h2>Doctors</h2>
                        {doctors.length === 0 ? (
                            <p className="dashboard-empty">No doctors found.</p>
                        ) : (
                            <div className="appointments-doctor-list">
                                {doctors.map((doctor) => (
                                    <button
                                        key={doctor.id}
                                        className={selectedDoctor?.id === doctor.id ? "doctor-card active" : "doctor-card"}
                                        onClick={() => loadSlots(doctor, date)}
                                        type="button"
                                    >
                                        <span>Dr. {doctor.name}</span>
                                        <small>{doctor.specialization}</small>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="card appointments-section">
                        <h2>Book Appointment</h2>

                        {!selectedDoctor ? (
                            <p className="dashboard-empty">Select a doctor first.</p>
                        ) : (
                            <>
                                <p className="appointments-selected">Dr. {selectedDoctor.name}</p>

                                <label className="dashboard-label">
                                    Date
                                    <input
                                        className="dashboard-input"
                                        type="date"
                                        value={date}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                    />
                                </label>

                                <div>
                                    <p className="appointments-label">Available Times</p>
                                    {loadingSlots ? (
                                        <p className="dashboard-empty">Loading times...</p>
                                    ) : slots.length === 0 ? (
                                        <p className="dashboard-empty">No slots available for this date!</p>
                                    ) : (
                                        <div className="appointments-slots">
                                            {slots.map((slot) => (
                                                <button
                                                    key={slot.time}
                                                    className={selectedTime === slot.time ? "slot-button active" : "slot-button"}
                                                    disabled={!slot.available}
                                                    onClick={() => {
                                                        setSelectedTime(slot.time);
                                                        setSelectedSlotId(slot.id);
                                                    }}
                                                    type="button"
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <label className="dashboard-label">
                                    Type
                                    <select
                                        className="dashboard-input"
                                        value={booking.type}
                                        onChange={(e) => setBooking({ ...booking, type: e.target.value })}
                                    >
                                        <option value="in-person">In-person</option>
                                        <option value="virtual">Virtual</option>
                                    </select>
                                </label>

                                <label className="dashboard-label">
                                    Reason
                                    <input
                                        className="dashboard-input"
                                        value={booking.reason}
                                        onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                                        placeholder="Reason for visit"
                                    />
                                </label>

                                <label className="dashboard-label">
                                    Comments
                                    <textarea
                                        className="dashboard-input dashboard-textarea"
                                        value={booking.comments}
                                        onChange={(e) => setBooking({ ...booking, comments: e.target.value })}
                                        placeholder="Anything else the doctor should know"
                                    />
                                </label>

                                <button className="btn-submit" disabled={saving} onClick={bookAppointment} type="button">
                                    {saving ? "Sending..." : "Request Appointment"}
                                </button>
                            </>
                        )}
                    </section>

                    <section className="card appointments-section appointments-wide">
                        <h2>My Appointments</h2>
                        {appointments.length === 0 ? (
                            <p className="dashboard-empty">No appointments yet.</p>
                        ) : (
                            <div className="appointments-list">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="appointment-row">
                                        <div>
                                            <strong>{appointment.reason}</strong>
                                            <p>Dr. {appointment.doctorName}</p>
                                            <p>{appointment.date} at {appointment.time}</p>
                                        </div>
                                        <span>{appointment.status}</span>
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

export default Appointments;