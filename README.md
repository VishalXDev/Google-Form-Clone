# 📝 Google Forms Clone

A simplified Google Forms-like application built with **FastAPI**, **MongoDB**, and **React**. This project allows users to create customizable forms, collect responses, and view submission summaries.

---

## ⚙️ Tech Stack

### Backend
- **FastAPI** – Modern, high-performance Python web framework
- **MongoDB** – NoSQL document database
- **Motor** – Async MongoDB driver for Python
- **Pydantic** – Data validation and settings management
- **Uvicorn** – ASGI server for FastAPI

### Frontend
- **React** – Modern UI library
- **React Router** – Client-side routing
- **Axios** – HTTP client
- **TailwindCSS** – Utility-first CSS framework
- **Lucide Icons** – Icon pack

---

## 📁 Project Structure

root/
├── app/ # FastAPI backend
│ ├── routes/ # API routes (fields, forms, responses)
│ ├── schemas/ # Pydantic schemas
│ ├── database/ # MongoDB connection
│ └── main.py # FastAPI app entry
├── google-forms-frontend/ # React frontend app
├── requirements.txt # Backend dependencies
└── README.md # You are here!

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/google-forms-clone.git
cd google-forms-clone
🔧 Backend Setup (FastAPI)
Step 1: Create virtual environment
bash
Copy
Edit
cd google-form-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
Step 2: Install dependencies
bash
Copy
Edit
pip install -r requirements.txt
Step 3: Environment Variables
Create a .env file in google-form-backend/ with the following:

env
Copy
Edit
MONGODB_URL=mongodb://localhost:27017
FRONTEND_URL=http://localhost:3000
Step 4: Run backend server
bash
Copy
Edit
uvicorn app.main:app --reload
API runs at: http://localhost:8000

💻 Frontend Setup (React)
Step 1: Navigate to frontend folder
bash
Copy
Edit
cd google-forms-frontend
Step 2: Install dependencies
bash
Copy
Edit
npm install
Step 3: Environment Variables
Create a .env file inside google-forms-frontend/:

env
Copy
Edit
REACT_APP_API_URL=http://localhost:8000/api/v1
Step 4: Run frontend
bash
Copy
Edit
npm start
App runs at: http://localhost:3000

✨ Features
✅ Create custom forms with multiple fields

✅ Support for text, number, and single-choice fields

✅ Submit form responses

✅ View all submitted responses

✅ Share form via unique link

✅ Dashboard with stats and management tools

📬 API Reference
Once backend is running, visit:

bash
Copy
Edit
http://localhost:8000/docs
This opens the interactive Swagger UI with all endpoints.

🧪 Example
Create fields → POST /api/v1/fields

Create form → POST /api/v1/forms with embedded field references

Submit response → POST /api/v1/responses

View summary → GET /api/v1/responses/form/:id/summary

🧠 Future Improvements
User authentication

Multi-step forms

Export responses (CSV/Excel)

Field validation

Public/private form toggling

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first.

📄 License
MIT

💡 Author
Built with ❤️ by @VishalXDev