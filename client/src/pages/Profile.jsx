import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import { apiUrl } from "../constants/api";

const DEFAULT_AVATAR = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="avatarGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6366F1" />
        <stop offset="100%" stop-color="#EC4899" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="100" fill="#0F172A" />
    <circle cx="100" cy="78" r="34" fill="url(#avatarGradient)" />
    <path d="M42 168c11-32 37-52 58-52s47 20 58 52" fill="url(#avatarGradient)" />
  </svg>
`)}`;

const PROFILE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;700&display=swap');

  .profile-page {
    min-height: 100vh;
    background: #07091A;
    color: #E2E8F0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 18px;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  .profile-page::before,
  .profile-page::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(24px);
    pointer-events: none;
  }

  .profile-page::before {
    width: 360px;
    height: 360px;
    top: -120px;
    left: -120px;
    background: rgba(99, 102, 241, 0.16);
  }

  .profile-page::after {
    width: 280px;
    height: 280px;
    right: -100px;
    bottom: -90px;
    background: rgba(236, 72, 153, 0.12);
  }

  .profile-card {
    position: relative;
    z-index: 1;
    width: min(100%, 760px);
    border-radius: 28px;
    padding: 28px;
    background: rgba(15, 23, 42, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(22px);
  }

  .profile-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
  }

  .profile-title {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    margin: 0;
  }

  .profile-subtitle {
    margin-top: 8px;
    color: #64748B;
    font-size: 0.98rem;
    line-height: 1.6;
  }

  .profile-edit-btn,
  .profile-back-btn {
    border: none;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 0.94rem;
    border-radius: 12px;
    padding: 12px 18px;
  }

  .profile-edit-btn {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: white;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.28);
  }

  .profile-back-btn {
    background: rgba(255, 255, 255, 0.05);
    color: #CBD5E1;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .profile-content {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 28px;
    align-items: center;
  }

  .profile-avatar-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-avatar {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.36);
    background: rgba(255, 255, 255, 0.04);
  }

  .profile-info-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .profile-field {
    padding: 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .profile-field-label {
    font-family: 'Outfit', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94A3B8;
    margin-bottom: 8px;
  }

  .profile-field-value {
    color: #E2E8F0;
    font-size: 1rem;
    word-break: break-word;
  }

  .profile-message {
    padding: 18px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #94A3B8;
  }

  .profile-error {
    color: #FCA5A5;
    background: rgba(248, 113, 113, 0.08);
    border-color: rgba(248, 113, 113, 0.18);
  }

  .profile-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 22px;
  }

  @media (max-width: 760px) {
    .profile-card { padding: 22px; }
    .profile-card-head { flex-direction: column; }
    .profile-content { grid-template-columns: 1fr; }
    .profile-info-grid { grid-template-columns: 1fr; }
    .profile-avatar { width: 150px; height: 150px; }
  }
`;

function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    if (!userId) {
      setError("No logged-in student found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(apiUrl(`/api/users/user/${userId}`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load profile");
      }

      if (!data) {
        throw new Error("Invalid profile response from server");
      }

      setUser(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId, token]);

  const handleSaved = (updatedUser) => {
    setUser(updatedUser);
    setShowEdit(false);
  };

  const avatarSrc = user?.profilePic?.trim() ? user.profilePic.trim() : DEFAULT_AVATAR;

  return (
    <>
      <style>{PROFILE_STYLES}</style>
      <div className="profile-page">
        <main className="profile-card">
          <div className="profile-card-head">
            <div>
              <h1 className="profile-title">Student Profile</h1>
              <p className="profile-subtitle">View and manage your profile details in one place.</p>
            </div>

            <div className="profile-actions">
              <button type="button" className="profile-back-btn" onClick={() => navigate("/student")}>Back to Dashboard</button>
              <button type="button" className="profile-edit-btn" onClick={() => setShowEdit((previous) => !previous)}>
                {showEdit ? "Close Edit Mode" : "Edit Profile"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="profile-message">Loading profile...</div>
          ) : error ? (
            <div className="profile-message profile-error">{error}</div>
          ) : user ? (
            <div className="profile-content">
              <div className="profile-avatar-wrap">
                <img className="profile-avatar" src={avatarSrc} alt={user.name || "Student profile"} />
              </div>

              <div className="profile-info-grid">
                <div className="profile-field">
                  <div className="profile-field-label">Name</div>
                  <div className="profile-field-value">{user.name || "—"}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Register Number</div>
                  <div className="profile-field-value">{user.registerNo || "—"}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Email</div>
                  <div className="profile-field-value">{user.email || "—"}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Department</div>
                  <div className="profile-field-value">{user.department || "—"}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Year</div>
                  <div className="profile-field-value">{user.year || "—"}</div>
                </div>
              </div>
            </div>
          ) : null}
        </main>

        {showEdit && user && (
          <EditProfile
            user={user}
            onClose={() => setShowEdit(false)}
            onSaved={handleSaved}
          />
        )}
      </div>
    </>
  );
}

export default Profile;
