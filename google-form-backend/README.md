# 📝 Google Forms Clone - FastAPI Backend

A lightweight, scalable backend API for a simplified version of Google Forms — built with **FastAPI**, **MongoDB**, and **Motor** (async driver). This project enables admins to create forms with reusable fields and collect responses via unique form links.

---

## 🚀 Features

- 🔗 Create forms with **unique URLs**
- 🧱 Reusable field components (`text`, `number`, `single_choice`, etc.)
- 📥 Submit and manage **form responses**
- 📊 Admin-friendly response summaries
- ⚡️ Asynchronous API with FastAPI & Motor
- 📦 Modular folder structure with clean separation of concerns
- 🌐 CORS-ready for frontend (React support)

---

## 🛠 Tech Stack

| Layer      | Tech           |
|------------|----------------|
| Backend    | [FastAPI](https://fastapi.tiangolo.com/) |
| Database   | [MongoDB](https://www.mongodb.com/) + [Motor](https://motor.readthedocs.io/) |
| Validation | [Pydantic](https://docs.pydantic.dev/) |
| Async ORM  | Native Mongo + Motor |
| Environment | `dotenv` for env management |
| Dev Server | `uvicorn` |

---

## 📁 Folder Structure

google-forms-backend/
├── app/
│ ├── database/ # MongoDB connection logic
│ ├── models/ # DB logic (bson-based)
│ ├── schemas/ # API request/response models (Pydantic)
│ ├── routes/ # All API endpoints
│ ├── init.py
│ └── main.py # FastAPI app entrypoint
├── .env # Environment variables (Mongo URL, frontend URL)
├── .gitignore
├── requirements.txt
└── README.md

yaml
Copy
Edit

---

## 🧪 Local Development

### 🔧 Prerequisites

- Python 3.9+
- MongoDB running locally or in the cloud (e.g., MongoDB Atlas)
- [Poetry](https://python-poetry.org/) or `pip` for installing dependencies

### 📦 Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
🧬 Start MongoDB
Make sure MongoDB is running locally on mongodb://localhost:27017
or update your .env with a custom Mongo URI.

▶️ Run the Server
bash
Copy
Edit
uvicorn app.main:app --reload
Dev server will start on http://localhost:8000

API docs available at: http://localhost:8000/docs

📦 Environment Variables
Create a .env file:

env
Copy
Edit
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=googleforms

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Security (optional for future use)
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
You can also copy the example:

bash
Copy
Edit
cp .env.example .env
🧹 API Overview
Forms
POST /api/v1/forms/ → Create a new form with field references

GET /api/v1/forms/ → Get all forms

GET /api/v1/forms/{form_id} → Get form by ID

GET /api/v1/forms/link/{unique_link} → Get form by shareable link

Fields
POST /api/v1/fields/ → Create reusable field

GET /api/v1/fields/ → List all fields

Responses
POST /api/v1/responses/ → Submit a response

GET /api/v1/responses/form/{form_id} → List responses for a form

GET /api/v1/responses/form/{form_id}/summary → Get response summary

✅ Status
✅ Backend is fully functional and modular
⚙️ Frontend integration (React) supported via CORS
🧪 Ready for deployment or extension (auth, dashboard, etc.)

📄 License
MIT © 2025 Vishal