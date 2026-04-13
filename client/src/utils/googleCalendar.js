const toDate = (value) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const formatGoogleDate = (value) => {
  const date = toDate(value);
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
};

export function generateGoogleCalendarLink(event) {
  const title = String(event?.title || "Campus Event").trim();
  const description = String(event?.description || "").trim();
  const location = String(event?.location || event?.venue || "").trim();

  const startDate = toDate(event?.startTime || event?.date);
  const defaultEnd = new Date(startDate.getTime() + 60 * 60 * 1000);
  const endDate = toDate(event?.endTime || event?.endDate || defaultEnd);

  const reminderNote = "Reminder: Please join 10 minutes before the event";
  const detailsWithReminder = [description, reminderNote].filter(Boolean).join("\n\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: detailsWithReminder,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function openGoogleCalendar(event) {
  const url = generateGoogleCalendarLink(event);
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
