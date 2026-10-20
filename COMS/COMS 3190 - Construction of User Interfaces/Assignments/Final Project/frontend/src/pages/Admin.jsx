import { useCallback, useEffect, useState } from "react";
import { errorFromResponse, logClientError } from "../utils/errorLogger.js";

const blankForm = {
  name: "",
  email: "",
  role: "patient",
  password: "",
};

const roles = ["patient", "doctor", "pharmacist", "admin"];

function Admin({ accessToken, apiBase, user }) {
  const [activeView, setActiveView] = useState("users");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(editingId);

  const adminRequest = useCallback(async (path, options = {}) => {
    //all admin calls need the login token or the backend blocks it
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers || {}),
      },
    });
    let data = {};

    try {
      data = await response.json();
    } catch (error) {
      //this catches weird non json api responses
      logClientError(apiBase, error, { area: "admin-response-parse", path });
    }

    if (!response.ok) {
      throw errorFromResponse(response, data, "Admin request failed.");
    }

    return data;
  }, [accessToken, apiBase]);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const data = await adminRequest("/api/admin/users");
      setUsers(data.users);
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "admin-load-users" });
    } finally {
      setIsLoading(false);
    }
  }, [adminRequest, apiBase]);

  const loadErrors = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const data = await adminRequest("/api/admin/errors");
      setErrors(data.errors);
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "admin-load-errors" });
    } finally {
      setIsLoading(false);
    }
  }, [adminRequest, apiBase]);

  useEffect(() => {
    const loadTimer = setTimeout(activeView === "users" ? loadUsers : loadErrors, 0);
    return () => clearTimeout(loadTimer);
  }, [activeView, loadErrors, loadUsers]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(nextUser) {
    //this loads the table row into the form
    setDeleteTarget(null);
    setEditingId(nextUser.id);
    setForm({
      name: nextUser.name,
      email: nextUser.email,
      role: nextUser.role,
      password: "",
    });
    setMessage("");
  }

  function resetForm() {
    setEditingId("");
    setForm(blankForm);
  }

  function requestDelete(nextUser) {
    //delete needs a confirm box so no one nukes a user by accident
    setDeleteTarget(nextUser);
    setMessage("");
  }

  function cancelDelete() {
    setDeleteTarget(null);
  }

  async function submitUser(event) {
    event.preventDefault();
    setMessage("");

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
    };

    if (form.password) {
      payload.password = form.password;
    }

    try {
      if (isEditing) {
        await adminRequest(`/api/admin/users/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("User updated.");
      } else {
        await adminRequest("/api/admin/users", {
          method: "POST",
          body: JSON.stringify({ ...payload, password: form.password }),
        });
        setMessage("User created.");
      }

      resetForm();
      loadUsers();
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "admin-save-user", editingId });
    }
  }

  async function confirmDeleteUser() {
    if (!deleteTarget) {
      return;
    }

    try {
      setMessage("");
      await adminRequest(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" });
      setMessage("User deleted.");
      setDeleteTarget(null);
      loadUsers();
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "admin-delete-user", id: deleteTarget.id });
    }
  }

  async function deleteError(errorId) {
    try {
      setMessage("");
      await adminRequest(`/api/admin/errors/${errorId}`, { method: "DELETE" });
      setMessage("Error log removed.");
      loadErrors();
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "admin-delete-error", id: errorId });
    }
  }

  if (user?.role !== "admin") {
    return (
      <main className="admin-page">
        <section className="admin-header">
          <h1>Admin Panel</h1>
          <p>Admin access is required.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <h1>{activeView === "users" ? "User Management" : "Error Logs"}</h1>
          <p>
            {activeView === "users"
              ? "Create users, edit role/email/name, reset passwords, or remove accounts."
              : "Review frontend and backend errors saved in MongoDB."}
          </p>
        </div>
        <button
          className="btn-admin-secondary"
          onClick={activeView === "users" ? loadUsers : loadErrors}
          type="button"
        >
          Refresh
        </button>
      </section>

      <section className="admin-view-tabs" aria-label="Admin view selector">
        <button
          className={activeView === "users" ? "active" : ""}
          onClick={() => setActiveView("users")}
          type="button"
        >
          Users
        </button>
        <button
          className={activeView === "errors" ? "active" : ""}
          onClick={() => setActiveView("errors")}
          type="button"
        >
          Errors
        </button>
      </section>

      {activeView === "users" && (
        <section className="admin-layout">
          <form className="admin-form" onSubmit={submitUser}>
            <h2>{isEditing ? "Edit User" : "Create User"}</h2>

            <label>
              Name
              <input name="name" onChange={updateField} required type="text" value={form.name} />
            </label>

            <label>
              Email
              <input name="email" onChange={updateField} required type="email" value={form.email} />
            </label>

            <label>
              Role
              <select name="role" onChange={updateField} value={form.role}>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role[0].toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {isEditing ? "New Password" : "Password"}
              <input
                minLength={8}
                name="password"
                onChange={updateField}
                required={!isEditing}
                type="password"
                value={form.password}
              />
            </label>

            {message && <p className="form-message">{message}</p>}

            <div className="admin-actions">
              <button className="btn-submit" type="submit">
                {isEditing ? "Save User" : "Create User"}
              </button>
              {isEditing && (
                <button className="btn-admin-secondary" onClick={resetForm} type="button">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section className="admin-table-wrap">
            <h2>Users</h2>
            {isLoading ? (
              <p className="admin-muted">Loading users...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((nextUser) => (
                    <tr key={nextUser.id}>
                      <td>{nextUser.name}</td>
                      <td>{nextUser.email}</td>
                      <td>{nextUser.role}</td>
                      <td>
                        <button type="button" onClick={() => startEdit(nextUser)}>
                          Edit
                        </button>
                        {nextUser.id !== user.id && (
                          <button type="button" onClick={() => requestDelete(nextUser)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </section>
      )}

      {activeView === "errors" && (
        <section className="admin-table-wrap admin-errors-wrap">
          <h2>Error Log</h2>
          {message && <p className="form-message">{message}</p>}
          {isLoading ? (
            <p className="admin-muted">Loading errors...</p>
          ) : (
            <table className="admin-table admin-error-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((errorLog) => (
                  <tr key={errorLog.id}>
                    <td>{new Date(errorLog.createdAt).toLocaleString()}</td>
                    <td>{errorLog.source}</td>
                    <td>{errorLog.status || ""}</td>
                    <td>
                      <strong>{errorLog.message}</strong>
                      {errorLog.stack && <pre className="error-stack">{errorLog.stack}</pre>}
                    </td>
                    <td>{errorLog.url}</td>
                    <td>
                      <button type="button" onClick={() => deleteError(errorLog.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {deleteTarget && (
        <section className="confirm-overlay" aria-modal="true" role="dialog">
          <div className="confirm-box">
            <h2>Delete User</h2>
            <p>
              Delete {deleteTarget.name} ({deleteTarget.email})? This cannot be undone.
            </p>
            <div className="admin-actions">
              <button className="btn-delete-confirm" onClick={confirmDeleteUser} type="button">
                Delete
              </button>
              <button className="btn-admin-secondary" onClick={cancelDelete} type="button">
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Admin;
