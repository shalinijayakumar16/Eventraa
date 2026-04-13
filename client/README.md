# 🎉 Eventra – AI-Powered Event Management System

## 📌 Project Description
Eventra is an AI-powered full stack event management platform designed to streamline the entire event lifecycle in educational institutions.

It enables departments to create and manage events, students to register and participate, and automates key processes like QR-based attendance and certificate generation. The system also integrates AI features such as a chatbot and event recommendation system to enhance user experience.

---

## 🚀 Features

### 🎯 Core Features
- Event Creation & Management (Department Dashboard)
- Student Registration for Events
- QR Code-Based Attendance System
- Automated Certificate Generation & Download
- Event Status Tracking (Registered → Attended → Certificate Generated)
- Expired Event Handling (Past Events)

### 🤖 AI Features
- AI Chatbot (Student Dashboard assistance)
- Event Recommendation System based on user activity/interests

### 🔐 Authentication
- Role-based login:
  - Admin
  - Department
  - Student

### 📊 Additional Features
- Clean UI with responsive design
- Real-time updates
- Error handling & validations
- Dashboard for all user roles

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- HTML, CSS, JavaScript

### Backend:
- Node.js
- Express.js

### Database:
- MongoDB

### AI Integration:
- Chatbot & Recommendation Logic

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eventra.git
cd eventra
2. Install Dependencies
Backend:
cd backend
npm install
Frontend:
cd frontend
npm install
3. Configure Environment Variables

Create a .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
4. Run the Project
Start Backend:
cd backend
npm start
Start Frontend:
cd frontend
npm start
📸 Project Workflow
Department creates event
Student registers for event
QR-based attendance is marked
Attendance confirmed
Certificate generated & downloaded
Event moves to past events
📦 Future Enhancements
Advanced AI recommendations
Email notifications
Event analytics dashboard

👨‍💻 Contributors
Your Shalini Jayakumar
📌 Note

This project is developed as part of an AI Full Stack academic submission