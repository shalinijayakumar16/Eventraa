const BlobBg = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div className="animate-blob" style={{
      position: "absolute", top: "-10%", left: "-5%",
      width: "55vw", height: "55vw", maxWidth: 600, maxHeight: 600,
      background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.13) 0%, rgba(139,92,246,0.07) 40%, transparent 70%)",
      filter: "blur(60px)",
    }}/>
    <div className="animate-blob" style={{
      position: "absolute", top: "30%", right: "-10%",
      width: "45vw", height: "45vw", maxWidth: 500,
      background: "radial-gradient(circle at 60% 60%, rgba(236,72,153,0.1) 0%, transparent 70%)",
      filter: "blur(70px)", animationDelay: "-4s",
    }}/>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)",
    }}/>
  </div>
);

export default BlobBg;
