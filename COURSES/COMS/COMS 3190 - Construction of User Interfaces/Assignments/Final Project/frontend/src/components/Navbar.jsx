function Navbar({ user, onNavigate, onLogout }) {
    const isPatient = user?.role === "patient";
    const isDoctor = user?.role === "doctor";
    const isPharmacist = user?.role === "pharmacist";
    const isAdmin = user?.role === "admin";

    return (
        <nav className="navbar">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <button className="navbar-brand" onClick={() => onNavigate("home")} type="button">
                    Saint Cy's Hospital
                </button>

                <div className="flex gap-6">
                    {user && <button onClick={() => onNavigate("home")} type="button">Home</button>}

                    {isAdmin && (
                        <button onClick={() => onNavigate("admin")} type="button">Admin</button>
                    )}

                    {isPatient && (
                        <>
                            <button onClick={() => onNavigate("dashboard")} type="button">Dashboard</button>
                            <button onClick={() => onNavigate("appointments")} type="button">Appointments</button>
                            <button onClick={() => onNavigate("pharmacy")} type="button">Pharmacy</button>
                        </>
                    )}

                    {isDoctor && (
                        <button onClick={() => onNavigate("doctorPortal")} type="button">Doctor Portal</button>
                    )}

                    {isPharmacist && (
                        <button onClick={() => onNavigate("pharmacy")} type="button">Pharmacy</button>
                    )}

                    {user && (
                        <button onClick={() => onNavigate("settings")} type="button">Settings</button>
                    )}

                    <button onClick={() => onNavigate("support")} type="button">Support</button>
                    <button onClick={() => onNavigate("team")} type="button">Team Info</button>
                </div>

                <div className="flex gap-3">
                    {user ? (
                        <button className="btn-outline nav-auth-button" onClick={onLogout} type="button">
                            Log Out
                        </button>
                    ) : (
                        <>
                            <button className="btn-outline nav-auth-button" onClick={() => onNavigate("login")} type="button">
                                Log In
                            </button>
                            <button className="btn-primary nav-auth-button" onClick={() => onNavigate("signup")} type="button">
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
