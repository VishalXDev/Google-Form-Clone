# 📋 Reczee Form Builder

A lightweight Google Forms–like web application built as part of the **Reczee Fullstack Internship Evaluation**. This tool allows admins to create reusable fields, design custom forms, and collect user responses via unique shareable links.

---

## 🚀 Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React + Vite + TypeScript + TailwindCSS |
| Backend   | FastAPI + SQLAlchemy + SQLite        |
| API Tests | Postman                              |

---

## 🧠 Features

### 🔧 Admin (Form Creator)
- Create reusable fields (text, number, single choice)
- Build forms using selected field combinations
- View submitted responses for each form

### 🧑‍💻 User (Form Filler)
- Access forms via unique link
- Dynamically fill and submit responses

---

## 📂 Folder Structure

reczee-form-backend/
├── app/
│ ├── main.py
│ ├── crud.py
│ ├── models.py
│ ├── schemas.py
│ ├── database.py
│ └── routers/
├── forms.db
├── requirements.txt

reczee-form-frontend/
├── src/
│ ├── pages/
│ ├── components/
│ ├── services/
│ │ └── api.ts
│ └── App.tsx
├── public/
├── index.html
├── tailwind.config.js

yaml
Copy
Edit

---

## ▶️ Getting Started

### ✅ Backend (FastAPI)
```bash
cd reczee-form-backend
python -m venv venv
.\venv\Scripts\activate  # For Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
Visit: http://localhost:8000/docs for Swagger API docs.

✅ Frontend (React + Vite)
bash
Copy
Edit
cd reczee-form-frontend
npm install
npm run dev
Visit: http://localhost:5173

📮 API Endpoints
Method	Endpoint	Purpose
POST	/fields/	Create a new field
GET	/fields/	List all fields
POST	/forms/	Create a form
GET	/forms/{link}	Get form by unique link
GET	/forms/id/{id}	Get form by numeric ID
POST	/responses/	Submit a form response
GET	/responses/{formId}	List responses for a form

🧪 Postman
✅ All API endpoints tested via Postman.

Includes requests for:

Field creation

Form creation

Response submission

Optional: Use provided environment file Reczee Local.postman_environment.json

💡 Notes
Uses Pydantic v2 with from_attributes=True for response serialization.

SQLite used for simplicity and zero setup.

Clean modular structure with FastAPI routers.

👨‍💻 Author
Vishal Dwivedy
Fullstack Developer | Internship Candidate @ Reczee

“Write clean. Think modular. Build smart.”