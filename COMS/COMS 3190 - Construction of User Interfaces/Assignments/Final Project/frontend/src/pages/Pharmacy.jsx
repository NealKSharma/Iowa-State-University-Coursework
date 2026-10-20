import { useCallback, useEffect, useMemo, useState } from "react";
import { errorFromResponse, logClientError } from "../utils/errorLogger.js";

// Blank medication object used to reset the add/edit medication form
const blankMedication = {
  name: "",
  strength: "",
  dosageForm: "",
  category: "",
  directions: "",
  stock: 0,
  price: 0,
  isGeneric: false,
  active: true,
};

const blankAssignment = {
  patientId: "",
  medicationId: "",
  dosage: "",
  directions: "",
  notes: "",
};

function Pharmacy({ accessToken, apiBase, user }) {
  const canManage = user?.role === "pharmacist" || user?.role === "admin";
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [medicationForm, setMedicationForm] = useState(blankMedication);
  const [assignmentForm, setAssignmentForm] = useState(blankAssignment);
  const [editingMedicationId, setEditingMedicationId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const activeMedications = useMemo(
    () => medications.filter((medication) => medication.active !== false),
    [medications]
  );
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + Number(item.price || 0) * item.quantity, 0),
    [cart]
  );

  function formatMoney(amount) {
    return `$${Number(amount || 0).toFixed(2)}`;
  }

  const pharmacyRequest = useCallback(async (path, options = {}) => {
    //all pharmacy data still needs the login token
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
      logClientError(apiBase, error, { area: "pharmacy-response-parse", path });
    }

    if (!response.ok) {
      throw errorFromResponse(response, data, "Pharmacy request failed.");
    }

    return data;
  }, [accessToken, apiBase]);

  const loadPharmacy = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const medicationData = await pharmacyRequest("/api/pharmacy/medications");
      setMedications(medicationData.medications || []);

      if (canManage) {
        const [patientData, assignmentData] = await Promise.all([
          pharmacyRequest("/api/pharmacy/patients"),
          pharmacyRequest("/api/pharmacy/assignments"),
        ]);
        setPatients(patientData.patients || []);
        setAssignments(assignmentData.assignments || []);
      }
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "pharmacy-load" });
    } finally {
      setIsLoading(false);
    }
  }, [apiBase, canManage, pharmacyRequest]);

  useEffect(() => {
    const loadTimer = setTimeout(loadPharmacy, 0);
    return () => clearTimeout(loadTimer);
  }, [loadPharmacy]);

  function updateMedicationField(event) {
    const { name, type, checked, value } = event.target;
    setMedicationForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function updateAssignmentField(event) {
    const { name, value } = event.target;
    setAssignmentForm((current) => ({ ...current, [name]: value }));
  }

  function startMedicationEdit(medication) {
    //this throws the medicine row into the edit form
    setEditingMedicationId(medication.id);
    setMedicationForm({
      name: medication.name,
      strength: medication.strength,
      dosageForm: medication.dosageForm,
      category: medication.category,
      directions: medication.directions,
      stock: medication.stock,
      price: medication.price,
      isGeneric: medication.isGeneric,
      active: medication.active,
    });
    setMessage("");
  }

  function resetMedicationForm() {
    setEditingMedicationId("");
    setMedicationForm(blankMedication);
  }

// Creates a new medication or updates an existing medication
  async function submitMedication(event) {
    event.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...medicationForm,
        stock: Number(medicationForm.stock || 0),
        price: Number(medicationForm.price || 0),
      };
      const path = editingMedicationId
        ? `/api/pharmacy/medications/${editingMedicationId}`
        : "/api/pharmacy/medications";

      await pharmacyRequest(path, {
        method: editingMedicationId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setMessage(editingMedicationId ? "Medication updated." : "Medication created.");
      resetMedicationForm();
      loadPharmacy();
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "pharmacy-save-medication", editingMedicationId });
    }
  }
  // Disables a medication instead of permanently deleting it
  async function disableMedication(medicationId) {
    try {
      setMessage("");
      await pharmacyRequest(`/api/pharmacy/medications/${medicationId}`, { method: "DELETE" });
      setMessage("Medication disabled.");
      loadPharmacy();
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "pharmacy-disable-medication", medicationId });
    }
  }

  async function submitAssignment(event) {
    event.preventDefault();
    setMessage("");

    try {
      await pharmacyRequest("/api/pharmacy/assignments", {
        method: "POST",
        body: JSON.stringify(assignmentForm),
      });
      setMessage("Medication assigned.");
      setAssignmentForm(blankAssignment);
      loadPharmacy();
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "pharmacy-assign-medication" });
    }
  }

  async function removeAssignment(assignmentId) {
    try {
      setMessage("");
      await pharmacyRequest(`/api/pharmacy/assignments/${assignmentId}`, { method: "DELETE" });
      setMessage("Assignment removed.");
      loadPharmacy();
    } catch (error) {
      setMessage(error.message);
      logClientError(apiBase, error, { area: "pharmacy-remove-assignment", assignmentId });
    }
  }

  function addToCart(medication) {
    //mock cart only lives in the browser for now
    setCheckoutMessage("");
    setCart((current) => {
      const existingItem = current.find((item) => item.id === medication.id);

      if (existingItem) {
        return current.map((item) =>
          item.id === medication.id
            ? { ...item, quantity: Math.min(item.quantity + 1, medication.stock || 1) }
            : item
        );
      }

      return [...current, { ...medication, quantity: 1 }];
    });
  }

  function updateCartQuantity(medicationId, quantity) {
    const nextQuantity = Math.max(1, Number(quantity || 1));

    setCheckoutMessage("");
    setCart((current) =>
      current.map((item) =>
        item.id === medicationId
          ? { ...item, quantity: Math.min(nextQuantity, item.stock || nextQuantity) }
          : item
      )
    );
  }

  function removeFromCart(medicationId) {
    setCheckoutMessage("");
    setCart((current) => current.filter((item) => item.id !== medicationId));
  }

  function finishMockCheckout() {
    if (cart.length === 0) {
      setCheckoutMessage("Add medicine to the cart first.");
      return;
    }

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    setCheckoutMessage(`Mock checkout complete for ${itemCount} item(s).`);
    setCart([]);
  }

  if (!user) {
    return (
      <main className="pharmacy-page">
        <section className="admin-header">
          <h1>Pharmacy</h1>
          <p>Please log in to view pharmacy information.</p>
        </section>
      </main>
    );
  }

  if (!canManage && user.role !== "patient") {
    return (
      <main className="pharmacy-page">
        <section className="admin-header">
          <h1>Pharmacy</h1>
          <p>Patient or pharmacist access is required.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="pharmacy-page">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Saint Cy's Pharmacy</p>
          <h1>{canManage ? "Pharmacy Management" : "My Medications"}</h1>
          <p>
            {canManage
              ? "Manage medicine inventory and assign prescriptions to patients."
              : "View generic medicine and prescriptions assigned to your account."}
          </p>
        </div>
        <button className="btn-admin-secondary" onClick={loadPharmacy} type="button">
          Refresh
        </button>
      </section>

      {message && <p className="form-message pharmacy-message">{message}</p>}

      {!canManage && (
        <section className="pharmacy-patient-layout">
          <div className="pharmacy-card-grid">
            {isLoading ? (
              <p className="admin-muted">Loading pharmacy...</p>
            ) : (
              activeMedications.map((medication) => (
                <article className="pharmacy-med-card" key={medication.id}>
                  <div className="pharmacy-card-top">
                    <h2>{medication.name}</h2>
                    <span>{medication.access === "assigned" ? "Assigned" : "Generic"}</span>
                  </div>
                  <p className="pharmacy-strength">
                    {medication.strength} {medication.dosageForm}
                  </p>
                  <p className="pharmacy-price">{formatMoney(medication.price)}</p>
                  <p>{medication.directions || "No directions listed."}</p>
                  {medication.assignedDosage && <p>Dosage: {medication.assignedDosage}</p>}
                  {medication.assignedNotes && <p>Notes: {medication.assignedNotes}</p>}
                  <button className="btn-submit pharmacy-cart-button" onClick={() => addToCart(medication)} type="button">
                    Add to Cart
                  </button>
                </article>
              ))
            )}
            {!isLoading && activeMedications.length === 0 && (
              <p className="admin-muted">No medications are available for your account yet.</p>
            )}
          </div>

          <aside className="pharmacy-checkout">
            <h2>Cart</h2>
            {cart.length === 0 ? (
              <p className="admin-muted">Your cart is empty.</p>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    <label>
                      Qty
                      <input
                        max={item.stock || undefined}
                        min="1"
                        onChange={(event) => updateCartQuantity(item.id, event.target.value)}
                        type="number"
                        value={item.quantity}
                      />
                    </label>
                    <strong>{formatMoney(Number(item.price || 0) * item.quantity)}</strong>
                    <button onClick={() => removeFromCart(item.id)} type="button">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatMoney(cartTotal)}</strong>
            </div>
            {checkoutMessage && <p className="checkout-message">{checkoutMessage}</p>}
            <button className="btn-submit" onClick={finishMockCheckout} type="button">
              Mock Checkout
            </button>
          </aside>
        </section>
      )}

      {canManage && (
        <section className="pharmacy-manager-layout">
          //my brain is fucnitoning at 1500% speed its to late help....
          <form className="admin-form" onSubmit={submitMedication}>
            <h2>{editingMedicationId ? "Edit Medication" : "Add Medication"}</h2>

            <label>
              Name
              <input name="name" onChange={updateMedicationField} required type="text" value={medicationForm.name} />
            </label>

            <label>
              Strength
              <input name="strength" onChange={updateMedicationField} required type="text" value={medicationForm.strength} />
            </label>

            <label>
              Form
              <input name="dosageForm" onChange={updateMedicationField} required type="text" value={medicationForm.dosageForm} />
            </label>

            <label>
              Category
              <input name="category" onChange={updateMedicationField} type="text" value={medicationForm.category} />
            </label>

            <label>
              Stock
              <input min="0" name="stock" onChange={updateMedicationField} type="number" value={medicationForm.stock} />
            </label>

            <label>
              Price
              <input min="0" name="price" onChange={updateMedicationField} step="0.01" type="number" value={medicationForm.price} />
            </label>

            <label>
              Directions
              <textarea name="directions" onChange={updateMedicationField} value={medicationForm.directions} />
            </label>

            <label className="checkbox-row">
              <input checked={medicationForm.isGeneric} name="isGeneric" onChange={updateMedicationField} type="checkbox" />
              Generic medicine available to all patients
            </label>

            <label className="checkbox-row">
              <input checked={medicationForm.active} name="active" onChange={updateMedicationField} type="checkbox" />
              Active
            </label>

            <div className="admin-actions">
              <button className="btn-submit" type="submit">
                {editingMedicationId ? "Save Medication" : "Add Medication"}
              </button>
              {editingMedicationId && (
                <button className="btn-admin-secondary" onClick={resetMedicationForm} type="button">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <form className="admin-form" onSubmit={submitAssignment}>
            <h2>Assign Medication</h2>

            <label>
              Patient
              <select name="patientId" onChange={updateAssignmentField} required value={assignmentForm.patientId}>
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.email})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Medication
              <select name="medicationId" onChange={updateAssignmentField} required value={assignmentForm.medicationId}>
                <option value="">Select medication</option>
                {activeMedications.map((medication) => (
                  <option key={medication.id} value={medication.id}>
                    {medication.name} {medication.strength}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Dosage
              <input name="dosage" onChange={updateAssignmentField} required type="text" value={assignmentForm.dosage} />
            </label>

            <label>
              Directions
              <textarea name="directions" onChange={updateAssignmentField} required value={assignmentForm.directions} />
            </label>

            <label>
              Notes
              <textarea name="notes" onChange={updateAssignmentField} value={assignmentForm.notes} />
            </label>

            <button className="btn-submit" type="submit">
              Assign
            </button>
          </form>

          <section className="admin-table-wrap pharmacy-wide">
            <h2>Medication Inventory</h2>
            {isLoading ? (
              <p className="admin-muted">Loading medications...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Strength</th>
                    <th>Access</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((medication) => (
                    <tr key={medication.id}>
                      <td>{medication.name}</td>
                      <td>{medication.strength} {medication.dosageForm}</td>
                      <td>{medication.isGeneric ? "Generic" : "Assigned only"}</td>
                      <td>{medication.stock}</td>
                      <td>{formatMoney(medication.price)}</td>
                      <td>{medication.active ? "Active" : "Inactive"}</td>
                      <td>
                        <button onClick={() => startMedicationEdit(medication)} type="button">
                          Edit
                        </button>
                        {medication.active && (
                          <button onClick={() => disableMedication(medication.id)} type="button">
                            Disable
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="admin-table-wrap pharmacy-wide">
            <h2>Patient Assignments</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Directions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.patientName}</td>
                    <td>{assignment.medicationName}</td>
                    <td>{assignment.dosage}</td>
                    <td>{assignment.directions}</td>
                    <td>
                      <button onClick={() => removeAssignment(assignment.id)} type="button">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </section>
      )}
    </main>
  );
}

export default Pharmacy;
