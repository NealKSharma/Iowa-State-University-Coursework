import { useEffect, useState } from "react";

const blankPasswords = {
    currentPassword: "",
    newPassword: "",
};

const blankProfile = {
    phone: "",
    specialization: "",
};

function SecuritySettings({ accessToken, apiBase, user }) {
    const [passwords, setPasswords] = useState(blankPasswords);
    const [profile, setProfile] = useState(blankProfile);
    const [message, setMessage] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);

    const headers = { Authorization: `Bearer ${accessToken}` };
    const isDoctor = user?.role === "doctor";
    const isPatient = user?.role === "patient";
    const hasProfileInfo = profile.phone || (isDoctor && profile.specialization);

    async function loadProfile() {
        try {
            const res = await fetch(`${apiBase}/api/users/me/profile`, { headers });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Could not load profile.");
            }

            setProfile({
                phone: data.profile?.phone || "",
                specialization: data.profile?.specialization || "",
            });
        } catch (err) {
            setMessage(err.message);
        }
    }

    useEffect(() => {
        // settings pulls the saved account details when this page opens
        loadProfile();
    }, []);

    async function savePassword() {
        setMessage("");

        if (!passwords.currentPassword || !passwords.newPassword) {
            setMessage("Current password and new password are required.");
            return;
        }

        setSavingPassword(true);

        try {
            const res = await fetch(`${apiBase}/api/users/me/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(passwords),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Could not update password.");
            }

            setMessage("Password updated.");
            setPasswords(blankPasswords);
            setShowPasswordForm(false);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setSavingPassword(false);
        }
    }

    async function saveProfile() {
        setMessage("");
        setSavingProfile(true);

        try {
            const payload = {
                phone: profile.phone,
                specialization: isDoctor ? profile.specialization : "",
            };

            const res = await fetch(`${apiBase}/api/users/me/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Could not update profile.");
            }

            setMessage("Profile updated.");
            setProfile({
                phone: data.profile?.phone || "",
                specialization: data.profile?.specialization || "",
            });
            setShowProfileForm(false);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setSavingProfile(false);
        }
    }

    return (
        <main className="settings-page">
            <div className="settings-inner">
                <section className="settings-header">
                    <p className="eyebrow">Account</p>
                    <h1>Security and Settings</h1>
                    <p>Manage your password and account details.</p>
                </section>

                {message && <p className="form-message settings-message">{message}</p>}

                <section className="settings-layout">
                    <div className="card settings-card">
                        <h2>{isDoctor ? "Doctor Profile" : "Profile Information"}</h2>

                        {isPatient && (
                            <p className="admin-muted">
                                Patient health details stay on the dashboard so doctors can view them with your appointment information.
                            </p>
                        )}

                        {isDoctor && (
                            <p className="admin-muted">
                                Doctor specialization shows on the appointment page when patients choose a doctor.
                            </p>
                        )}

                        {!showProfileForm && hasProfileInfo ? (
                            <>
                                {profile.phone && (
                                    <div>
                                        <p className="dashboard-label">Phone</p>
                                        <p>{profile.phone}</p>
                                    </div>
                                )}

                                {isDoctor && profile.specialization && (
                                    <div>
                                        <p className="dashboard-label">Specialization</p>
                                        <p>{profile.specialization}</p>
                                    </div>
                                )}

                                <button className="btn-admin-secondary" onClick={() => setShowProfileForm(true)} type="button">
                                    Update Profile
                                </button>
                            </>
                        ) : !showProfileForm ? (
                            <button className="btn-admin-secondary" onClick={() => setShowProfileForm(true)} type="button">
                                Add Profile Details
                            </button>
                        ) : (
                            <>
                                <label className="dashboard-label">
                                    Phone
                                    <input
                                        className="dashboard-input"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="Example: 555-123-4567"
                                    />
                                </label>

                                {isDoctor && (
                                    <label className="dashboard-label">
                                        Specialization
                                        <input
                                            className="dashboard-input"
                                            value={profile.specialization}
                                            onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                            placeholder="Example: Cardiology"
                                        />
                                    </label>
                                )}

                                <div className="flex gap-3">
                                    <button className="btn-submit" disabled={savingProfile} onClick={saveProfile} type="button">
                                        {savingProfile ? "Saving..." : "Save"}
                                    </button>
                                    <button className="btn-admin-secondary" onClick={() => setShowProfileForm(false)} type="button">
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="card settings-card">
                        <h2>Password</h2>

                        {!showPasswordForm ? (
                            <button className="btn-admin-secondary" onClick={() => setShowPasswordForm(true)} type="button">
                                Update Password
                            </button>
                        ) : (
                            <>
                                <label className="dashboard-label">
                                    Current Password
                                    <input
                                        className="dashboard-input"
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    />
                                </label>

                                <label className="dashboard-label">
                                    New Password
                                    <input
                                        className="dashboard-input"
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    />
                                </label>

                                <div className="flex gap-3">
                                    <button className="btn-submit" disabled={savingPassword} onClick={savePassword} type="button">
                                        {savingPassword ? "Saving..." : "Save"}
                                    </button>
                                    <button className="btn-admin-secondary" onClick={() => setShowPasswordForm(false)} type="button">
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="card settings-card settings-wide">
                        <h2>Account Activity</h2>
                        <p className="admin-muted">Signed in as {user?.name} ({user?.email}).</p>
                        <p className="admin-muted">Role: {user?.role}</p>
                        {isPatient && (
                            <p className="admin-muted">Health details are managed from the patient dashboard.</p>
                        )}
                        {isDoctor && (
                            <p className="admin-muted">Appointments, availability, patients, and prescriptions are managed from the doctor portal.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default SecuritySettings;