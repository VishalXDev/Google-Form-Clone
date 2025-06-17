import { Routes, Route, Link, useLocation } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import FormFill from "./pages/FormFill";
import ViewResponses from "./pages/ViewResponses";
import { useState, useEffect } from "react";

export default function App() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const latestFormLink = "d7dd815e";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  FormCraft
                </h1>
                <p className="text-xs text-slate-500">Professional Form Builder</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive("/") ? "bg-blue-100 text-blue-700 shadow-sm" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"}`}>
                Dashboard
              </Link>
              <Link to={`/form/${latestFormLink}`} className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive("/form") ? "bg-green-100 text-green-700 shadow-sm" : "text-slate-600 hover:text-green-600 hover:bg-green-50"}`}>
                Preview Form
              </Link>
              <Link to="/responses/1" className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive("/responses") ? "bg-purple-100 text-purple-700 shadow-sm" : "text-slate-600 hover:text-purple-600 hover:bg-purple-50"}`}>
                Responses
              </Link>
            </nav>
            <div className="hidden lg:flex items-center text-sm text-slate-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      <div className="md:hidden bg-white border-b border-slate-200">
        <div className="flex justify-around py-2">
          <Link to="/" className={`flex flex-col items-center p-2 rounded-lg ${isActive("/") ? "text-blue-600" : "text-slate-500"}`}>
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link to={`/form/${latestFormLink}`} className={`flex flex-col items-center p-2 rounded-lg ${isActive("/form") ? "text-green-600" : "text-slate-500"}`}>
            <span className="text-xs">Form</span>
          </Link>
          <Link to="/responses/1" className={`flex flex-col items-center p-2 rounded-lg ${isActive("/responses") ? "text-purple-600" : "text-slate-500"}`}>
            <span className="text-xs">Data</span>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/form/:link" element={<FormFill />} />
          <Route path="/responses/:formId" element={<ViewResponses />} />
          <Route path="*" element={<p className="text-center text-red-500 text-sm">404 - Page Not Found</p>} />
        </Routes>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              © 2025 FormCraft. Built with React & FastAPI.
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>Made with ❤️ by Vishal Dwivedy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
