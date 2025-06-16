import { useEffect, useState } from "react";
import { getFields, createForm } from "../services/api";

export default function FormBuilder() {
  const [title, setTitle] = useState("");
  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchFields = async () => {
      const res = await getFields();
      setAvailableFields(res.data);
    };
    fetchFields();
  }, []);

  const toggleField = (id: number) => {
    setSelectedFieldIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title is required");
    if (selectedFieldIds.length === 0)
      return alert("Select at least one field");

    try {
      const res = await createForm({ title, field_ids: selectedFieldIds });
      setSuccess(`✅ Form "${res.data.title}" created with link: ${res.data.unique_link}`);
      setTitle("");
      setSelectedFieldIds([]);
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
          <p className="text-gray-500">No fields available.</p>
        ) : (
          <ul className="space-y-2">
            {availableFields.map((field) => (
              <li key={field.id}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFieldIds.includes(field.id)}
                    onChange={() => toggleField(field.id)}
                  />
                  <span>
                    {field.label} ({field.field_type})
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Form
      </button>

      {success && <p className="text-green-600">{success}</p>}
    </div>
  );
}
