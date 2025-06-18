// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import pages
import Dashboard from "./pages/Dashboard.jsx";
import CreateForm from "./pages/CreateForm";
import EditForm from "./pages/EditForm";
import ViewForm from "./pages/ViewForm.jsx";
import FormResponses from "./pages/FormResponses.jsx";
import PublicForm from "./pages/PublicForm";
import NotFound from "./pages/NotFound.jsx";

// Import layout
import Layout from "./components/layout/Layout.jsx";

// Import styles
import "./styles/globals.css";

// Scroll to Top on Route Change
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public form route (no layout) */}
          <Route path="/form/:uniqueLink" element={<PublicForm />} />

          {/* Admin routes (with layout) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="forms/create" element={<CreateForm />} />
            <Route path="forms/:id/edit" element={<EditForm />} />
            <Route path="forms/:id" element={<ViewForm />} />
            <Route path="forms/:id/responses" element={<FormResponses />} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
