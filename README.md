# 🚀 Resume Analyzer (Full Stack Project)

An AI-powered full-stack web application that analyzes resumes, extracts skills, provides improvement suggestions, and matches resumes with job descriptions using an ATS (Applicant Tracking System) approach.

---

## 📌 Features

* 📂 Upload single or multiple resumes (PDF)
* 🧠 AI-based resume analysis
* 📊 Resume scoring system
* 🛠️ Skill extraction from resumes
* 💡 Smart improvement suggestions
* 🔍 Search resumes by name or skill
* 📋 Job Description Matching (ATS Score)
* 🏆 Best Matching Resume Highlight
* 📈 Dashboard with charts (Bar & Pie)
* 🎯 Resume match percentage visualization
* 📥 Download analysis report
* 🗂️ Resume history stored in MySQL database
* 🟢 Highlight last uploaded resume
* 🔵 Highlight best matching resume

---

## 🛠️ Tech Stack

### 💻 Frontend

* React.js
* Tailwind CSS
* Axios
* Chart.js
* React Dropzone

### ⚙️ Backend

* Spring Boot
* Java
* REST APIs

### 🗄️ Database

* MySQL

---

## 📁 Project Structure

resume-analyzer/
│
├── frontend/        # React frontend
│   ├── src/
│   ├── package.json
│
├── backend/         # Spring Boot backend
│   ├── src/main/java/
│   ├── application.properties
│
└── README.md

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup (Spring Boot)

1. Open backend in IntelliJ IDEA
2. Configure MySQL in `application.properties`:

spring.datasource.url=jdbc:mysql://localhost:3306/resume_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8081

3. Create database in MySQL:

CREATE DATABASE resume_db;

4. Run the Spring Boot application

---

### 🔹 Frontend Setup (React)

cd frontend
npm install
npm start

Frontend will run on:
http://localhost:3000

---

## 🔗 API Endpoints

POST  /api/analyze   → Analyze resumes
GET   /api/resumes   → Fetch all resumes

---

## 📊 How It Works

1. User uploads resume(s)
2. Backend processes:

   * Extracts skills
   * Calculates score
   * Generates suggestions
3. Data is stored in MySQL
4. Dashboard displays:

   * Resume list
   * Charts (Bar & Pie)
   * ATS match score
   * Best candidate highlight

---

## 🧠 ATS Matching Logic

* Compares job description text with resume skills
* Calculates percentage match
* Highlights the best matching resume
* Filters resumes based on search input

---

## 🚀 Future Improvements

* User Authentication (Login/Register)
* Upload DOCX support
* Advanced NLP-based skill extraction
* Resume ranking system
* Cloud deployment (AWS / Render / Vercel)

---

## 👩‍💻 Author

Dibyasmita Mohapatra

---

## ⭐ Important Notes

* `node_modules`, `target`, `.idea` are excluded using `.gitignore`
* Run `npm install` before starting frontend
* Backend must be running on port 8081

---

## 📌 Conclusion

This project demonstrates:

* Full-stack development (React + Spring Boot)
* REST API integration
* Database connectivity (MySQL)
* Real-world ATS (Applicant Tracking System) logic
* Interactive dashboard with analytics

---

⭐ If you like this project, consider giving it a star on GitHub!
