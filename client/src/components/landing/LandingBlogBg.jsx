// Landing page has a slightly different BlobBg (absolute positioned, 3 blobs + grid)
// If you want to reuse the same BlobBg from components/BlobBg.jsx that's fine too,
// but the landing version uses absolute (not fixed) positioning for in-section use.

const LandingBlobBg = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div className="animate-blob blob-layer-indigo" style={{
      position: "absolute", top: "-15%", left: "-10%",
      width: "65vw", height: "65vw", maxWidth: 700, maxHeight: 700,
      filter: "blur(60px)", animationDelay: "0s",
    }}/>
    <div className="animate-blob blob-layer-pink" style={{
      position: "absolute", top: "20%", right: "-15%",
      width: "55vw", height: "55vw", maxWidth: 600, maxHeight: 600,
      filter: "blur(70px)", animationDelay: "-3s",
    }}/>
    <div className="animate-blob blob-layer-indigo" style={{
      position: "absolute", bottom: "-10%", left: "30%",
      width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500,
      filter: "blur(80px)", animationDelay: "-6s",
    }}/>
    <div style={{
      position: "absolute", inset: 0,
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 80%)",
    }} className="blob-layer-grid"/>
  </div>
);

export default LandingBlobBg;