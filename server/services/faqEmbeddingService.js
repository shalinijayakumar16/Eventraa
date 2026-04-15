const faqDataset = require("../data/faqDataset");

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const FALLBACK_REPLY = "Sorry, I didn’t understand. Please contact support.";
const DEFAULT_THRESHOLD = 0.7;

const embeddingCache = {
  extractorPromise: null,
  faqEmbeddings: null,
};

const cosineSimilarity = (vectorA, vectorB) => {
  if (!vectorA?.length || !vectorB?.length || vectorA.length !== vectorB.length) return 0;

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

const getExtractor = async () => {
  if (!embeddingCache.extractorPromise) {
    embeddingCache.extractorPromise = import("@xenova/transformers").then(({ pipeline }) => {
      return pipeline("feature-extraction", MODEL_ID);
    });
  }

  return embeddingCache.extractorPromise;
};

const getEmbedding = async (text) => {
  const extractor = await getExtractor();
  const output = await extractor(String(text || ""), {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data || []);
};

const ensureFaqEmbeddings = async () => {
  if (embeddingCache.faqEmbeddings) {
    return embeddingCache.faqEmbeddings;
  }

  const rows = [];
  for (const item of faqDataset) {
    const embedding = await getEmbedding(item.question);
    rows.push({ ...item, embedding });
  }

  embeddingCache.faqEmbeddings = rows;
  return rows;
};

const getSemanticFaqReply = async (message, threshold = DEFAULT_THRESHOLD) => {
  const query = String(message || "").trim();
  if (!query) {
    return { reply: FALLBACK_REPLY, similarity: 0 };
  }

  try {
    const [faqRows, queryEmbedding] = await Promise.all([
      ensureFaqEmbeddings(),
      getEmbedding(query),
    ]);

    let best = { similarity: -1, answer: FALLBACK_REPLY };

    faqRows.forEach((row) => {
      const similarity = cosineSimilarity(queryEmbedding, row.embedding);
      if (similarity > best.similarity) {
        best = { similarity, answer: row.answer };
      }
    });

    if (best.similarity >= threshold) {
      return {
        reply: best.answer,
        similarity: Number(best.similarity.toFixed(4)),
      };
    }

    return {
      reply: FALLBACK_REPLY,
      similarity: Number(Math.max(best.similarity, 0).toFixed(4)),
    };
  } catch (error) {
    return {
      reply: FALLBACK_REPLY,
      similarity: 0,
      error: error.message,
    };
  }
};

module.exports = {
  getSemanticFaqReply,
  FALLBACK_REPLY,
};
