const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const SUPPORTED_INTENTS = new Set([
  "list_events_today",
  "list_all_events",
  "events_filtered",
  "check_registration",
  "registration_summary",
  "show_attendance",
  "show_attendance_today",
  "recommend_events",
  "general_eventra_query",
  "greeting",
  "gratitude",
  "goodbye",
  "help",
]);

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const extractJsonObject = (text) => {
  if (!text) return null;

  const trimmed = String(text).trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "");

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      return null;
    }

    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch (parseError) {
      return null;
    }
  }
};

const fallbackIntentDetection = (message) => {
  const text = normalizeText(message);

  if (/^hi$|^hello$|^hey$|\bhello\b|\bhi\b/.test(text)) return { intent: "greeting" };
  if (/thank\s*you|thanks|thx/.test(text)) return { intent: "gratitude" };
  if (/bye|goodbye|see\s+you|talk\s+later/.test(text)) return { intent: "goodbye" };
  if (/help|what\s+can\s+you\s+do|how\s+to\s+use/.test(text)) return { intent: "help" };
  if (/attendance|attended|present|absent|participat/.test(text) && /today|this\s+day/.test(text)) {
    return { intent: "show_attendance_today" };
  }
  if (/event|events/.test(text) && /(department|dept|\bit\b|\bcs\b|\bcse\b|ece|mech|civil|technical|non-technical|non technical|workshop|today|tomorrow|week|upcoming)/.test(text)) {
    return { intent: "events_filtered" };
  }
  if (/today|this\s+day/.test(text)) return { intent: "list_events_today" };
  if (/all\s+events|available\s+events|show\s+events|list\s+events/.test(text)) return { intent: "list_all_events" };
  if (/count|total|how\s+many|number\s+of/.test(text) && /register|registration|enrolled|sign\s*up|event/.test(text)) {
    return { intent: "registration_summary" };
  }
  if (/^the\s+count$|^count$/.test(text)) return { intent: "registration_summary" };
  if (/register|registered|registration|enrolled|sign\s*up/.test(text)) return { intent: "check_registration" };
  if (/attendance|attended|present|absent|participat/.test(text)) return { intent: "show_attendance" };
  if (/recommend|suggest|for\s+me|interested|best\s+events/.test(text)) return { intent: "recommend_events" };

  if (/eventra|event|department|interest|dashboard|profile/.test(text)) {
    return { intent: "general_eventra_query" };
  }

  return { intent: "unknown" };
};

const detectIntentWithOpenAI = async (message) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackIntentDetection(message);
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Extract intent and entities from user queries related to Eventra event management system. Only return JSON. Supported intents: list_events_today, list_all_events, events_filtered, check_registration, registration_summary, show_attendance, show_attendance_today, recommend_events, general_eventra_query, greeting, gratitude, goodbye, help. Use registration_summary for count/total registration questions. Use events_filtered for department/type/date filtered event queries like "events for IT" or "CS events this week". Strict schema: {"intent":"<intent>","eventName":"<optional>","department":"<optional>","category":"<optional>","eventType":"<optional>","dateRange":"<optional: today|tomorrow|week|upcoming>","keywords":["<optional>"]}.',
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content || "";
  const parsed = extractJsonObject(content) || fallbackIntentDetection(message);

  const intent = SUPPORTED_INTENTS.has(parsed.intent) ? parsed.intent : "unknown";

  return {
    intent,
    eventName: parsed.eventName || "",
    department: parsed.department || "",
    category: parsed.category || parsed.eventType || "",
    eventType: parsed.eventType || parsed.category || "",
    dateRange: parsed.dateRange || parsed.queryDate || "",
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
  };
};

const generateEventraReplyWithOpenAI = async ({ message, context }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are Eventra Assistant. Answer only using the provided context. If context is missing, say what is unavailable and suggest next useful Eventra questions. Keep tone friendly, concise, and end with one helpful follow-up question.",
        },
        {
          role: "user",
          content: `Question: ${message}\n\nContext:\n${context}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  return String(content || "").trim() || null;
};

module.exports = {
  detectIntentWithOpenAI,
  generateEventraReplyWithOpenAI,
  fallbackIntentDetection,
  extractJsonObject,
  SUPPORTED_INTENTS,
};