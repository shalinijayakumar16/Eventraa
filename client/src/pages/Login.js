import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../hooks/useToast";

const LOGIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    background: #07091A;
    min-height: 100vh;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 62px 16px 12px;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #07091A; }
  ::-webkit-scrollbar-thumb { background: #6366F1; border-radius: 999px; }

  @keyframes lFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes blobPulse {
    0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; transform: scale(1); }
    50%      { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; transform: scale(1.06); }
  }
  @keyframes floatDot {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .l-blob      { animation: blobPulse   9s  ease-in-out infinite; }
  .l-dot       { animation: floatDot    4s  ease-in-out infinite; }
  .l-ring-cw   { animation: rotateSlow 22s  linear     infinite; }
  .l-ring-ccw  { animation: rotateSlow 16s  linear     infinite reverse; }

  .l-card { animation: lFadeUp 0.65s ease both; }
  .l-a1   { animation: lFadeUp 0.55s ease both; animation-delay: 0.06s; }
  .l-a2   { animation: lFadeUp 0.55s ease both; animation-delay: 0.13s; }
  .l-a3   { animation: lFadeUp 0.55s ease both; animation-delay: 0.20s; }
  .l-a4   { animation: lFadeUp 0.55s ease both; animation-delay: 0.27s; }
  .l-a5   { animation: lFadeUp 0.55s ease both; animation-delay: 0.34s; }
  .l-a6   { animation: lFadeUp 0.55s ease both; animation-delay: 0.41s; }
  .l-foot { animation: lFadeIn 0.55s ease both; animation-delay: 0.48s; }

  /* ── Input ── */
  .l-input-wrap { position: relative; }
  .l-input {
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
  .l-input::placeholder { color: #3A4A5C; }
  .l-input:focus {
    border-color: rgba(99,102,241,0.55);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .l-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none; opacity: 0.38;
  }
  .pwd-toggle {
    position: absolute; right: 11px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #475569; transition: color 0.2s;
    padding: 2px; display: flex; align-items: center;
  }
  .pwd-toggle:hover { color: #94A3B8; }

  /* ── Button ── */
  .btn-login {
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
  .btn-login::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-login:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.5); }
  .btn-login:hover::before { opacity: 1; }
  .btn-login:active { transform: translateY(0); }

  /* ── Divider ── */
  .l-divider {
    display: flex; align-items: center; gap: 12px;
    color: #2D3748; font-size: 10.5px;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .l-divider::before, .l-divider::after {
    content: ''; flex: 1; height: 1px;
    background: rgba(255,255,255,0.07);
  }

  /* ── Google btn ── */
  .btn-google {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px; padding: 11px;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    color: #94A3B8; font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 500;
    cursor: pointer; transition: all 0.22s;
  }
  .btn-google:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(99,102,241,0.35);
    color: #E2E8F0;
  }

  /* ── Helpers ── */
  .g-text {
    background: linear-gradient(135deg,#E2E8F0 0%,#A5B4FC 40%,#8B5CF6 70%,#EC4899 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .l-label {
    display: block; margin-bottom: 5px;
    color: #7A8FA6; font-size: 11px; font-weight: 500;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .forgot-link {
    color: #475569; font-size: 11.5px; cursor: pointer;
    text-decoration: none; transition: color 0.2s;
  }
  .forgot-link:hover { color: #A5B4FC; }
  .remember-check { accent-color: #6366F1; width: 13px; height: 13px; cursor: pointer; }
`;


const Icon = ({ name, size = 15, color = "#64748B" }) => {
  const icons = {
    mail:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    eye:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeOff:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  };
  return icons[name] || null;
};

const LoginBlobBg = () => (
  <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
    <div className="l-blob" style={{ position:"absolute", top:"-20%", left:"-15%", width:"70vw", height:"70vw", maxWidth:680, maxHeight:680, background:"radial-gradient(circle at 40% 40%, rgba(99,102,241,0.17) 0%, rgba(139,92,246,0.09) 40%, transparent 70%)", filter:"blur(64px)" }}/>
    <div className="l-blob" style={{ position:"absolute", bottom:"-15%", right:"-10%", width:"55vw", height:"55vw", maxWidth:580, maxHeight:580, background:"radial-gradient(circle at 60% 60%, rgba(236,72,153,0.13) 0%, rgba(139,92,246,0.07) 50%, transparent 70%)", filter:"blur(72px)", animationDelay:"-4s" }}/>
    <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)", backgroundSize:"80px 80px", maskImage:"radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)" }}/>
    <div className="l-ring-cw"  style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"min(700px,110vw)", height:"min(700px,110vw)", border:"1px dashed rgba(99,102,241,0.08)", borderRadius:"50%" }}/>
    <div className="l-ring-ccw" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"min(500px,80vw)",  height:"min(500px,80vw)",  border:"1px solid  rgba(139,92,246,0.06)", borderRadius:"50%" }}/>
    {[
      {size:6, top:"18%", left:"10%",   delay:"0s",   dur:"4.5s", color:"#6366F1"},
      {size:4, top:"70%", left:"6%",    delay:"1.2s", dur:"5s",   color:"#8B5CF6"},
      {size:5, top:"25%", right:"8%",   delay:"2s",   dur:"6s",   color:"#EC4899"},
      {size:4, top:"75%", right:"12%",  delay:"0.8s", dur:"4s",   color:"#6366F1"},
      {size:8, top:"12%", right:"22%",  delay:"1.5s", dur:"7s",   color:"#A5B4FC"},
      {size:4, top:"60%", left:"18%",   delay:"3s",   dur:"5.5s", color:"#EC4899"},
    ].map((d,i) => (
      <div key={i} className="l-dot" style={{ position:"absolute", width:d.size, height:d.size, borderRadius:"50%", background:d.color, top:d.top, left:d.left, right:d.right, animationDelay:d.delay, animationDuration:d.dur, boxShadow:`0 0 ${d.size*3}px ${d.color}`, opacity:0.6 }}/>
    ))}
  </div>
);


  // ✅ ADD HANDLE LOGIN HERE (INSIDE Login function)
 function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);

  // ✅ ADD THESE (you missed them)
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const [registerNo, setRegisterNo] = useState("");
  const [password, setPassword] = useState("");

  // ✅ MOVE HANDLE LOGIN HERE
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registerNo, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Login successful! 🚀", "success");

      // ✅ ADD THESE LINES
      localStorage.setItem("userId", data.user._id);

      // (optional but recommended)
      localStorage.setItem("token", data.token);
      localStorage.setItem("student", JSON.stringify(data.user));

        navigate("/student");
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Server error", "error");
    }
  };

  return (
    <>
      <style>{LOGIN_STYLES}</style>
      <div className="login-root">
        <LoginBlobBg />

        {/* Navbar */}
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 24px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(7,9,26,0.82)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }} onClick={() => navigate("/")}>
            <div style={{ width:30, height:30, borderRadius:9, background:"linear-gradient(135deg,#6366F1,#8B5CF6,#EC4899)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(99,102,241,0.45)", fontSize:14, fontWeight:800, color:"#fff", fontFamily:"'Outfit',sans-serif" }}>E</div>
            <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, background:"linear-gradient(135deg,#E2E8F0,#A5B4FC)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.02em" }}>Eventra</span>
          </div>
          <button onClick={() => navigate("/register")} style={{ background:"rgba(255,255,255,0.04)", color:"#CBD5E1", border:"1px solid rgba(255,255,255,0.1)", padding:"7px 16px", borderRadius:9, fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:500, cursor:"pointer" }}>
            Sign Up →
          </button>
        </div>

        {/* Card */}
        <div className="l-card" style={{ position:"relative", zIndex:1, width:"100%", maxWidth:420, padding:"24px 28px 20px", background:"rgba(255,255,255,0.03)", backdropFilter:"blur(24px) saturate(180%)", WebkitBackdropFilter:"blur(24px) saturate(180%)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:22, boxShadow:"0 28px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)" }}>

          {/* Top shimmer */}
          <div style={{ position:"absolute", top:0, left:"8%", right:"8%", height:1, background:"linear-gradient(90deg,transparent,rgba(99,102,241,0.7),rgba(139,92,246,0.7),transparent)" }}/>

          {/* Badge */}
          <div className="l-a1" style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 14px", borderRadius:999, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.28)", fontSize:11, color:"#A5B4FC", fontFamily:"'DM Sans',sans-serif" }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:"#6EE7B7", display:"inline-block", boxShadow:"0 0 7px #6EE7B7" }}/>
              Welcome back to Eventra
            </div>
          </div>

          {/* Heading */}
          <div className="l-a2" style={{ textAlign:"center", marginBottom:16 }}>
            <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:"1.65rem", letterSpacing:"-0.04em", lineHeight:1.15 }}>
              <span className="g-text">Sign in to your</span>{" "}
              <span style={{ color:"#E2E8F0" }}>account</span>
            </h1>
            <p style={{ color:"#4A5568", fontSize:13, marginTop:6, fontFamily:"'DM Sans',sans-serif" }}>
              Your campus events are waiting.
            </p>
          </div>

          {/* Fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:11 }}>

            {/* Register Number */}
            <div className="l-a3">
              <label className="l-label">Register Number</label>
              <div className="l-input-wrap">
                <span className="l-icon" style={{ opacity: emailFocused ? 0.9 : 0.38 }}>
                  <Icon name="mail" size={15} color={emailFocused ? "#818CF8" : "#64748B"} />
                </span>
                <input 
  type="text"
  className="l-input"
  placeholder="Enter Register No"
  value={registerNo}
  onChange={(e) => setRegisterNo(e.target.value.toUpperCase())}
  onFocus={() => setEmailFocused(true)}
  onBlur={()  => setEmailFocused(false)}
/>
              </div>
            </div>

            {/* Password */}
            <div className="l-a4">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <label className="l-label" style={{ marginBottom:0 }}>Password</label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
              <div className="l-input-wrap">
                <span className="l-icon" style={{ opacity: passFocused ? 0.9 : 0.38 }}>
                  <Icon name="lock" size={15} color={passFocused ? "#818CF8" : "#64748B"} />
                </span>
                <input 
  type={showPassword ? "text" : "password"} 
  className="l-input" 
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onFocus={() => setPassFocused(true)}
  onBlur={() => setPassFocused(false)}
/>
                <button className="pwd-toggle" onClick={() => setShowPassword(v => !v)}>
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={14} color="currentColor" />
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="l-a5" style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input type="checkbox" className="remember-check" id="remember" />
              <label htmlFor="remember" style={{ color:"#4A5568", fontSize:12.5, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                Remember me for 30 days
              </label>
            </div>

            {/* Sign In */}
            <div className="l-a6">
              <button className="btn-login" onClick={handleLogin}>
                Sign In
                <Icon name="arrowRight" size={15} color="white" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ margin:"16px 0" }}>
            <div className="l-divider">or continue with</div>
          </div>

          {/* Google */}
          <button className="btn-google">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="l-foot" style={{ textAlign:"center", marginTop:14, color:"#475569", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
            Don't have an account?{" "}
            <span
              style={{ background:"linear-gradient(135deg,#6366F1,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}
              onClick={() => navigate("/register")}
            >
              Sign Up →
            </span>
          </p>

          {/* Bottom shimmer */}
          <div style={{ position:"absolute", bottom:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.4),transparent)" }}/>
        </div>
      </div>
    </>
  );
}

export default Login;