/**
 * Devpost Puppeteer Scraper (FINAL STABLE)
 * ---------------------------------------
 * ✔ Uses Puppeteer (no DOM issues)
 * ✔ Extracts real hackathon links
 * ✔ Filters India + Online events
 * ✔ Saves to MongoDB
 */

const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");

const connectDB = require("../config/db");
const ExternalEvent = require("../models/ExternalEvent");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DEVPOST_URL = "https://devpost.com/hackathons";

// safe date
const toDateOrNow = (text) => {
  const d = new Date(text);
  return isNaN(d.getTime()) ? new Date() : d;
};

const scrapeDevpost = async () => {
  let browser;

  console.log("🚀 Scraping Devpost...");

  try {
    await connectDB();

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(DEVPOST_URL, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // wait for content
    await new Promise((r) => setTimeout(r, 5000));

    // scroll to load more
    await page.evaluate(async () => {
      for (let i = 0; i < 5; i++) {
        window.scrollBy(0, window.innerHeight);
        await new Promise((r) => setTimeout(r, 1500));
      }
    });

    await new Promise((r) => setTimeout(r, 3000));

    // 🔥 EXTRACT EVENTS
    const rawEvents = await page.evaluate(() => {
      const cards = document.querySelectorAll("a");

      return Array.from(cards)
        .map((el) => {
          const title = el.innerText.trim();
          const link = el.href;

          return { title, link };
        })
        .filter(
          (e) =>
            e.link.includes("devpost.com") &&
            e.title.length > 15 &&
            !e.link.includes("/software/") &&
            !e.link.includes("/blog/")
        );
    });

    console.log("🔗 Raw events found:", rawEvents.length);

    const uniqueMap = new Map();

    rawEvents.forEach((e) => {
      if (!uniqueMap.has(e.link)) {
        uniqueMap.set(e.link, e);
      }
    });

    const uniqueEvents = Array.from(uniqueMap.values());

    console.log("✅ Unique events:", uniqueEvents.length);

    const events = [];

    // 🔥 VISIT EACH EVENT PAGE
    for (const event of uniqueEvents.slice(0, 10)) {
      try {
        const eventPage = await browser.newPage();

        await eventPage.goto(event.link, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });

        const data = await eventPage.evaluate(() => {
          const clean = (t) => (t || "").replace(/\s+/g, " ").trim();

          const description =
            clean(
              document.querySelector("meta[name='description']")
                ?.content
            ) || "Devpost Hackathon";

          const bodyText = document.body.innerText.toLowerCase();

          return {
            description,
            bodyText,
          };
        });

        // 🔥 FILTER INDIA / ONLINE
        if (
          data.bodyText.includes("india") ||
          data.bodyText.includes("online")
        ) {
          events.push({
            title: event.title,
            description: data.description,
            date: new Date(),
            registration_link: event.link,
            college_name: "Various (Devpost)",
            source: "Devpost",
          });
        }

        await eventPage.close();
      } catch (err) {
        console.log("⚠️ Failed:", event.link);
      }
    }

    console.log("📦 Filtered events:", events.length);

    if (events.length === 0) {
      console.log("⚠️ No matching events found");
      return;
    }

    // 🔥 REMOVE DUPLICATES
    const existing = await ExternalEvent.find({
      registration_link: { $in: events.map((e) => e.registration_link) },
    });

    const existingSet = new Set(existing.map((e) => e.registration_link));

    const newEvents = events.filter(
      (e) => !existingSet.has(e.registration_link)
    );

    if (newEvents.length === 0) {
      console.log("⚠️ No new events to insert");
      return;
    }

    await ExternalEvent.insertMany(newEvents);

    console.log("🎉 Saved events:", newEvents.length);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    if (browser) await browser.close();
    await mongoose.disconnect();
    process.exit(0);
  }
};

scrapeDevpost();