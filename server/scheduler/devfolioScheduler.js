/**
 * Devfolio Scheduler
 * ------------------
 * Runs the Devfolio scraper once per day using node-cron.
 */

const cron = require("node-cron");
const { scrapeDevfolio } = require("../scraper/devfolioScraper");

let hasStarted = false;

const startDevfolioScheduler = () => {
  if (hasStarted) return;
  hasStarted = true;

  // Cron expression "0 0 * * *" means:
  // minute=0, hour=0, every day, every month, every day-of-week.
  // In simple terms: run every day at 12:00 AM.
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("[DevfolioScheduler] Running daily Devfolio scrape job...");
      try {
        await scrapeDevfolio();
      } catch (error) {
        console.error("[DevfolioScheduler] Daily job failed:", error.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log("[DevfolioScheduler] Enabled (runs daily at 00:00 Asia/Kolkata).");
};

module.exports = { startDevfolioScheduler };
