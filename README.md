📋 Reczee Form Builder
A lightweight Google Forms-like web application built as part of the Reczee Fullstack Internship Evaluation. It enables admins to create reusable fields, generate forms, and view user responses via unique form links.

🚀 Tech Stack
Layer	Tech
Frontend	React + Vite + TypeScript + TailwindCSS
Backend	FastAPI + SQLAlchemy + SQLite
API Test	Postman

🧠 Features
🔧 Admin (Form Creator)
Create reusable form fields (text, number, single choice)

Build forms by selecting field combinations

View all submitted responses per form

🧑‍💻 User (Form Filler)
Access form via unique link

Fill and submit responses dynamically

📂 Folder Structure
css
Copy code
reczee-form-backend/
├── app/
│   ├── main.py
│   ├── crud.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── routers/
├── forms.db
├── requirements.txt

reczee-form-frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/api.ts
│   └── App.tsx
├── public/
├── index.html
├── tailwind.config.js
▶️ How to Run
Backend
bash
Copy code
cd reczee-form-backend
python -m venv venv
.\venv\Scripts\activate      # for Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
Visit: http://localhost:8000/docs

Frontend
bash
Copy code
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
POST	/responses/	Submit form response
GET	/responses/{form_id}	List responses for form

🧪 Postman
✅ All endpoints tested in Postman

 Includes request samples for fields, forms, and responses

💡 Notes
Pydantic v2 used with from_attributes = True

SQLite is used for simplicity (no external DB setup required)

Fully modular backend with FastAPI routers

✅ Author
Vishal (Vish)
Fullstack Developer | Internship Candidate @ Reczee
“Write clean. Think modular. Build smart.”