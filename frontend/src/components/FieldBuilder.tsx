import { useState } from "react";
import { createField } from "../services/api";
import { useToast } from "../components/Toast";

type FieldType = "text" | "number" | "single_choice";

interface FieldBuilderProps {
  onSuccess?: () => void;
}

export default function FieldBuilder({ onSuccess }: FieldBuilderProps) {
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [options, setOptions] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async () => {
    if (!label.trim()) {
      showToast("Label is required", "error");
      return;
    }

    const payload: any = {
      label: label.trim(),
      field_type: fieldType,
    };

    if (fieldType === "single_choice") {
      const validOptions = options.filter((opt) => opt.trim() !== "");
      if (validOptions.length < 2) {
        showToast("Please provide at least 2 valid options", "error");
        return;
      }
      payload.options = validOptions;
    }

    setIsSubmitting(true);
    try {
      await createField(payload);
      showToast("Field created successfully!", "success");
      
      // Reset form
      setLabel("");
      setFieldType("text");
      setOptions([""]);
      
      // Call success callback
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.detail || "Failed to create field";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Create New Field</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Label
        </label>
        <input
          type="text"
          placeholder="e.g., Full Name, Age, Email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Type
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value as FieldType)}
          disabled={isSubmitting}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="single_choice">Single Choice</option>
        </select>
      </div>

      {fieldType === "single_choice" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  disabled={options.length <= 1 || isSubmitting}
                  className="px-3 py-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOption}
            disabled={isSubmitting}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          >
            + Add Option
          </button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-md font-medium ${
          isSubmitting
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } transition-colors`}
      >
        {isSubmitting ? "Creating..." : "Create Field"}
      </button>
    </div>
  );
}