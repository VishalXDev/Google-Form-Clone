import { Routes, Route, Link, useLocation } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import FormFill from "./pages/FormFill";
import ViewResponses from "./pages/ViewResponses";
import { useState, useEffect } from "react";
import getForms from "./services/api";

export default function App() {
  const location = useLocation();
  const [latestForm, setLatestForm] = useState<any>(null);

  useEffect(() => {
    const fetchLatestForm = async () => {
      try {
        const res = await getForms({});
        if (res.data.length > 0) {
          setLatestForm(res.data[res.data.length - 1]);
        }
      } catch (err) {
        console.error("Failed to fetch forms", err);
      }
    };
    fetchLatestForm();
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">FormCraft</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/") 
                    ? "bg-blue-100 text-blue-700" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
              
              {latestForm && (
                <Link 
                  to={`/form/${latestForm.unique_link}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/form") 
                      ? "bg-green-100 text-green-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Preview
                </Link>
              )}
              
              {latestForm && (
                <Link 
                  to={`/responses/${latestForm.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/responses") 
                      ? "bg-purple-100 text-purple-700" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Responses
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/form/:link" element={<FormFill />} />
          <Route path="/responses/:formId" element={<ViewResponses />} />
          <Route path="*" element={
            <div className="text-center py-12">
              <p className="text-gray-500">404 - Page Not Found</p>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2025 FormCraft. Built with React & FastAPI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}