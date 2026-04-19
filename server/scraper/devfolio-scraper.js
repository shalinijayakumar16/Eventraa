const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const ExternalEvent = require("../models/ExternalEvent");

(async () => {
  try {
    // ✅ CONNECT TO DB (inside async)
    await mongoose.connect("mongodb+srv://eventraUser:eventraAdmin@eventradb.zvbhvaa.mongodb.net/eventradb");
    console.log("MongoDB connected ✅");

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null
    });

    const page = await browser.newPage();

    console.log("Opening Devfolio...");
    await page.goto("https://devfolio.co/hackathons", {
      waitUntil: "networkidle2"
    });

    // Scroll to load all events
    await autoScroll(page);

    console.log("Extracting event list...");

    // Extract event links
    let events = await page.evaluate(() => {
      const data = [];

      document.querySelectorAll("a").forEach(el => {
        const link = el.href;
        const title = el.innerText.trim();

        if (link.includes(".devfolio.co") && title.length > 5) {
          data.push({ title, link });
        }
      });

      return data;
    });

    // Remove duplicates
    const uniqueEvents = Array.from(
      new Map(events.map(e => [e.link, e])).values()
    );

    console.log("Total clean events:", uniqueEvents.length);

    const detailedEvents = [];

    // 🔥 Loop through events
    for (let event of uniqueEvents.slice(0, 5)) {
      try {
        console.log("Opening:", event.title);

        await page.goto(event.link, {
          waitUntil: "networkidle2"
        });

        const details = await page.evaluate(() => {
          const bodyText = document.body.innerText;

          // Description
          let description = "N/A";
          const paragraphs = Array.from(document.querySelectorAll("p"));

          for (let p of paragraphs) {
            const text = p.innerText.trim();
            if (text.length > 50 && !text.toLowerCase().includes("home")) {
              description = text;
              break;
            }
          }

          // Date
          const dateMatch = bodyText.match(
            /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*?\d{4}/
          );

          // Tags
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

        const finalEvent = {
          title: event.title,
          link: event.link,
          ...details,
          platform: "devfolio"
        };

        detailedEvents.push(finalEvent);

        // ✅ SAVE TO DB
        await ExternalEvent.updateOne(
          { link: finalEvent.link },
          finalEvent,
          { upsert: true }
        );

      } catch (err) {
        console.log("❌ Error scraping:", event.link);
      }
    }

    console.log("\n🔥 Final Data:\n");
    console.log(JSON.stringify(detailedEvents, null, 2));

    console.log("✅ Saved to DB");

    await browser.close();
    await mongoose.disconnect();

  } catch (error) {
    console.error("❌ Error:", error);
  }
})();


// 🔁 Auto scroll function
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