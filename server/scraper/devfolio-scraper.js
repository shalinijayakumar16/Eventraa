const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const cron = require("node-cron");
const ExternalEvent = require("../models/ExternalEvent");

// 🔥 MAIN SCRAPER FUNCTION
async function scrapeDevfolio() {
  try {
    console.log("\n🚀 Starting Devfolio Scraper...");

    await mongoose.connect("mongodb+srv://eventraUser:eventraAdmin@eventradb.zvbhvaa.mongodb.net/eventradb");
    console.log("MongoDB connected ✅");

    const browser = await puppeteer.launch({
      headless: true, // 🔥 make true for cron
      defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto("https://devfolio.co/hackathons", {
      waitUntil: "networkidle2"
    });

    await autoScroll(page);

    let events = await page.evaluate(() => {
      const data = [];

document.querySelectorAll("a").forEach(el => {
  const link = el.href;
  const title = el.querySelector("h3, h2")?.innerText?.trim();

  if (
    link.includes(".devfolio.co") &&
    title &&
    title.length > 5
  ) {
    data.push({ title, link });
  }
});

      return data;
    });

    const uniqueEvents = Array.from(
      new Map(events.map(e => [e.link, e])).values()
    );

    console.log("Total events found:", uniqueEvents.length);

    // 🔥 LIMIT (latest 20 only)
    const selectedEvents = uniqueEvents.slice(0, 20);

    for (let event of selectedEvents) {
      try {
        console.log("Opening:", event.title);

        await page.goto(event.link, {
          waitUntil: "networkidle2"
        });

        const details = await page.evaluate(() => {
          const bodyText = document.body.innerText;

          let description = "N/A";
          const paragraphs = Array.from(document.querySelectorAll("p"));

          for (let p of paragraphs) {
            const text = p.innerText.trim();
            if (text.length > 50 && !text.toLowerCase().includes("home")) {
              description = text;
              break;
            }
          }

          const dateMatch = bodyText.match(
            /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*?\d{4}/
          );

          const tags = Array.from(document.querySelectorAll("span"))
            .map(el => el.innerText.trim())
            .filter(text =>
              text.length > 2 &&
              text.length < 20 &&
              !text.match(/\d/) &&
              !text.toLowerCase().includes("contact") &&
              !text.toLowerCase().includes("tap") &&
              !text.toLowerCase().includes("home") &&
              !text.toLowerCase().includes("people")
            )
            .slice(0, 5);

          return {
            description,
            date: dateMatch ? dateMatch[0] : "N/A",
            tags
          };
        });

        // 🔥 FILTER: ONLY upcoming events
        const isUpcoming = details.date !== "N/A";

        if (!isUpcoming) continue;

        const finalEvent = {
          title: event.title,
          link: event.link,
          ...details,
          platform: "devfolio",
          createdAt: new Date()
        };

        await ExternalEvent.updateOne(
          { link: finalEvent.link },
          finalEvent,
          { upsert: true }
        );

      } catch (err) {
        console.log("❌ Error scraping:", event.link);
      }
    }

    console.log("✅ Scraping complete & saved to DB");

    await browser.close();
    await mongoose.disconnect();

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// 🔁 AUTO SCROLL
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  });
}

// 🚀 RUN ONCE (manual)
scrapeDevfolio();

// ⏰ CRON JOB (every 6 hours)
cron.schedule("0 */6 * * *", () => {
  console.log("⏰ Running scheduled scraper...");
  scrapeDevfolio();
});