// Landing page has a slightly different BlobBg (absolute positioned, 3 blobs + grid)
// If you want to reuse the same BlobBg from components/BlobBg.jsx that's fine too,
// but the landing version uses absolute (not fixed) positioning for in-section use.

const LandingBlobBg = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div className="animate-blob" style={{
      position: "absolute", top: "-15%", left: "-10%",
      width: "65vw", height: "65vw", maxWidth: 700, maxHeight: 700,
      background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
      filter: "blur(60px)", animationDelay: "0s",
    }}/>
    <div className="animate-blob" style={{
      position: "absolute", top: "20%", right: "-15%",
      width: "55vw", height: "55vw", maxWidth: 600, maxHeight: 600,
      background: "radial-gradient(circle at 60% 60%, rgba(236,72,153,0.14) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
      filter: "blur(70px)", animationDelay: "-3s",
    }}/>
    <div className="animate-blob" style={{
      position: "absolute", bottom: "-10%", left: "30%",
      width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500,
      background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 65%)",
      filter: "blur(80px)", animationDelay: "-6s",
    }}/>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 80%)",
    }}/>
  </div>
);

export default LandingBlobBg;