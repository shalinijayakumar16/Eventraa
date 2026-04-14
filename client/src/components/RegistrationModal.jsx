import Icon from "./icon";

function RegistrationModal({ event, formValues, onFormChange, onConfirmRegistration, onClose, isSubmitting = false }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 999, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", fontSize: 11, color: "#A5B4FC", fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
              ✨ Event Registration
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 19, color: "#E2E8F0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <Icon name="x" size={16} color="#94A3B8" />
          </button>
        </div>

        {/* Form fields */}
        <div style={{ padding: "20px 28px" }}>
          {event.formFields?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {event.formFields.map((field, i) => (
                <div key={i}>
                  <label className="form-label">{field.label}{field.required ? " *" : ""}</label>
                  <input
                    className="form-input"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    type={field.type}
                    required={field.required}
                    value={formValues[field.label] || ""}
                    onChange={(e) => onFormChange({ ...formValues, [field.label]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "16px", borderRadius: 12, background: "rgba(110,231,183,0.06)", border: "1px solid rgba(110,231,183,0.15)", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="check" size={16} color="#6EE7B7" />
              <p style={{ color: "#94A3B8", fontSize: 14 }}>No additional details required. Just confirm to register!</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: "0 28px 24px", display: "flex", gap: 10 }}>
          <button className="btn-ghost" onClick={onClose} style={{ padding: "11px 20px" }} disabled={isSubmitting}>Cancel</button>
          <button
            className="btn-primary-glow"
            onClick={onConfirmRegistration}
            disabled={isSubmitting}
            style={{ flex: 1, justifyContent: "center", padding: "11px", animation: "glowPulse 3s ease infinite" }}
          >
            {isSubmitting ? (
              "Registering..."
            ) : (
              <>
                <Icon name="check" size={15} color="white" />
                Confirm Registration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationModal;
