const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const { detectIntentWithOpenAI, generateEventraReplyWithOpenAI } = require("../services/openaiService");

const eventNameFromMessage = (message, extractedName) => {
  const normalized = String(extractedName || "").trim();
  if (normalized) return normalized;

  const quoted = String(message || "").match(/"([^"]+)"|'([^']+)'/);
  if (quoted) return quoted[1] || quoted[2] || "";

  return "";
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const formatDateTime = (value) => {
  if (!value) return "Date not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";

  const datePart = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timePart = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} at ${timePart}`;
};

const toEventLine = (event) => {
  const dateText = formatDateTime(event.date);
  const departmentText = event.department ? ` • ${event.department}` : "";
  return `• ${event.title}${departmentText} • ${dateText}`;
};

const pickMatchingEvent = (events, eventName) => {
  const target = normalize(eventName);
  if (!target) return null;

  const exactMatch = events.find((event) => normalize(event.title) === target);
  if (exactMatch) return exactMatch;

  const includesMatch = events.find((event) => normalize(event.title).includes(target) || target.includes(normalize(event.title)));
  if (includesMatch) return includesMatch;

  const titleTokens = target.split(/\s+/).filter(Boolean);
  if (!titleTokens.length) return null;

  return events
    .map((event) => {
      const title = normalize(event.title);
      const score = titleTokens.reduce((count, token) => count + (title.includes(token) ? 1 : 0), 0);
      return { event, score };
    })
    .sort((a, b) => b.score - a.score)[0]?.event || null;
};

const getUserInterests = (user) => {
  if (Array.isArray(user?.interests)) return user.interests.filter(Boolean);
  if (typeof user?.interests === "string" && user.interests.trim()) return [user.interests.trim()];
  if (Array.isArray(user?.interest)) return user.interest.filter(Boolean);
  if (typeof user?.interest === "string" && user.interest.trim()) return [user.interest.trim()];
  return [];
};

const tokenize = (value) =>
  normalize(value)
    .split(/[^a-z0-9]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const buildRecommendationScore = (event, profile) => {
  let score = 0;
  const interests = (profile?.interests || []).map(normalize);
  const eventDepartment = normalize(event.department);
  const eventCategory = normalize(event.type || event.category);
  const userDepartment = normalize(profile?.department);
  const eventTextTokens = new Set([
    ...tokenize(event.title),
    ...tokenize(event.description),
    ...tokenize(event.type || event.category),
    ...tokenize(event.department),
  ]);

  if (eventDepartment && userDepartment && eventDepartment === userDepartment) {
    score += 2;
  }

  if (eventCategory && interests.some((interest) => interest === eventCategory || eventCategory.includes(interest) || interest.includes(eventCategory))) {
    score += 3;
  }

  if (interests.some((interest) => tokenize(interest).some((token) => eventTextTokens.has(token)))) {
    score += 2;
  }

  const eventDate = new Date(event.date);
  if (!Number.isNaN(eventDate.getTime()) && eventDate >= new Date()) {
    score += 1;
  }

  return score;
};

const getTodayRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getDateRangeFromMode = (mode) => {
  const now = new Date();
  const normalizedMode = normalize(mode);

  if (normalizedMode === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: "today" };
  }

  if (normalizedMode === "tomorrow") {
    const start = new Date(now);
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: "tomorrow" };
  }

  if (normalizedMode === "week") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: "next 7 days" };
  }

  if (normalizedMode === "upcoming") {
    const start = new Date(now);
    const end = null;
    return { start, end, label: "upcoming" };
  }

  return null;
};

const inferDateMode = (message, detectedDateRange, fallbackIntent) => {
  const text = normalize(message);
  const explicit = normalize(detectedDateRange);
  if (explicit) return explicit;
  if (fallbackIntent === "list_events_today") return "today";
  if (/today|this\s+day/.test(text)) return "today";
  if (/tomorrow/.test(text)) return "tomorrow";
  if (/this\s+week|next\s+week|\bweek\b/.test(text)) return "week";
  if (/upcoming|soon/.test(text)) return "upcoming";
  return "";
};

const inferDepartment = (message, detectedDepartment, approvedEvents, user) => {
  const normalizedDetected = String(detectedDepartment || "").trim();
  if (normalizedDetected) return normalizedDetected;

  const text = normalize(message);
  if (/my\s+department/.test(text) && user?.department) return user.department;

  const departments = [...new Set(approvedEvents.map((event) => event.department).filter(Boolean))];
  const directMatch = departments.find((department) => {
    const dep = normalize(department);
    return dep && (text.includes(dep) || dep.includes(text));
  });
  if (directMatch) return directMatch;

  const aliasMap = {
    it: ["it", "information technology"],
    cs: ["cs", "cse", "computer science"],
    ece: ["ece", "electronics"],
    mech: ["mech", "mechanical"],
    civil: ["civil"],
  };

  const aliasHit = Object.entries(aliasMap).find(([, aliases]) => aliases.some((alias) => new RegExp(`\\b${alias}\\b`, "i").test(message)));
  if (!aliasHit) return "";

  const matchingDepartment = departments.find((department) => {
    const dep = normalize(department);
    return aliasHit[1].some((alias) => dep.includes(alias));
  });

  return matchingDepartment || aliasHit[0].toUpperCase();
};

const inferType = (message, detectedType, approvedEvents) => {
  const normalizedDetected = String(detectedType || "").trim();
  if (normalizedDetected) return normalizedDetected;

  const text = normalize(message);
  if (/non-technical|non technical/.test(text)) return "non-technical";
  if (/technical|tech/.test(text)) return "technical";
  if (/workshop/.test(text)) return "workshop";
  if (/seminar/.test(text)) return "seminar";
  if (/hackathon/.test(text)) return "hackathon";

  const knownTypes = [...new Set(approvedEvents.map((event) => event.type).filter(Boolean))];
  const directMatch = knownTypes.find((type) => {
    const normalizedType = normalize(type);
    return normalizedType && text.includes(normalizedType);
  });

  return directMatch || "";
};

const filterEvents = (events, { department, type, dateMode }) => {
  const departmentQuery = normalize(department);
  const typeQuery = normalize(type);
  const range = getDateRangeFromMode(dateMode);

  return events.filter((event) => {
    const eventDepartment = normalize(event.department);
    const eventType = normalize(event.type || event.category);

    if (departmentQuery) {
      const depMatch =
        (eventDepartment && (eventDepartment.includes(departmentQuery) || departmentQuery.includes(eventDepartment))) ||
        (departmentQuery === "cs" && eventDepartment.includes("computer")) ||
        (departmentQuery === "it" && eventDepartment.includes("information"));
      if (!depMatch) return false;
    }

    if (typeQuery) {
      const typeMatch =
        (eventType && (eventType.includes(typeQuery) || typeQuery.includes(eventType))) ||
        (typeQuery === "technical" && eventType === "tech") ||
        (typeQuery === "tech" && eventType === "technical");
      if (!typeMatch) return false;
    }

    if (range) {
      const eventDate = new Date(event.date);
      if (Number.isNaN(eventDate.getTime())) return false;
      if (range.end) {
        return eventDate >= range.start && eventDate <= range.end;
      }
      return eventDate >= range.start;
    }

    return true;
  });
};

const formatFiltersLabel = ({ department, type, dateMode }) => {
  const parts = [];
  if (department) parts.push(`department: ${department}`);
  if (type) parts.push(`type: ${type}`);
  const range = getDateRangeFromMode(dateMode);
  if (range?.label) parts.push(`time: ${range.label}`);
  return parts.length ? `Filtered events (${parts.join(" • ")}):` : "Available events:";
};

const withFriendlyEnding = (text) => {
  const base = String(text || "").trim();
  if (!base) return "How can I help with your Eventra events today?";

  if (/need anything else about eventra\?/i.test(base)) {
    return base;
  }

  return `${base}\n\nNeed anything else about Eventra?`;
};

const buildGeneralContext = async ({ userId, user, approvedEvents }) => {
  const registrations = await Registration.find({ userId }).populate("eventId", "title date department");
  const attendanceRecords = await Attendance.find({ userId }).populate("eventId", "title date");
  const now = new Date();

  const upcomingEvents = approvedEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      return !Number.isNaN(eventDate.getTime()) && eventDate >= now;
    })
    .slice(0, 6);

  const registeredTitles = registrations
    .map((item) => item.eventId?.title)
    .filter(Boolean)
    .slice(0, 8);

  const attendanceSummary = {
    present: attendanceRecords.filter((item) => item.status === "present").length,
    absent: attendanceRecords.filter((item) => item.status === "absent").length,
    registered: attendanceRecords.filter((item) => item.status === "registered").length,
  };

  return {
    contextText: [
      `User: ${user.name}`,
      `Department: ${user.department || "Not specified"}`,
      `Interests: ${getUserInterests(user).join(", ") || "Not specified"}`,
      `Approved event count: ${approvedEvents.length}`,
      `Upcoming events: ${upcomingEvents.map((event) => `${event.title} (${formatDateTime(event.date)})`).join(" | ") || "None"}`,
      `Registered event count: ${registrations.length}`,
      `Registered events: ${registeredTitles.join(" | ") || "None"}`,
      `Attendance: present=${attendanceSummary.present}, absent=${attendanceSummary.absent}, registered=${attendanceSummary.registered}`,
    ].join("\n"),
    registrations,
    attendanceSummary,
    upcomingEvents,
  };
};

const buildNonAiGeneralReply = ({
  message,
  user,
  approvedEvents,
  registrations,
  upcomingEvents,
  attendanceSummary,
  departmentQuery,
  typeQuery,
  dateMode,
}) => {
  const text = normalize(message);

  if (/event/.test(text) && (departmentQuery || typeQuery || dateMode)) {
    const filtered = filterEvents(approvedEvents, {
      department: departmentQuery,
      type: typeQuery,
      dateMode,
    });

    if (!filtered.length) {
      return "No events found for that filter. Try another department, type, or time range.";
    }

    return [
      formatFiltersLabel({ department: departmentQuery, type: typeQuery, dateMode }),
      ...filtered.slice(0, 8).map(toEventLine),
    ].join("\n");
  }

  if (/tomorrow/.test(text)) {
    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const tomorrowEvents = approvedEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= tomorrowStart && eventDate <= tomorrowEnd;
    });

    if (!tomorrowEvents.length) {
      return "No approved events are scheduled for tomorrow.";
    }

    return [`Tomorrow's events:`, ...tomorrowEvents.slice(0, 6).map(toEventLine)].join("\n");
  }

  if (/week|this\s+week/.test(text)) {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const weekEvents = approvedEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= start && eventDate <= end;
    });

    return weekEvents.length
      ? [`Events in the next 7 days (${weekEvents.length}):`, ...weekEvents.slice(0, 8).map(toEventLine)].join("\n")
      : "No approved events are scheduled in the next 7 days.";
  }

  if (/who am i|my profile|my department|my interest/.test(text)) {
    return [
      `You are ${user.name}.`,
      `Department: ${user.department || "Not specified"}`,
      `Interests: ${getUserInterests(user).join(", ") || "Not specified"}`,
    ].join("\n");
  }

  if (/attendance/.test(text)) {
    if (/today|this\s+day/.test(text)) {
      return attendanceSummary.present
        ? `Today's attendance marked present count: ${attendanceSummary.present}.`
        : "No attendance marked for today yet.";
    }

    return [
      `Attendance summary for ${user.name}:`,
      `• Present: ${attendanceSummary.present}`,
      `• Absent: ${attendanceSummary.absent}`,
      `• Registered: ${attendanceSummary.registered}`,
    ].join("\n");
  }

  return [
    `I can help with Eventra data for ${user.name}.`,
    `• Approved events: ${approvedEvents.length}`,
    `• Your registrations: ${registrations.length}`,
    `• Upcoming events: ${upcomingEvents.length}`,
    "Try asking: 'events tomorrow', 'my attendance', 'am I registered for AI Workshop?', or 'recommend events for me'.",
  ].join("\n");
};

const buildRegistrationSummary = async (userId, user, approvedEvents) => {
  const registrations = await Registration.find({ userId }).populate("eventId", "title date department");

  if (!registrations.length) {
    return {
      reply: "You are not registered for any events yet.",
      data: { totalRegistered: 0, upcoming: [] },
    };
  }

  const now = new Date();
  const upcoming = registrations
    .map((item) => item.eventId)
    .filter(Boolean)
    .filter((event) => {
      const eventDate = new Date(event.date);
      return !Number.isNaN(eventDate.getTime()) && eventDate >= now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    reply: [
      `${user.name}, you are registered for ${registrations.length} event${registrations.length > 1 ? "s" : ""} in total.`,
      upcoming.length ? `Upcoming: ${upcoming.slice(0, 3).map((event) => event.title).join(", ")}.` : "You have no upcoming registered events.",
      approvedEvents.length ? `There are ${approvedEvents.length} approved events available right now.` : "No approved events are available right now.",
    ].join("\n"),
    data: {
      totalRegistered: registrations.length,
      upcoming: upcoming.slice(0, 5),
    },
  };
};

exports.chatbot = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ reply: "userId and message are required." });
    }

    const userPromise = User.findById(userId).select("name department interests interest year registerNo");
    const eventsPromise = Event.find({ status: "approved" }).sort({ date: 1 });
    const [user, approvedEvents] = await Promise.all([userPromise, eventsPromise]);

    if (!user) {
      return res.status(404).json({ reply: "Sorry, I couldn’t find that user." });
    }

    const extracted = await detectIntentWithOpenAI(message);
    const intent = extracted.intent || "unknown";
    const eventName = eventNameFromMessage(message, extracted.eventName);
    const departmentQuery = inferDepartment(message, extracted.department, approvedEvents, user);
    const typeQuery = inferType(message, extracted.eventType || extracted.category, approvedEvents);
    const dateMode = inferDateMode(message, extracted.dateRange, intent);

    if (intent === "greeting") {
      return res.json({
        intent,
        reply: withFriendlyEnding(`Hi ${user.name}! I can help with events, registrations, attendance, and recommendations.`),
      });
    }

    if (intent === "gratitude") {
      return res.json({
        intent,
        reply: withFriendlyEnding(`You're welcome, ${user.name}. Happy to help.`),
      });
    }

    if (intent === "goodbye") {
      return res.json({
        intent,
        reply: "Anytime. See you soon on Eventra!",
      });
    }

    if (intent === "help") {
      return res.json({
        intent,
        reply: withFriendlyEnding(
          "I can answer about today's events, all events, your registrations, attendance status, and recommendations. Example: 'how many events did I register for?'"
        ),
      });
    }

    if (intent === "unknown") {
      const generalContext = await buildGeneralContext({ userId, user, approvedEvents });
      const aiReply = await generateEventraReplyWithOpenAI({
        message,
        context: generalContext.contextText,
      });

      return res.json({
        intent: "general_eventra_query",
        reply: withFriendlyEnding(
          aiReply ||
            buildNonAiGeneralReply({
              message,
              user,
              approvedEvents,
              registrations: generalContext.registrations,
              upcomingEvents: generalContext.upcomingEvents,
              attendanceSummary: generalContext.attendanceSummary,
              departmentQuery,
              typeQuery,
              dateMode,
            })
        ),
      });
    }

    if (intent === "list_events_today") {
      const { start, end } = getTodayRange();
      const todayEvents = approvedEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= start && eventDate <= end;
      });

      if (!todayEvents.length) {
        return res.json({ intent, reply: "No events found" });
      }

      return res.json({
        intent,
        reply: withFriendlyEnding([`Today’s events:`, ...todayEvents.slice(0, 8).map(toEventLine)].join("\n")),
        data: todayEvents,
      });
    }

    if (intent === "list_all_events") {
      const hasFilters = Boolean(departmentQuery || typeQuery || dateMode);
      const eventsToReturn = hasFilters
        ? filterEvents(approvedEvents, { department: departmentQuery, type: typeQuery, dateMode })
        : approvedEvents;

      if (!eventsToReturn.length) {
        return res.json({ intent, reply: "No events found" });
      }

      return res.json({
        intent,
        reply: withFriendlyEnding([
          hasFilters ? formatFiltersLabel({ department: departmentQuery, type: typeQuery, dateMode }) : `Available events (${approvedEvents.length}):`,
          ...eventsToReturn.slice(0, 8).map(toEventLine),
        ].join("\n")),
        data: eventsToReturn,
      });
    }

    if (intent === "events_filtered") {
      const filteredEvents = filterEvents(approvedEvents, {
        department: departmentQuery,
        type: typeQuery,
        dateMode,
      });

      if (!filteredEvents.length) {
        return res.json({
          intent,
          reply: withFriendlyEnding("No events found for that filter. Try another department, type, or time range."),
          data: [],
        });
      }

      return res.json({
        intent,
        reply: withFriendlyEnding([
          formatFiltersLabel({ department: departmentQuery, type: typeQuery, dateMode }),
          ...filteredEvents.slice(0, 8).map(toEventLine),
        ].join("\n")),
        data: filteredEvents,
      });
    }

    if (intent === "check_registration") {
      if (!eventName) {
        const summary = await buildRegistrationSummary(userId, user, approvedEvents);
        return res.json({
          intent: "registration_summary",
          reply: withFriendlyEnding(summary.reply),
          data: summary.data,
        });
      }

      const event = pickMatchingEvent(approvedEvents, eventName);

      if (!event) {
        return res.json({
          intent,
          reply: "Please tell me the full event name you want me to check.",
        });
      }

      const registration = await Registration.findOne({ userId, eventId: event._id });

      if (!registration) {
        return res.json({
          intent,
          reply: `You are not registered for ${event.title}.`,
        });
      }

      const scheduleText = formatDateTime(event.date);
      return res.json({
        intent,
        reply: withFriendlyEnding(`You are registered for ${event.title} ✅\nIt is scheduled for ${scheduleText}.`),
        data: {
          eventId: event._id,
          registered: true,
        },
      });
    }

    if (intent === "registration_summary") {
      const summary = await buildRegistrationSummary(userId, user, approvedEvents);
      return res.json({
        intent,
        reply: withFriendlyEnding(summary.reply),
        data: summary.data,
      });
    }

    if (intent === "general_eventra_query") {
      if (/event/.test(normalize(message)) && (departmentQuery || typeQuery || dateMode)) {
        const filteredEvents = filterEvents(approvedEvents, {
          department: departmentQuery,
          type: typeQuery,
          dateMode,
        });

        if (!filteredEvents.length) {
          return res.json({
            intent: "events_filtered",
            reply: withFriendlyEnding("No events found for that filter. Try another department, type, or time range."),
            data: [],
          });
        }

        return res.json({
          intent: "events_filtered",
          reply: withFriendlyEnding([
            formatFiltersLabel({ department: departmentQuery, type: typeQuery, dateMode }),
            ...filteredEvents.slice(0, 8).map(toEventLine),
          ].join("\n")),
          data: filteredEvents,
        });
      }

      const generalContext = await buildGeneralContext({ userId, user, approvedEvents });
      const aiReply = await generateEventraReplyWithOpenAI({
        message,
        context: generalContext.contextText,
      });

      return res.json({
        intent,
        reply: withFriendlyEnding(
          aiReply ||
            buildNonAiGeneralReply({
              message,
              user,
              approvedEvents,
              registrations: generalContext.registrations,
              upcomingEvents: generalContext.upcomingEvents,
              attendanceSummary: generalContext.attendanceSummary,
              departmentQuery,
              typeQuery,
              dateMode,
            })
        ),
      });
    }

    if (intent === "show_attendance") {
      if (/today|this\s+day/.test(normalize(message))) {
        const { start, end } = getTodayRange();

        const attendanceToday = await Attendance.find({ userId, status: "present" }).populate(
          "eventId",
          "title date department type"
        );

        const attendanceFromModel = attendanceToday
          .map((item) => item.eventId)
          .filter(Boolean)
          .filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= start && eventDate <= end;
          });

        const attendedRegistrations = await Registration.find({ userId, attended: true }).populate(
          "eventId",
          "title date department type"
        );

        const attendanceFromRegistration = attendedRegistrations
          .map((item) => item.eventId)
          .filter(Boolean)
          .filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= start && eventDate <= end;
          });

        const deduped = [...attendanceFromModel, ...attendanceFromRegistration].reduce((acc, event) => {
          const id = String(event._id);
          if (!acc.some((item) => String(item._id) === id)) {
            acc.push(event);
          }
          return acc;
        }, []);

        if (!deduped.length) {
          return res.json({
            intent: "show_attendance_today",
            reply: withFriendlyEnding("No attendance marked for today yet."),
            data: [],
          });
        }

        return res.json({
          intent: "show_attendance_today",
          reply: withFriendlyEnding(["You are marked present today for:", ...deduped.map(toEventLine)].join("\n")),
          data: deduped,
        });
      }

      const event = pickMatchingEvent(approvedEvents, eventName);

      if (event) {
        const attendanceRecord = await Attendance.findOne({ userId, eventId: event._id });
        const registration = attendanceRecord || (await Registration.findOne({ userId, eventId: event._id }));
        const status = attendanceRecord?.status || (registration?.attended ? "present" : registration ? "absent" : null);

        if (!status) {
          return res.json({
            intent,
            reply: `No attendance record found for ${event.title}.`,
          });
        }

        const label = status === "present" ? "Present" : status === "absent" ? "Absent" : "Registered";

        return res.json({
          intent,
          reply: withFriendlyEnding(`Your attendance for ${event.title}: ${label}.`),
          data: { eventId: event._id, status },
        });
      }

      const attendanceRecords = await Attendance.find({ userId }).populate("eventId", "title date department type");

      if (!attendanceRecords.length) {
        return res.json({ intent, reply: "No attendance records found." });
      }

      const attendedCount = attendanceRecords.filter((item) => item.status === "present").length;
      const absentCount = attendanceRecords.filter((item) => item.status === "absent").length;
      const registeredCount = attendanceRecords.filter((item) => item.status === "registered").length;

      return res.json({
        intent,
        reply: withFriendlyEnding([
          `Attendance summary for ${user.name}:`,
          `• Present: ${attendedCount}`,
          `• Absent: ${absentCount}`,
          `• Registered: ${registeredCount}`,
        ].join("\n")),
        data: {
          attendedCount,
          absentCount,
          registeredCount,
          records: attendanceRecords,
        },
      });
    }

    if (intent === "show_attendance_today") {
      const { start, end } = getTodayRange();

      const attendanceToday = await Attendance.find({ userId, status: "present" }).populate(
        "eventId",
        "title date department type"
      );

      const attendanceFromModel = attendanceToday
        .map((item) => item.eventId)
        .filter(Boolean)
        .filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= start && eventDate <= end;
        });

      const attendedRegistrations = await Registration.find({ userId, attended: true }).populate(
        "eventId",
        "title date department type"
      );

      const attendanceFromRegistration = attendedRegistrations
        .map((item) => item.eventId)
        .filter(Boolean)
        .filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= start && eventDate <= end;
        });

      const deduped = [...attendanceFromModel, ...attendanceFromRegistration].reduce((acc, event) => {
        const id = String(event._id);
        if (!acc.some((item) => String(item._id) === id)) {
          acc.push(event);
        }
        return acc;
      }, []);

      if (!deduped.length) {
        return res.json({
          intent,
          reply: withFriendlyEnding("No attendance marked for today yet."),
          data: [],
        });
      }

      return res.json({
        intent,
        reply: withFriendlyEnding(["You are marked present today for:", ...deduped.map(toEventLine)].join("\n")),
        data: deduped,
      });
    }

    if (intent === "recommend_events") {
      const registrations = await Registration.find({ userId }).select("eventId").populate("eventId", "type category title");
      const registeredIds = new Set(
        registrations.map((item) => String(item.eventId?._id || item.eventId)).filter(Boolean)
      );

      const derivedInterestsFromRegistrations = registrations
        .map((item) => item.eventId)
        .filter(Boolean)
        .flatMap((event) => [event.type, event.category, event.title])
        .filter(Boolean);

      const profile = {
        department: user.department,
        interests: [...getUserInterests(user), ...derivedInterestsFromRegistrations],
      };

      const unregisteredCandidates = approvedEvents.filter((event) => !registeredIds.has(String(event._id)));
      const candidateEvents = unregisteredCandidates.length ? unregisteredCandidates : approvedEvents;
      const filteredCandidates = filterEvents(candidateEvents, {
        department: departmentQuery,
        type: typeQuery,
        dateMode,
      });
      const finalCandidates = filteredCandidates.length ? filteredCandidates : candidateEvents;

      const scored = finalCandidates
        .map((event) => ({ ...event.toObject(), score: buildRecommendationScore(event, profile) }))
        .sort((a, b) => b.score - a.score || new Date(a.date) - new Date(b.date))
        .slice(0, 5);

      if (!scored.length) {
        return res.json({ intent, reply: "No events found" });
      }

      return res.json({
        intent,
        reply: withFriendlyEnding([
          "Recommended for you ⭐",
          ...scored.map((event) => `${toEventLine(event)}${event.score >= 5 ? " 🔥" : ""}`),
        ].join("\n")),
        data: scored,
      });
    }

    return res.json({
      intent: "unknown",
      reply: withFriendlyEnding("I couldn't map that exactly, but I can still help with events, registrations, attendance, and recommendations."),
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({
      reply: "Sorry, I couldn’t process that right now. Please try again.",
    });
  }
};