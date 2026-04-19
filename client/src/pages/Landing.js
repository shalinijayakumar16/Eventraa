import { useNavigate } from "react-router-dom";

// Styles
import { LANDING_STYLES } from "../constants/landingStyles";

// Landing-specific components
import Navbar           from "../components/landing/Navbar";
import HeroSection      from "../components/landing/HeroSection";
import TickerSection    from "../components/landing/TickerSection";
import FeaturesSection  from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import StatsSection     from "../components/landing/StatsSection";
import CTASection       from "../components/landing/CTASection";
import Footer           from "../components/landing/Footer";

function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <style>{LANDING_STYLES}</style>
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", transition: "background-color 0.25s ease, color 0.25s ease" }}>
        <Navbar           navigate={navigate} />
        <HeroSection      navigate={navigate} />
        <TickerSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection       navigate={navigate} />
        <Footer />
      </div>
    </>
  );
}

export default Landing;