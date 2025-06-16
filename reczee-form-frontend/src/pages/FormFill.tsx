import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormByLink, submitResponse } from "../services/api";

export default function FormFill() {
  const { link } = useParams();
  const [form, setForm] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await getFormByLink(link!);
        setForm(res.data);

        // Fetch full field data based on IDs
        const allFields = await fetch("http://localhost:8000/fields/").then(r => r.json());
        const usedFields = allFields.filter((f: any) =>
          JSON.parse(res.data.fields).includes(f.id)
        ).map((f: any) => ({
          ...f,
          options: f.options ? JSON.parse(f.options) : [],
        }));
        setFields(usedFields);
      } catch (err) {
        console.error("Form not found", err);
      }
    };

    fetchForm();
  }, [link]);

  const handleChange = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      await submitResponse({
        form_id: form.id,
        answers,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting form", err);
      alert("Submission failed");
    }
  };

  if (!form) return <p className="p-4 text-gray-600">Loading form...</p>;

  if (submitted) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow">
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

            {field.field_type === "text" && (
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={answers[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}

            {field.field_type === "number" && (
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={answers[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}

            {field.field_type === "single_choice" && (
              <select
                className="w-full p-2 border rounded"
                value={answers[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {field.options.map((opt: string, idx: number) => (
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
