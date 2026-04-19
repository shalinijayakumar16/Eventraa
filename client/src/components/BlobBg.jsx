const BlobBg = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div className="animate-blob blob-layer-indigo" style={{
      position: "absolute", top: "-10%", left: "-5%",
      width: "55vw", height: "55vw", maxWidth: 600, maxHeight: 600,
      filter: "blur(60px)",
    }}/>
    <div className="animate-blob blob-layer-pink" style={{
      position: "absolute", top: "30%", right: "-10%",
      width: "45vw", height: "45vw", maxWidth: 500,
      filter: "blur(70px)", animationDelay: "-4s",
    }}/>
    <div style={{
      position: "absolute", inset: 0,
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)",
    }} className="blob-layer-grid"/>
  </div>
);

export default BlobBg;
