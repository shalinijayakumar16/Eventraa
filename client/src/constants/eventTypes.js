export const EVENT_TYPE_OPTIONS = [
  "Hackathon",
  "Workshop",
  "Seminar",
  "Webinar",
  "Conference",
  "Symposium",
  "Quiz",
  "Coding Contest",
  "Technical Talk",
  "Guest Lecture",
  "Bootcamp",
  "Training Program",
  "Competition",
  "Project Expo",
  "Poster Presentation",
  "Paper Presentation",
  "Cultural Event",
  "Sports Event",
  "Networking Event",
  "Career Fair",
  "Placement Drive",
  "Internship Drive",
  "Startup Event",
  "Innovation Challenge",
  "Panel Discussion",
  "Alumni Meet",
  "Orientation",
  "Awareness Program",
  "Other",
];

export const resolveEventTypeValue = (event = {}) => {
  const value = String(event.eventType || event.type || "").trim();
  return value;
};

export const isPredefinedEventType = (value = "") => {
  return EVENT_TYPE_OPTIONS.includes(value) && value !== "Other";
};
