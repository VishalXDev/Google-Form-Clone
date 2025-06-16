import { useEffect, useState } from "react";
import { getFields, createForm } from "../services/api";

type Field = {
  id: number;
  label: string;
  field_type: string;
};

export default function FormBuilder() {
  const [title, setTitle] = useState("");
  const [availableFields, setAvailableFields] = useState<Field[]>([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await getFields();
        setAvailableFields(res.data);
      } catch (err) {
        console.error("Failed to load fields", err);
      }
    };
    fetchFields();
  }, []);

  const toggleField = (id: number) => {
    setSelectedFieldIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title is required.");
    if (selectedFieldIds.length === 0) return alert("Select at least one field.");

    try {
      const res = await createForm({ title, field_ids: selectedFieldIds });
      setSuccess(`✅ "${res.data.title}" created! Link: /form/${res.data.unique_link}`);
      setTitle("");
      setSelectedFieldIds([]);

      setTimeout(() => setSuccess(""), 4000); // auto-clear after 4s
    } catch (err) {
      console.error("Error creating form", err);
      alert("Failed to create form");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">📑 Create New Form</h2>

      <input
        type="text"
        placeholder="Form Title (e.g., Feedback Form)"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>
        <p className="font-medium mb-2">Select Fields:</p>
        {availableFields.length === 0 ? (
          <p className="text-gray-500">No fields available. Create one first.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {availableFields.map((field) => (
              <li key={field.id} className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer w-full p-2 hover:bg-slate-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedFieldIds.includes(field.id)}
                    onChange={() => toggleField(field.id)}
                  />
                  <span className="flex-1">
                    {field.label} <span className="text-xs text-slate-500">({field.field_type})</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Save Form
      </button>

      {success && (
        <p className="text-green-600 text-sm font-medium mt-2">
          {success}
        </p>
      )}
    </div>
  );
}
