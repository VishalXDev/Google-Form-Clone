import { useEffect, useState } from "react";
import FieldBuilder from "../components/FieldBuilder";
import FormBuilder from "../components/FormBuilder";
import { getFields } from "../services/api";

interface Field {
  id: number;
  label: string;
  field_type: string;
  options?: string[];
}

export default function AdminDashboard() {
  const [fields, setFields] = useState<Field[]>([]);

  const fetchFields = async () => {
    try {
      const res = await getFields();
      const data = res.data.map((f: any) => ({
        ...f,
        options: f.options ? JSON.parse(f.options) : [],
      }));
      setFields(data);
    } catch (err) {
      console.error("Failed to fetch fields", err);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">📋 Admin Dashboard</h1>

      <FieldBuilder />
      <FormBuilder />

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">🗂️ Reusable Fields</h2>
        {fields.length === 0 ? (
          <p className="text-gray-500">No fields created yet.</p>
        ) : (
          <ul className="space-y-2">
            {fields.map((field) => (
              <li
                key={field.id}
                className="p-3 border rounded shadow-sm bg-gray-50"
              >
                <p className="font-medium">{field.label}</p>
                <p className="text-sm text-gray-600">
                  Type: {field.field_type}
                </p>
                {field.field_type === "single_choice" &&
                  Array.isArray(field.options) &&
                  field.options.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Options: {field.options.join(", ")}
                    </p>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
