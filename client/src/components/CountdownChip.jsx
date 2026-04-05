import { useEffect, useState } from "react";
import Icon from "./icon";
import { getCountdown, getApplyCountdown } from "../utils/countdown";

function CountdownChip({ event }) {
  const [cd, setCd]         = useState(() => getCountdown(event.date));
  const [applycd, setApplyCd] = useState(() => getApplyCountdown(event.applyBy));

  useEffect(() => {
    const interval = setInterval(() => {
      setCd(getCountdown(event.date));
      setApplyCd(getApplyCountdown(event.applyBy));
    }, 60000);
    return () => clearInterval(interval);
  }, [event.date, event.applyBy]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {cd && (
        <span className={`countdown-chip ${cd.urgency}`}>
          <Icon name="clock" size={10} color="currentColor" />
          {cd.text}
        </span>
      )}
      {applycd && (
        <span className={`countdown-chip ${applycd.urgency}`}>
          <Icon name="zap" size={10} color="currentColor" />
          {applycd.text}
        </span>
      )}
    </div>
  );
}

export default CountdownChip;
