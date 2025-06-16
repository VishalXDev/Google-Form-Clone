import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResponses, getFormByLink } from "../services/api";

export default function ViewResponses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState<any[]>([]);
  const [fieldLabels, setFieldLabels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await getResponses(Number(formId));
        setResponses(res.data);

        // fetch form and fields to get field labels
        const formRes = await fetch("http://localhost:8000/forms/" + res.data[0]?.form_id).then(r => r.json());
        const fieldIds = JSON.parse(formRes.fields);

        const allFields = await fetch("http://localhost:8000/fields/").then(r => r.json());
        const labels: Record<string, string> = {};
        allFields.forEach((f: any) => {
          if (fieldIds.includes(f.id)) {
            labels[f.id] = f.label;
          }
        });
        setFieldLabels(labels);
        setLoading(false);
      } catch (err) {
        console.error("Error loading responses", err);
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  if (loading) return <p className="p-4">Loading...</p>;

  if (responses.length === 0) return <p className="p-4 text-gray-600">No responses yet.</p>;

  const answerKeys = Object.keys(JSON.parse(responses[0].answers));

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">📊 Form Responses</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              {answerKeys.map((fid) => (
                <th key={fid} className="border px-4 py-2 text-left">
                  {fieldLabels[fid] || `Field ${fid}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((resp) => {
              const answers = JSON.parse(resp.answers);
              return (
                <tr key={resp.id} className="hover:bg-gray-50">
                  {answerKeys.map((fid) => (
                    <td key={fid} className="border px-4 py-2">
                      {answers[fid] || "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
