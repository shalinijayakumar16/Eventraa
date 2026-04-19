/**
 * Seed External Events into Database
 * ──────────────────────────────────────────────────────
 * This script adds sample external events to the database for testing
 * Run with: node scripts/seedExternalEvents.js
 * 
 * Sample data includes realistic hackathons, workshops, symposiums
 * from various colleges and institutions
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from server's .env file
dotenv.config({ path: path.join(__dirname, "../server/.env") });

// Import ExternalEvent model
const ExternalEvent = require("../server/models/ExternalEvent");

/**
 * Sample external events data
 * Includes hackathons, workshops, symposiums, and conferences
 */
const sampleEvents = [
  {
    title: "TechFest 2026: AI & Machine Learning Hackathon",
    college_name: "Indian Institute of Technology Bombay (IITB)",
    date: new Date("2026-05-15"),
    description:
      "Join the largest AI hackathon in India! Compete with 500+ participants, win prizes worth ₹50,000, and network with industry experts from Google, Microsoft, and Amazon.",
    registration_link: "https://techfest.org/hackathon",
    source: "TechFest",
  },
  {
    title: "Web Development Workshop: React & Node.js",
    college_name: "Delhi University - St. Stephen's College",
    date: new Date("2026-04-25"),
    description:
      "Learn full-stack web development from industry mentors. Build a real-world project in 2 days. Limited to 50 participants. Certificate of completion provided.",
    registration_link: "https://webdevworkshop.tech",
    source: "LinkedIn Learning",
  },
  {
    title: "National Symposium on Cybersecurity",
    college_name: "Bangalore Institute of Technology",
    date: new Date("2026-06-10"),
    description:
      "Explore the latest cybersecurity trends, ethical hacking, and network security. Featuring speakers from ISRO, TCS, and Infosys. Free entry for students.",
    registration_link: "https://cybersecurity-symposium.edu",
    source: "IEEE Student Chapter",
  },
  {
    title: "StartUp India Bootcamp",
    college_name: "IIM Ahmedabad",
    date: new Date("2026-05-01"),
    description:
      "6-week intensive bootcamp for aspiring entrepreneurs. Learn business model validation, pitching, and fundraising from successful startup founders.",
    registration_link: "https://startupindia-bootcamp.org",
    source: "StartUp India",
  },
  {
    title: "Cloud Computing Workshop: AWS & Azure",
    college_name: "VIT University - Chennai Campus",
    date: new Date("2026-04-30"),
    description:
      "Master cloud platforms with hands-on labs. Learn containerization with Docker, Kubernetes, and serverless architecture. AWS/Azure certification eligible.",
    registration_link: "https://cloudcomputing-workshop.cloud",
    source: "AWS Student Ambassador",
  },
  {
    title: "National Hackathon: Smart City Solutions",
    college_name: "Manipal University",
    date: new Date("2026-05-20"),
    description:
      "Build innovative solutions for smart cities. 30-hour hackathon with mentorship, prizes up to ₹2,00,000, and opportunity to pitch to venture capitalists.",
    registration_link: "https://smartcity-hackathon.gov.in",
    source: "Smart India Hackathon",
  },
  {
    title: "Data Science Masterclass",
    college_name: "BITS Pilani - Hyderabad",
    date: new Date("2026-05-05"),
    description:
      "Learn advanced data science techniques including deep learning, NLP, and computer vision. Includes capstone project and job placement assistance.",
    registration_link: "https://datasciencemasterclass.edu",
    source: "Great Learning",
  },
  {
    title: "Mobile App Development Summit",
    college_name: "Mumbai University - Kalina Campus",
    date: new Date("2026-06-15"),
    description:
      "Build iOS and Android apps from scratch. Learn Flutter, React Native, and native development. Network with app developers and tech leads from Flipkart and Swiggy.",
    registration_link: "https://mobileappsummit.tech",
    source: "Google Developers",
  },
  {
    title: "Blockchain & Cryptocurrency Workshop",
    college_name: "Anna University - Chennai",
    date: new Date("2026-05-10"),
    description:
      "Understand blockchain technology, build smart contracts on Ethereum, and explore DeFi applications. Includes live trading demo and industry insights.",
    registration_link: "https://blockchain-workshop.crypto",
    source: "Crypto Community",
  },
  {
    title: "National Innovation Challenge 2026",
    college_name: "Shiv Nadar University",
    date: new Date("2026-06-20"),
    description:
      "Present your innovative ideas and solutions to pressing social problems. Win funding, mentorship, and accelerator support. Open to all students.",
    registration_link: "https://innovation-challenge.org",
    source: "Ministry of Innovation",
  },
];

/**
 * Connect to MongoDB and seed data
 */
async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/eventra");
    console.log("✅ MongoDB connected");

    // Clear existing external events (optional - comment out to preserve)
    console.log("\n🧹 Clearing existing external events...");
    await ExternalEvent.deleteMany({});
    console.log("✅ Cleared existing events");

    // Insert sample events
    console.log("\n📝 Inserting sample events...");
    const insertedEvents = await ExternalEvent.insertMany(sampleEvents);
    console.log(`✅ Successfully inserted ${insertedEvents.length} events`);

    // Display inserted events
    console.log("\n📋 Inserted Events:");
    insertedEvents.forEach((event, index) => {
      console.log(`\n${index + 1}. ${event.title}`);
      console.log(`   College: ${event.college_name}`);
      console.log(`   Date: ${event.date.toLocaleDateString("en-IN")}`);
      console.log(`   Source: ${event.source}`);
      console.log(`   Link: ${event.registration_link}`);
    });

    console.log("\n✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding script
seedDatabase();
