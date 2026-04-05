import { useEffect, useState } from "react";

const EDIT_PROFILE_STYLES = `
  .edit-profile-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .edit-profile-modal {
    width: min(100%, 560px);
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(7, 9, 26, 0.98));
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
    overflow: hidden;
  }

  .edit-profile-head {
    padding: 22px 24px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .edit-profile-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: #E2E8F0;
    margin: 0;
  }

  .edit-profile-subtitle {
    margin-top: 6px;
    color: #64748B;
    font-size: 0.95rem;
  }

  .edit-profile-close {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
    color: #CBD5E1;
    cursor: pointer;
  }

  .edit-profile-form {
    padding: 24px;
    display: grid;
    gap: 16px;
  }

  .edit-profile-field {
    display: grid;
    gap: 8px;
  }

  .edit-profile-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94A3B8;
    font-family: 'Outfit', sans-serif;
  }

  .edit-profile-input {
    width: 100%;
    padding: 13px 14px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: #E2E8F0;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .edit-profile-input:focus {
    border-color: rgba(99, 102, 241, 0.55);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.14);
    background: rgba(99, 102, 241, 0.06);
  }

  .edit-profile-error {
    margin: 0 24px 0;
    padding: 12px 14px;
    border-radius: 12px;
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.18);
    color: #FCA5A5;
    font-size: 0.92rem;
  }

  .edit-profile-actions {
    padding: 0 24px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .edit-profile-btn {
    padding: 12px 18px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
  }

  .edit-profile-btn.secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #CBD5E1;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .edit-profile-btn.primary {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: white;
    box-shadow: 0 6px 22px rgba(99, 102, 241, 0.28);
  }

  .edit-profile-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 520px) {
    .edit-profile-head, .edit-profile-form, .edit-profile-actions { padding-left: 18px; padding-right: 18px; }
    .edit-profile-actions { flex-direction: column; }
    .edit-profile-btn { width: 100%; }
  }
`;

function EditProfile({ user, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    year: "",
    profilePic: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      department: user.department || "",
      year: user.year || "",
      profilePic: user.profilePic || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?._id) {
      setError("Missing user information.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/users/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      if (onSaved) {
        onSaved(data);
      }

      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <style>{EDIT_PROFILE_STYLES}</style>
      <div className="edit-profile-overlay" onClick={onClose}>
        <div className="edit-profile-modal" onClick={(event) => event.stopPropagation()}>
          <div className="edit-profile-head">
            <div>
              <h2 className="edit-profile-title">Edit Profile</h2>
              <p className="edit-profile-subtitle">Update your student details and avatar link.</p>
            </div>
            <button type="button" className="edit-profile-close" onClick={onClose} aria-label="Close edit profile">
              ×
            </button>
          </div>

          {error && <div className="edit-profile-error">{error}</div>}

          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="edit-profile-field">
              <label className="edit-profile-label" htmlFor="name">Name</label>
              <input id="name" className="edit-profile-input" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
            </div>

            <div className="edit-profile-field">
              <label className="edit-profile-label" htmlFor="department">Department</label>
              <input id="department" className="edit-profile-input" name="department" value={formData.department} onChange={handleChange} placeholder="Enter your department" />
            </div>

            <div className="edit-profile-field">
              <label className="edit-profile-label" htmlFor="year">Year</label>
              <input id="year" className="edit-profile-input" name="year" value={formData.year} onChange={handleChange} placeholder="Enter your year" />
            </div>

            <div className="edit-profile-field">
              <label className="edit-profile-label" htmlFor="profilePic">Profile Picture URL</label>
              <input id="profilePic" className="edit-profile-input" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="https://..." />
            </div>

            <div className="edit-profile-actions">
              <button type="button" className="edit-profile-btn secondary" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="edit-profile-btn primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
