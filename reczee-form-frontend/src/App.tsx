import { Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import FormFill from "./pages/FormFill";
import ViewResponses from "./pages/ViewResponses";

export default function App() {
  return (
    <div className="p-4">
      <nav className="flex gap-4 mb-6">
        <Link to="/" className="text-blue-600 underline">Admin</Link>
        <Link to="/form/abc123" className="text-blue-600 underline">User Form</Link>
        <Link to="/responses/1" className="text-blue-600 underline">View Responses</Link>
      </nav>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/form/:link" element={<FormFill />} />
        <Route path="/responses/:formId" element={<ViewResponses />} />
      </Routes>
    </div>
  );
}
