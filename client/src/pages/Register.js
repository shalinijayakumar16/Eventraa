import { useNavigate } from "react-router-dom";
import { useState } from "react";

const REGISTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    background: #07091A;
    min-height: 100vh;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 68px 16px 12px;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #07091A; }
  ::-webkit-scrollbar-thumb { background: #6366F1; border-radius: 999px; }

  @keyframes regFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blobPulse {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: scale(1); }
    50%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: scale(1.06); }
  }
  @keyframes floatDot {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .reg-blob  { animation: blobPulse 9s ease-in-out infinite; }
  .reg-float { animation: floatDot 4s ease-in-out infinite; }
  .reg-ring-cw  { animation: rotateSlow 22s linear infinite; }
  .reg-ring-ccw { animation: rotateSlow 16s linear infinite reverse; }

  .reg-card { animation: regFadeUp 0.65s ease both; }
  .reg-a1   { animation: regFadeUp 0.55s ease both; animation-delay: 0.06s; }
  .reg-a2   { animation: regFadeUp 0.55s ease both; animation-delay: 0.13s; }
  .reg-a3   { animation: regFadeUp 0.55s ease both; animation-delay: 0.20s; }
  .reg-a4   { animation: regFadeUp 0.55s ease both; animation-delay: 0.27s; }
  .reg-a5   { animation: regFadeUp 0.55s ease both; animation-delay: 0.34s; }
  .reg-a6   { animation: regFadeUp 0.55s ease both; animation-delay: 0.41s; }

  .reg-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 10px 14px 10px 40px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
  }
  .reg-input::placeholder { color: #3A4A5C; }
  .reg-input:focus {
    border-color: rgba(99,102,241,0.55);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .reg-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 10px 32px 10px 40px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    outline: none;
    cursor: pointer;
    appearance: none;
    transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
  }
  .reg-select:focus {
    border-color: rgba(99,102,241,0.55);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .reg-select option { background: #0F1129; color: #E2E8F0; }

  .reg-input-wrap { position: relative; }
  .reg-input-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%); pointer-events: none; opacity: 0.38;
  }
  .reg-chevron {
    position: absolute; right: 11px; top: 50%;
    transform: translateY(-50%); pointer-events: none; opacity: 0.3;
  }
  .pwd-toggle {
    position: absolute; right: 11px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #475569; transition: color 0.2s;
    padding: 2px; display: flex; align-items: center;
  }
  .pwd-toggle:hover { color: #94A3B8; }

  .btn-register {
    width: 100%;
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff; border: none;
    padding: 12px; border-radius: 11px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-register::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-register:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.5); }
  .btn-register:hover::before { opacity: 1; }
  .btn-register:active { transform: translateY(0); }

  .str-bar {
    flex: 1; height: 2px; border-radius: 999px;
    transition: background 0.35s ease;
  }

  .g-text {
    background: linear-gradient(135deg, #E2E8F0 0%, #A5B4FC 40%, #8B5CF6 70%, #EC4899 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .reg-label {
    display: block; margin-bottom: 5px;
    color: #7A8FA6; font-size: 11px; font-weight: 500;
    font-family: 'Outfit', sans-serif; letter-spacing: 0.05em; text-transform: uppercase;
  }
`;

const Icon = ({ name, size = 15, color = "#64748B" }) => {
  const icons = {
    user:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    mail:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    eye:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    book:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    hash:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
    chevronDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>,
    arrowRight:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  };
  return icons[name] || null;
};

const RegBlobBg = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div className="reg-blob" style={{ position: "absolute", top: "-20%", right: "-10%", width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600, background: "radial-gradient(circle at 60% 40%, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)", filter: "blur(64px)" }}/>
    <div className="reg-blob" style={{ position: "absolute", bottom: "-15%", left: "-10%", width: "50vw", height: "50vw", maxWidth: 520, maxHeight: 520, background: "radial-gradient(circle at 40% 60%, rgba(236,72,153,0.11) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)", filter: "blur(72px)", animationDelay: "-5s" }}/>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)" }}/>
    <div className="reg-ring-cw" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(720px,115vw)", height: "min(720px,115vw)", border: "1px dashed rgba(99,102,241,0.07)", borderRadius: "50%" }}/>
    <div className="reg-ring-ccw" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(500px,82vw)", height: "min(500px,82vw)", border: "1px solid rgba(139,92,246,0.05)", borderRadius: "50%" }}/>
    {[
      { size:6,  top:"14%", left:"7%",   delay:"0s",   dur:"4.5s", color:"#6366F1" },
      { size:4,  top:"75%", left:"5%",   delay:"1.2s", dur:"5s",   color:"#8B5CF6" },
      { size:5,  top:"18%", right:"6%",  delay:"2s",   dur:"6s",   color:"#EC4899" },
      { size:4,  top:"80%", right:"9%",  delay:"0.8s", dur:"4s",   color:"#6366F1" },
      { size:7,  top:"9%",  right:"22%", delay:"1.5s", dur:"7s",   color:"#A5B4FC" },
    ].map((dot, i) => (
      <div key={i} className="reg-float" style={{ position:"absolute", width:dot.size, height:dot.size, borderRadius:"50%", background:dot.color, top:dot.top, left:dot.left, right:dot.right, animationDelay:dot.delay, animationDuration:dot.dur, boxShadow:`0 0 ${dot.size*3}px ${dot.color}`, opacity:0.55 }}/>
    ))}
  </div>
);

const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "transparent" };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return [
    { score: s, label: "Too short", color: "#EF4444" },
    { score: s, label: "Weak",      color: "#F97316" },
    { score: s, label: "Fair",      color: "#EAB308" },
    { score: s, label: "Good",      color: "#6EE7B7" },
    { score: s, label: "Strong",    color: "#22C55E" },
  ][s];
};


 function Register() {
  const navigate = useNavigate();






  // ✅ STATES
  const [name, setName] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [showPassword, setShowPassword] = useState(false);

   // ✅ NOW use password
  const strength = getStrength(password);
  // ✅ DROPDOWN DATA
  const depts = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Biotechnology",
    "MBA",
    "MCA",
    "Other"
  ];

  const years = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "PG – 1st Year",
    "PG – 2nd Year"
  ];

  // ✅ REGISTER FUNCTION
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          registerNo,
          email,
          password,
          department,
          year,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully 🎉");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <>
      <style>{REGISTER_STYLES}</style>
      <div className="reg-root">
        <RegBlobBg />

        {/* Navbar */}
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 24px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(7,9,26,0.82)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }} onClick={() => navigate("/")}>
            <div style={{ width:30, height:30, borderRadius:9, background:"linear-gradient(135deg,#6366F1,#8B5CF6,#EC4899)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(99,102,241,0.45)", fontSize:14, fontWeight:800, color:"#fff", fontFamily:"'Outfit',sans-serif" }}>E</div>
            <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, background:"linear-gradient(135deg,#E2E8F0,#A5B4FC)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.02em" }}>Eventra</span>
          </div>
          <button onClick={() => navigate("/login")} style={{ background:"rgba(255,255,255,0.04)", color:"#CBD5E1", border:"1px solid rgba(255,255,255,0.1)", padding:"7px 16px", borderRadius:9, fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:500, cursor:"pointer" }}>
            Log In
          </button>
        </div>

        {/* Card */}
        <div className="reg-card" style={{ position:"relative", zIndex:1, width:"100%", maxWidth:456, padding:"24px 30px 22px", background:"rgba(255,255,255,0.03)", backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:22, boxShadow:"0 28px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)" }}>

          {/* Top shimmer */}
          <div style={{ position:"absolute", top:0, left:"8%", right:"8%", height:1, background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.7),rgba(236,72,153,0.5),transparent)" }}/>

          {/* Header */}
          <div className="reg-a1" style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"4px 13px", borderRadius:999, background:"rgba(139,92,246,0.1)", border:"1px solid rgba(139,92,246,0.25)", fontSize:11, color:"#C4B5FD", fontFamily:"'DM Sans',sans-serif", marginBottom:10 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:"#6EE7B7", display:"inline-block", boxShadow:"0 0 7px #6EE7B7" }}/>
              Join 2,400+ students on Eventra
            </div>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:"1.55rem", letterSpacing:"-0.04em", lineHeight:1.15 }}>
              <span className="g-text">Create your</span>{" "}
              <span style={{ color:"#E2E8F0" }}>account</span>
            </h1>
          </div>

          {/* Fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

            {/* Row 1 — Name + Register No */}
            <div className="reg-a2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label className="reg-label">Full Name</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><Icon name="user" /></span>
                  <input type="text" className="reg-input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="reg-label">Register No.</label>
                <div className="reg-input-wrap">
                  <span className="reg-input-icon"><Icon name="hash" /></span>
                  <input
  type="text"
  className="reg-input"
  placeholder="e.g. 22CS001"
  value={registerNo}
  onChange={(e) => setRegisterNo(e.target.value)}
/>
                </div>
              </div>
            </div>

            {/* Row 2 — Email */}
            <div className="reg-a3">
              <label className="reg-label">Email Address</label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon"><Icon name="mail" /></span>
                <input type="email" className="reg-input" placeholder="you@college.edu" value={email} onChange={(e)=> setEmail(e.target.value)}/>
              </div>
            </div>

         {/* Row 3 — Dept + Year */}
<div className="reg-a4" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
  
  {/* Department */}
  <div>
    <label className="reg-label">Department</label>
    <div className="reg-input-wrap">
      <span className="reg-input-icon"><Icon name="book" /></span>
      
      <select 
        className="reg-select"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="" disabled>Select dept</option>
        {depts.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <span className="reg-chevron"><Icon name="chevronDown" size={13} /></span>
    </div>
  </div>

  {/* Year */}
  <div>
    <label className="reg-label">Year</label>
    <div className="reg-input-wrap">
      <span className="reg-input-icon"><Icon name="calendar" /></span>
      
      <select 
        className="reg-select"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        <option value="" disabled>Select year</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      <span className="reg-chevron"><Icon name="chevronDown" size={13} /></span>
    </div>
  </div>

</div>

            {/* Row 4 — Password */}
            <div className="reg-a5">
              <label className="reg-label">Password</label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon"><Icon name="lock" /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="reg-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button className="pwd-toggle" onClick={() => setShowPassword(v => !v)}>
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={14} color="currentColor" />
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                  <div style={{ display:"flex", gap:4, flex:1 }}>
                    {[1,2,3,4].map(n => (
                      <div key={n} className="str-bar" style={{ background: n <= strength.score ? strength.color : "rgba(255,255,255,0.07)" }}/>
                    ))}
                  </div>
                  <span style={{ fontSize:10.5, color:strength.color, fontFamily:"'Outfit',sans-serif", fontWeight:600, minWidth:42, textAlign:"right" }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="reg-a6" style={{ marginTop:4 }}>
              <button className="btn-register" onClick={handleRegister}>
                Create Account
                <Icon name="arrowRight" size={15} color="white" />
              </button>
            </div>
          </div>

          {/* Footer link */}
          <p style={{ textAlign:"center", marginTop:14, color:"#475569", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            Already have an account?{" "}
            <span
              style={{ background:"linear-gradient(135deg,#6366F1,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}
              onClick={() => navigate("/login")}
            >
              Login →
            </span>
          </p>

          {/* Bottom shimmer */}
          <div style={{ position:"absolute", bottom:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)" }}/>
        </div>
      </div>
    </>
  );
}

export default Register;