export function getCountdown(targetDate) {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return null;

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0)  return { text: `Starts in ${days}d ${hours}h`, urgency: days <= 1 ? "urgent" : days <= 3 ? "soon" : "normal" };
  if (hours > 0) return { text: `Starts in ${hours}h ${minutes}m`, urgency: "urgent" };
  return { text: `Starts in ${minutes}m`, urgency: "urgent" };
}

export function getApplyCountdown(applyBy) {
  if (!applyBy) return null;
  const diff = new Date(applyBy) - new Date();
  if (diff <= 0) return null;

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0)  return { text: `Reg closes in ${days}d`, urgency: days <= 1 ? "urgent" : "apply" };
  if (hours > 0) return { text: `Reg closes in ${hours}h`, urgency: "urgent" };
  return { text: "Closing soon!", urgency: "urgent" };
}