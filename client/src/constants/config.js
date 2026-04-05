export const TYPE_STYLE = {
  Workshop:  { bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.3)",  color: "#A5B4FC" },
  Seminar:   { bg: "rgba(236,72,153,0.15)",  border: "rgba(236,72,153,0.3)",  color: "#F9A8D4" },
  Technical: { bg: "rgba(6,182,212,0.15)",   border: "rgba(6,182,212,0.3)",   color: "#67E8F9" },
  Cultural:  { bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.3)",  color: "#FCD34D" },
  Sports:    { bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.3)",   color: "#86EFAC" },
  Hackathon: { bg: "rgba(168,85,247,0.15)",  border: "rgba(168,85,247,0.3)",  color: "#D8B4FE" },
  Fest:      { bg: "rgba(251,146,60,0.15)",  border: "rgba(251,146,60,0.3)",  color: "#FDBA74" },
  Webinar:   { bg: "rgba(20,184,166,0.15)",  border: "rgba(20,184,166,0.3)",  color: "#5EEAD4" },
  default:   { bg: "rgba(110,231,183,0.15)", border: "rgba(110,231,183,0.3)", color: "#6EE7B7" },
};

export const TABS = [
  { id: "all",        label: "All Events",  icon: "list"     },
  { id: "registered", label: "Registered",  icon: "check"    },
  { id: "upcoming",   label: "Upcoming",    icon: "trending" },
  { id: "completed",  label: "Completed",   icon: "star"     },
  { id: "wishlist",   label: "Wishlist",    icon: "tag"      },
];

export const ALL_DEPARTMENTS = ["CSE", "ECE", "EEE", "IT", "MECH", "CIVIL", "CHEM", "BIO", "MBA", "MCA"];

export const ALL_TYPES = ["Workshop", "Seminar", "Technical", "Cultural", "Sports", "Hackathon", "Fest", "Webinar", "Other"];