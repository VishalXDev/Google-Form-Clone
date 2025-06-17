import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormByLink, getFields, submitResponse } from "../services/api";

type Field = {
  id: number;
  label: string;
  field_type: string;
  options?: string[];
};

const FIELD_TYPES = {
  TEXT: "text",
  NUMBER: "number",
  SINGLE_CHOICE: "single_choice",
} as const;

export default function FormFill() {
  const { link } = useParams();
  const [form, setForm] = useState<any>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormByLink(link!);
        const formData = res.data;
        setForm(formData);

        const allFieldsRes = await getFields();
        const usedFields = allFieldsRes.data.filter((f: Field) =>
          formData.fields.includes(f.id)
        );

        setFields(usedFields);
      } catch (err) {
        console.error("Form not found", err);
        setError(true);
      }
    };

    fetchForm();
  }, [link]);

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!form) return;

    try {
      await submitResponse({
        form_id: form.id,
        answers,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form", err);
      alert("Submission failed. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>❌ Form not found or invalid link.</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Loading form...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold text-green-600">✅ Thank you!</h2>
        <p className="mt-2 text-gray-700">Your response has been submitted.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow space-y-4">
      <h1 className="text-2xl font-bold">{form.title}</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block font-medium mb-1">{field.label}</label>

            {field.field_type === FIELD_TYPES.TEXT && (
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={answers[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}

            {field.field_type === FIELD_TYPES.NUMBER && (
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={answers[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}

            {field.field_type === FIELD_TYPES.SINGLE_CHOICE && field.options?.length && (
              <select
                className="w-full p-2 border rounded"
                value={answers[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {field.options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
