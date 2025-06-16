import { useState } from "react";
import { createField } from "../services/api";

type FieldType = "text" | "number" | "single_choice";

export default function FieldBuilder() {
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [options, setOptions] = useState<string[]>([""]);
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
      const validOptions = options.filter((opt) => opt.trim() !== "");
      if (validOptions.length < 2) {
        return alert("Please provide at least 2 valid options.");
      }
      payload.options = validOptions;
    }

    try {
      await createField(payload);
      setSuccess("✅ Field created!");
      setLabel("");
      setFieldType("text");
      setOptions([""]);

      setTimeout(() => setSuccess(""), 3000); // auto-clear message
    } catch (err) {
      console.error(err);
      alert("Failed to create field.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">🛠️ Create New Field</h2>

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
        onChange={(e) => setFieldType(e.target.value as FieldType)}
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
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-blue-500 hover:underline text-sm"
          >
            + Add Option
          </button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Save Field
      </button>

      {success && (
        <p className="text-green-600 text-sm font-medium mt-2">{success}</p>
      )}
    </div>
  );
}
