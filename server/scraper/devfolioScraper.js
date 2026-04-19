/**
 * Devfolio Scraper
 * ----------------
 * Fetches hackathon listings from Devfolio and stores them as external events.
 *
 * Why axios:
 * - axios provides a simple Promise-based API for HTTP requests in Node.js.
 *
 * How cheerio works:
 * - cheerio loads HTML and provides a jQuery-like API to query elements.
 * - We use it to extract anchor tags and read href/text values.
 */

const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const connectDB = require("../config/db");
const ExternalEvent = require("../models/ExternalEvent");

// Load env from server/.env regardless of current working directory.
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DEVFOLIO_HACKATHONS_URL = "https://devfolio.co/hackathons";
const DEVFOLIO_BASE_URL = "https://devfolio.co";
const GENERIC_HACKATHON_PATHS = new Set([
  "/hackathons",
  "/hackathons/",
  "/hackathons/open",
  "/hackathons/past",
  "/hackathons/all",
  "/hackathons/upcoming",
]);

/**
 * Convert relative links to absolute links so we can store consistent URLs.
 */
const toAbsoluteUrl = (href = "") => {
  if (!href) return "";
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("/")) return `${DEVFOLIO_BASE_URL}${href}`;
  return "";
};

/**
 * Build a fallback title from URL slug if anchor text is missing.
 */
const fallbackTitleFromLink = (url = "") => {
  try {
    const pathname = new URL(url).pathname;
    const slug = pathname.split("/").filter(Boolean).pop() || "devfolio-hackathon";
    return slug
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  } catch (_error) {
    return "Devfolio Hackathon";
  }
};

/**
 * Scrape Devfolio hackathons and insert only new events.
 *
 * Duplicate prevention:
 * - registration_link is used as the unique check key.
 * - Existing links are skipped before insertion.
 */
const scrapeDevfolio = async ({ ensureDbConnection = false } = {}) => {
  console.log("[DevfolioScraper] Starting Devfolio hackathon scraping...");

  try {
    if (ensureDbConnection) {
      // Connect explicitly when running this file directly (manual CLI run).
      await connectDB();
    }

    const response = await axios.get(DEVFOLIO_HACKATHONS_URL, {
      timeout: 20000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Filtering logic:
    // - Use a specific selector so we only inspect anchors that already include "/hackathons/".
    // - Apply strict checks to avoid generic listing links and tracking/query URLs.
    // - Build absolute URLs for consistent storage in MongoDB.
    const linkTitleMap = new Map();

    $("a[href*='/hackathons/']").each((_, element) => {
      const link = ($(element).attr("href") || "").trim();

      // Keep only event-specific paths:
      // - starts with "/hackathons/"
      // - not equal to the generic listing path
      // - no query params
      // - has enough path segments to represent a specific event page
      // - excludes known non-event category pages (open/past/all/upcoming)
      if (
        !link ||
        !link.startsWith("/hackathons/") ||
        link === "/hackathons" ||
        link.includes("?") ||
        link.split("/").length <= 2 ||
        GENERIC_HACKATHON_PATHS.has(link.toLowerCase())
      ) {
        return;
      }

      const fullLink = `${DEVFOLIO_BASE_URL}${link}`;
      const normalizedUrl = toAbsoluteUrl(fullLink);

      // Extract clean title from anchor text.
      const title = $(element).text().trim();
      const text = title.replace(/\s+/g, " ");

      // Skip unusable titles to keep stored data clean.
      if (!text || text.length < 4) {
        return;
      }

      const currentTitle = linkTitleMap.get(normalizedUrl) || "";

      // Prefer the longer non-empty title if the same link appears multiple times.
      if (text && text.length > currentTitle.length) {
        linkTitleMap.set(normalizedUrl, text);
      } else if (!linkTitleMap.has(normalizedUrl)) {
        linkTitleMap.set(normalizedUrl, "");
      }
    });

    const allLinks = [...linkTitleMap.keys()];

    // Debug logs: print extracted links and valid count before DB operations.
    console.log("[DevfolioScraper] Extracted event links:", allLinks);
    console.log(`[DevfolioScraper] Valid event links found: ${allLinks.length}`);

    if (allLinks.length === 0) {
      console.log("[DevfolioScraper] No valid hackathon links found.");
      return { found: 0, saved: 0 };
    }

    // Load existing links once and use a Set for fast duplicate checks.
    const existing = await ExternalEvent.find(
      { registration_link: { $in: allLinks } },
      { registration_link: 1, _id: 0 }
    ).lean();

    const existingLinks = new Set(existing.map((item) => item.registration_link));

    const newEvents = allLinks
      .filter((registration_link) => !existingLinks.has(registration_link))
      .map((registration_link) => ({
        title: linkTitleMap.get(registration_link) || fallbackTitleFromLink(registration_link),
        registration_link,
        college_name: "Various Colleges",
        description: "Explore this hackathon on Devfolio.",
        date: new Date(),
        source: "Devfolio",
      }));

    if (newEvents.length === 0) {
      console.log("[DevfolioScraper] No new events to save (duplicates skipped).");
      return { found: allLinks.length, saved: 0 };
    }

    // Database insertion:
    // - insertMany writes all new records in one operation for efficiency.
    await ExternalEvent.insertMany(newEvents);

    console.log(`[DevfolioScraper] Saved ${newEvents.length} new external events.`);
    return { found: allLinks.length, saved: newEvents.length };
  } catch (error) {
    console.error("[DevfolioScraper] Scraping failed:", error.message);
    throw error;
  }
};

/**
 * Manual run support:
 * - Allows execution with: node scraper/devfolioScraper.js
 * - Connects to DB explicitly and exits process after completion.
 */
if (require.main === module) {
  (async () => {
    try {
      await scrapeDevfolio({ ensureDbConnection: true });
      await mongoose.disconnect();
      process.exit(0);
    } catch (_error) {
      await mongoose.disconnect().catch(() => {});
      process.exit(1);
    }
  })();
}

module.exports = { scrapeDevfolio };
