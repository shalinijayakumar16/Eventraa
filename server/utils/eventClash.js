const DEFAULT_EVENT_DURATION_MS = 60 * 60 * 1000;

const toValidDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getEventTimeRange = (event) => {
  const start =
    toValidDate(event?.startTime) ||
    toValidDate(event?.date) ||
    toValidDate(event?.startDate);

  if (!start) return null;

  const parsedEnd =
    toValidDate(event?.endTime) ||
    toValidDate(event?.endDate);

  const end = parsedEnd && parsedEnd > start
    ? parsedEnd
    : new Date(start.getTime() + DEFAULT_EVENT_DURATION_MS);

  return { start, end };
};

function isTimeClash(existingEvents, newEvent) {
  const incomingRange = getEventTimeRange(newEvent);
  if (!incomingRange) return false;

  return (existingEvents || []).some((existingEvent) => {
    const existingRange = getEventTimeRange(existingEvent);
    if (!existingRange) return false;

    return (
      incomingRange.start < existingRange.end &&
      incomingRange.end > existingRange.start
    );
  });
}

const getConflictingEvents = (existingEvents, newEvent) => {
  return (existingEvents || []).filter((existingEvent) =>
    isTimeClash([existingEvent], newEvent)
  );
};

module.exports = {
  isTimeClash,
  getEventTimeRange,
  getConflictingEvents,
};
