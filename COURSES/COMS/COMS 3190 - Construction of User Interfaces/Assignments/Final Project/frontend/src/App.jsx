import { useEffect, useState } from "react";
import Admin from "./pages/Admin.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Pharmacy from "./pages/Pharmacy.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import { logClientError } from "./utils/errorLogger.js";
import Appointments from "./pages/Appointments.jsx";
import DoctorPortal from "./pages/DoctorPortal.jsx";
import SecuritySettings from "./pages/SecuritySettings.jsx";
import Support from "./pages/Support.jsx";
import TeamInfo from "./pages/TeamInfo.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5050").replace(/\/$/, "");
const storageKey = "saintCysAuth";

function routeFromPath(pathname) {
  // this turns the browser url into the page React should show
  if (pathname === "/login") {
    return "login";
  }

  if (pathname === "/signup") {
    return "signup";
  }

  if (pathname === "/dashboard") {
    return "dashboard";
  }

  if (pathname === "/admin") {
    return "admin";
  }

  if (pathname === "/pharmacy") {
    return "pharmacy";
  }

  if (pathname === "/appointments") {
    return "appointments";
  }

  if (pathname === "/doctor-portal") {
    return "doctorPortal";
  }

  if (pathname === "/") {
    return "home";
  }

  if (pathname === "/settings") {
    return "settings";
  }

  if (pathname === "/support") {
    return "support";
  }

  if (pathname === "/team") {
    return "team";
  }

  return "notFound";
}

function pathFromRoute(route) {
  // this does the reverse and puts the right url in the browser
  if (route === "login") {
    return "/login";
  }

  if (route === "signup") {
    return "/signup";
  }

  if (route === "dashboard") {
    return "/dashboard";
  }

  if (route === "admin") {
    return "/admin";
  }

  if (route === "pharmacy") {
    return "/pharmacy";
  }

  if (route === "appointments") {
    return "/appointments";
  }

  if (route === "doctorPortal") {
    return "/doctor-portal";
  }

  if (route === "settings") {
    return "/settings";
  }

  if (route === "support") {
    return "/support";
  }

  if (route === "team") {
    return "/team";
  }

  if (route === "notFound") {
    return window.location.pathname;
  }

  return "/";
}

function readSavedAuth() {
  try {
    // this checks if the user was already logged in before refresh
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

function defaultRouteForUser(user) {
  if (user?.role === "admin") {
    return "admin";
  }

  if (user?.role === "doctor") {
    return "doctorPortal";
  }

  if (user?.role === "pharmacist") {
    return "pharmacy";
  }

  return "dashboard";
}

function canAccessRoute(route, user) {
  if (route === "support" || route === "team" || route === "home" || route === "notFound") {
    return true;
  }

  if (route === "login" || route === "signup") {
    return !user;
  }

  if (!user) {
    return false;
  }

  if (route === "settings") {
    return true;
  }

  if (route === "admin") {
    return user.role === "admin";
  }

  if (route === "doctorPortal") {
    return user.role === "doctor";
  }

  if (route === "pharmacy") {
    return user.role === "patient" || user.role === "pharmacist";
  }

  if (route === "appointments" || route === "dashboard") {
    return user.role === "patient";
  }

  return false;
}

function App() {
  const [auth, setAuth] = useState(readSavedAuth);
  const [page, setPage] = useState(() => routeFromPath(window.location.pathname));

  useEffect(() => {
    // these catch random frontend crashes and promise errors
    function handleWindowError(event) {
      logClientError(API_BASE, event.error || event.message, {
        type: "window-error",
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    }

    function handleUnhandledRejection(event) {
      logClientError(API_BASE, event.reason, { type: "unhandled-promise" });
    }

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    // this keeps back and forward browser buttons working
    function handlePopState() {
      setPage(routeFromPath(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (page === "notFound") {
      logClientError(API_BASE, new Error("Invalid frontend route"), {
        area: "frontend-route",
        path: window.location.pathname,
      });
    }
  }, [page]);

  useEffect(() => {
    if (!canAccessRoute(page, auth?.user)) {
      navigate(auth?.user ? defaultRouteForUser(auth.user) : "login");
    }
  }, [auth, page]);

  useEffect(() => {
    async function refreshSession() {
      // this tries to keep the user logged in after page refresh
      const savedAuth = readSavedAuth();

      if (!savedAuth?.accessToken) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${savedAuth.accessToken}` },
        });

        if (!response.ok) {
          if (!savedAuth.refreshToken) {
            throw new Error("Session expired");
          }

          const refreshResponse = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: savedAuth.refreshToken }),
          });
          const refreshData = await refreshResponse.json();

          if (!refreshResponse.ok) {
            throw new Error(refreshData.message || "Session expired");
          }

          setAuth(refreshData);
          localStorage.setItem(storageKey, JSON.stringify(refreshData));
          redirectUser(refreshData.user);
          return;
        }

        const data = await response.json();
        const nextAuth = { ...savedAuth, user: data.user };
        setAuth(nextAuth);
        localStorage.setItem(storageKey, JSON.stringify(nextAuth));
        redirectUser(data.user);
      } catch (error) {
        logClientError(API_BASE, error, { area: "session-refresh" });
        localStorage.removeItem(storageKey);
        setAuth(null);
        navigate("login");
      }
    }

    refreshSession();
  }, []);

  function navigate(route) {
    const nextPath = pathFromRoute(route);
    setPage(route);

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }

  function redirectUser(user) {
    // this keeps users away from pages that are not meant for their role
    const currentRoute = routeFromPath(window.location.pathname);

    if (!canAccessRoute(currentRoute, user)) {
      navigate(defaultRouteForUser(user));
      return;
    }
  }

  function handleAuth(nextAuth) {
    setAuth(nextAuth);
    localStorage.setItem(storageKey, JSON.stringify(nextAuth));

    if (nextAuth.user?.role === "admin") {
      navigate("admin");
      return;
    }

    if (nextAuth.user?.role === "pharmacist") {
      navigate("pharmacy");
      return;
    }

    if (nextAuth.user?.role === "doctor") {
      navigate("doctorPortal");
      return;
    }

    navigate("dashboard");
  }

  async function handleLogout() {
    const savedAuth = readSavedAuth();

    if (savedAuth?.refreshToken) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: savedAuth.refreshToken }),
      }).catch((error) => {
        // logout should still clear local storage even if the api call fails
        logClientError(API_BASE, error, { area: "logout" });
      });
    }

    setAuth(null);
    localStorage.removeItem(storageKey);
    navigate("home");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={auth?.user} onNavigate={navigate} onLogout={handleLogout} />

      {(page === "login" || page === "signup") && (
        <Login apiBase={API_BASE} initialMode={page} onAuth={handleAuth} onNavigate={navigate} />
      )}

      {page === "admin" && auth?.user?.role === "admin" && (
        <Admin accessToken={auth.accessToken} apiBase={API_BASE} user={auth.user} />
      )}
      {page === "admin" && !auth?.user && (
        <Login apiBase={API_BASE} initialMode="login" onAuth={handleAuth} onNavigate={navigate} />
      )}

      {page === "dashboard" && auth?.user?.role === "patient" && (
        <Dashboard user={auth.user} accessToken={auth.accessToken} onNavigate={navigate} />
      )}

      {page === "pharmacy" && auth?.user?.role === "patient" && (
        <Pharmacy accessToken={auth.accessToken} apiBase={API_BASE} user={auth.user} />
      )}
      {page === "pharmacy" && auth?.user?.role === "pharmacist" && (
        <Pharmacy accessToken={auth.accessToken} apiBase={API_BASE} user={auth.user} />
      )}
      {page === "pharmacy" && !auth?.user && (
        <Login apiBase={API_BASE} initialMode="login" onAuth={handleAuth} onNavigate={navigate} />
      )}

      {page === "appointments" && auth?.user?.role === "patient" && (
        <Appointments accessToken={auth.accessToken} apiBase={API_BASE} user={auth.user} />
      )}
      {page === "appointments" && !auth?.user && (
        <Login apiBase={API_BASE} initialMode="login" onAuth={handleAuth} onNavigate={navigate} />
      )}

      {page === "doctorPortal" && auth?.user?.role === "doctor" && (
        <DoctorPortal accessToken={auth.accessToken} apiBase={API_BASE} user={auth.user} />
      )}
      {page === "doctorPortal" && !auth?.user && (
        <Login apiBase={API_BASE} initialMode="login" onAuth={handleAuth} onNavigate={navigate} />
      )}

      {page === "settings" && auth?.user && (
        <SecuritySettings accessToken={auth.accessToken} apiBase={API_BASE} user={auth.user} />
      )}
      {page === "settings" && !auth?.user && (
        <Login apiBase={API_BASE} initialMode="login" onAuth={handleAuth} onNavigate={navigate} />
      )}

      {page === "support" && <Support />}

      {page === "team" && <TeamInfo />}

      {(page === "home" || (page === "dashboard" && !auth?.user)) && (
        <Home user={auth?.user} onNavigate={navigate} />
      )}

      {page === "notFound" && <NotFound onNavigate={navigate} />}

      {auth?.user && <AIAssistant accessToken={auth.accessToken} apiBase={API_BASE} />}

      <Footer />
    </div>
  );
}

export default App;
