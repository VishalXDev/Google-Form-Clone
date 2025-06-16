import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResponses, getFields, getFormByLink } from "../services/api";

type Field = {
  id: number;
  label: string;
};

export default function ViewResponses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState<any[]>([]);
  const [fieldLabels, setFieldLabels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await getResponses(Number(formId));
        const responseList = res.data;
        setResponses(responseList);

        if (!responseList.length) {
          setLoading(false);
          return;
        }

        const formRes = await getFormByLink(responseList[0].form_id.toString());
        const form = formRes.data;
        const fieldIds = form.fields; // already a parsed array

        const allFields = await getFields();
        const labelMap: Record<string, string> = {};

        allFields.data.forEach((f: Field) => {
          if (fieldIds.includes(f.id)) {
            labelMap[f.id] = f.label;
          }
        });

        setFieldLabels(labelMap);
        setLoading(false);
      } catch (err) {
        console.error("Error loading responses", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchResponses();
  }, [formId]);

  if (loading) return <p className="p-4 text-gray-600">Loading responses...</p>;
  if (error) return <p className="p-4 text-red-600">Failed to load responses.</p>;
  if (!responses.length) return <p className="p-4 text-gray-500">No responses submitted yet.</p>;

  const answerKeys = Object.keys(JSON.parse(responses[0].answers));

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4">📊 Form Responses</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-slate-200">
          <thead className="bg-gray-100 text-sm text-slate-700">
            <tr>
              {answerKeys.map((fid) => (
                <th key={fid} className="border px-4 py-2 text-left">
                  {fieldLabels[fid] || `Field ${fid}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
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
