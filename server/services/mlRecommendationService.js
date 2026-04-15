const natural = require("natural");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");

const modelCache = {
  signature: "",
  tfidf: null,
  vocabulary: [],
  approvedEvents: [],
  eventVectorById: new Map(),
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const featureTextForEvent = (event) => {
  return [
    event?.eventType || event?.type,
    event?.department,
    event?.title,
    event?.description,
  ]
    .map((value) => normalize(value))
    .filter(Boolean)
    .join(" ");
};

const tokenize = (text) => {
  return normalize(text).match(/[a-z0-9]+/g) || [];
};

const cosineSimilarity = (vectorA, vectorB) => {
  if (!vectorA.length || !vectorB.length || vectorA.length !== vectorB.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let index = 0; index < vectorA.length; index += 1) {
    const a = vectorA[index] || 0;
    const b = vectorB[index] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const buildSignature = (events) => {
  return events
    .map((event) => `${event._id}:${new Date(event.updatedAt || event.createdAt || 0).getTime()}`)
    .join("|");
};

const buildUserVector = (text, vocabulary, tfidfModel) => {
  const tokens = tokenize(text);
  if (!tokens.length || !vocabulary.length) return new Array(vocabulary.length).fill(0);

  const tokenFrequency = new Map();
  tokens.forEach((token) => {
    tokenFrequency.set(token, (tokenFrequency.get(token) || 0) + 1);
  });

  const total = tokens.length;

  return vocabulary.map((term) => {
    const count = tokenFrequency.get(term) || 0;
    if (!count) return 0;

    const tf = count / total;
    const idf = tfidfModel.idf(term);
    return tf * idf;
  });
};

const buildOrReuseModel = async () => {
  const approvedEvents = await Event.find({ status: "approved" })
    .select("title description department eventType type date createdAt updatedAt")
    .lean();

  if (!approvedEvents.length) {
    modelCache.signature = "";
    modelCache.tfidf = null;
    modelCache.vocabulary = [];
    modelCache.approvedEvents = [];
    modelCache.eventVectorById = new Map();
    return modelCache;
  }

  const signature = buildSignature(approvedEvents);
  if (modelCache.signature === signature && modelCache.tfidf) {
    modelCache.approvedEvents = approvedEvents;
    return modelCache;
  }

  const tfidf = new natural.TfIdf();
  approvedEvents.forEach((event) => {
    tfidf.addDocument(featureTextForEvent(event));
  });

  const vocabularySet = new Set();
  for (let index = 0; index < approvedEvents.length; index += 1) {
    tfidf.listTerms(index).forEach((termInfo) => {
      vocabularySet.add(termInfo.term);
    });
  }

  const vocabulary = Array.from(vocabularySet);
  const eventVectorById = new Map();

  approvedEvents.forEach((event, index) => {
    const vector = vocabulary.map((term) => tfidf.tfidf(term, index));
    eventVectorById.set(String(event._id), vector);
  });

  modelCache.signature = signature;
  modelCache.tfidf = tfidf;
  modelCache.vocabulary = vocabulary;
  modelCache.approvedEvents = approvedEvents;
  modelCache.eventVectorById = eventVectorById;

  return modelCache;
};

const toRecommendation = (event) => ({
  eventId: String(event._id),
  title: event.title,
  eventType: event.eventType || event.type || "",
  department: event.department || "",
  date: event.date,
});

const getUpcomingFallback = async (registeredEventIds, limit) => {
  const now = new Date();

  const events = await Event.find({
    status: "approved",
    date: { $gte: now },
    _id: { $nin: registeredEventIds },
  })
    .sort({ date: 1, createdAt: -1 })
    .limit(limit)
    .select("title department eventType type date")
    .lean();

  return events.map(toRecommendation);
};

const getUserEventSets = async (userId) => {
  const [registrations, attendedRegistrations, attendanceRecords] = await Promise.all([
    Registration.find({ userId }).select("eventId").lean(),
    Registration.find({ userId, attended: true }).select("eventId").lean(),
    Attendance.find({ userId, status: "present" }).select("eventId").lean(),
  ]);

  const registeredEventIds = new Set(registrations.map((item) => String(item.eventId)));
  const historyEventIds = new Set([
    ...registrations.map((item) => String(item.eventId)),
    ...attendedRegistrations.map((item) => String(item.eventId)),
    ...attendanceRecords.map((item) => String(item.eventId)),
  ]);

  return { registeredEventIds, historyEventIds };
};

const recommendEventsWithTfIdf = async ({ userId, limit = 5 }) => {
  const { registeredEventIds, historyEventIds } = await getUserEventSets(userId);

  if (!historyEventIds.size) {
    return getUpcomingFallback([...registeredEventIds], limit);
  }

  const cache = await buildOrReuseModel();

  if (!cache.tfidf || !cache.vocabulary.length || !cache.approvedEvents.length) {
    return [];
  }

  const historyEvents = await Event.find({
    _id: { $in: Array.from(historyEventIds) },
  })
    .select("title description department eventType type")
    .lean();

  const profileText = historyEvents
    .map((event) => featureTextForEvent(event))
    .filter(Boolean)
    .join(" ");

  if (!profileText.trim()) {
    return getUpcomingFallback([...registeredEventIds], limit);
  }

  const userVector = buildUserVector(profileText, cache.vocabulary, cache.tfidf);
  const now = new Date();

  const scored = cache.approvedEvents
    .filter((event) => {
      const id = String(event._id);
      if (registeredEventIds.has(id)) return false;

      const eventDate = new Date(event.date);
      if (Number.isNaN(eventDate.getTime())) return false;
      return eventDate >= now;
    })
    .map((event) => {
      const id = String(event._id);
      const vector = cache.eventVectorById.get(id) || [];
      const score = cosineSimilarity(userVector, vector);
      return { event, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.event.date) - new Date(b.event.date);
    })
    .slice(0, limit)
    .map((item) => toRecommendation(item.event));

  if (!scored.length) {
    return getUpcomingFallback([...registeredEventIds], limit);
  }

  return scored;
};

module.exports = {
  recommendEventsWithTfIdf,
};
