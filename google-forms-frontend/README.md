# 🧩 Google Forms Frontend

This is the **React.js** frontend for the Google Forms Clone project — a simplified, dynamic form-building and response-collection platform.

Built with:
- 🔥 React (Create React App)
- 🎨 Tailwind CSS
- 🧠 Reusable components & hooks
- 🔗 Axios for API requests

---

## ✨ Features

- Create and manage forms with multiple field types
- Fill out public forms via unique shareable links
- View all forms, stats, and responses in a dashboard
- Mobile-friendly and responsive design
- Toast notifications with `react-hot-toast`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Backend server running (FastAPI + MongoDB)

### Installation
```bash
git clone https://github.com/yourname/google-forms-frontend.git
cd google-forms-frontend
npm install
```

### Start the development server
```bash
npm start
```

The app will be available at `http://localhost:3000`

---

## 🔗 Environment Variables
Create a `.env` file in the root:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

---

## 📁 Folder Structure
```
src/
├── components/        # UI elements (buttons, inputs, layout)
├── hooks/             # Custom React hooks (form, API, localStorage)
├── pages/             # Pages: Dashboard, CreateForm, PublicForm, etc.
├── service/           # Axios API layer
├── styles/            # Tailwind globals
├── utils/             # Helpers like clipboard or formatters
└── App.js             # Route definitions
```

---

## 🧪 Example Routes
- `/` – Dashboard (admin)
- `/forms/create` – Create a new form
- `/forms/:id/edit` – Edit existing form
- `/forms/:id` – View form structure
- `/forms/:id/responses` – Response summary
- `/form/:uniqueLink` – Public form fill page

---

## 🔧 Customize
You can extend this by:
- Adding more field types (multi-select, checkboxes)
- Adding auth/login for admin
- Exporting results as CSV
- Better data visualizations (e.g., charts)

---

## 📃 License
MIT © Vishal (or your name)

---

## 🌟 Acknowledgments
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
