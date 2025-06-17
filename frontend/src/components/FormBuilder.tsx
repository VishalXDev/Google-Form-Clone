import { useEffect, useState } from "react";
import { getFields, createForm } from "../services/api";
import { useToast } from "../components/Toast";

type Field = {
  id: number;
  label: string;
  field_type: string;
};

interface FormBuilderProps {
  onSuccess?: () => void;
}

export default function FormBuilder({ onSuccess }: FormBuilderProps) {
  const [title, setTitle] = useState("");
  const [availableFields, setAvailableFields] = useState<Field[]>([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await getFields();
        setAvailableFields(res.data);
      } catch (err) {
        console.error("Failed to load fields", err);
        showToast("Failed to load fields", "error");
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
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    if (selectedFieldIds.length === 0) {
      showToast("Select at least one field", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createForm({ title, field_ids: selectedFieldIds });
      showToast(`✅ "${res.data.title}" created`, "success");
      setTitle("");
      setSelectedFieldIds([]);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error creating form", err);
      showToast("Failed to create form", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">📑 Create New Form</h2>

      <input
        type="text"
        placeholder="Form Title (e.g., Feedback Form)"
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
      />

      <div>
        <p className="font-medium mb-2">Select Fields:</p>
        {availableFields.length === 0 ? (
          <p className="text-gray-500">No fields available. Create one first.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {availableFields.map((field) => (
              <li key={field.id}>
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedFieldIds.includes(field.id)}
                    onChange={() => toggleField(field.id)}
                    disabled={isSubmitting}
                  />
                  <span className="flex-1">
                    {field.label}{" "}
                    <span className="text-xs text-slate-500">({field.field_type})</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded font-medium transition ${
          isSubmitting
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isSubmitting ? "Saving..." : "Save Form"}
      </button>
    </div>
  );
}
