import { useState } from "react";
import { createField } from "../services/api";

export default function FieldBuilder() {
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [options, setOptions] = useState([""]);
  const [success, setSuccess] = useState("");

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!label.trim()) return alert("Label is required!");

    const payload: any = {
      label,
      field_type: fieldType,
    };
    if (fieldType === "single_choice") {
      payload.options = options.filter(opt => opt.trim() !== "");
    }

    try {
      await createField(payload);
      setSuccess("✅ Field created!");
      setLabel("");
      setOptions([""]);
    } catch (err) {
      console.error(err);
      alert("Failed to create field");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">🛠️ Create New Field</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Field label (e.g., Age, Email)"
          className="w-full p-2 border rounded"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <select
          className="w-full p-2 border rounded"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="single_choice">Single Choice</option>
        </select>

        {fieldType === "single_choice" && (
          <div>
            <p className="font-medium mb-2">Options:</p>
            {options.map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
                <button
                  onClick={() => removeOption(idx)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={addOption} className="text-blue-500 underline">
              + Add Option
            </button>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Field
        </button>

        {success && <p className="text-green-600">{success}</p>}
      </div>
    </div>
  );
}
