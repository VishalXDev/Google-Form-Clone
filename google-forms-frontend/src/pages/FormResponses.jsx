// src/pages/FormResponse.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { responseService } from '../services/api';
import { Card } from '../components/common';

const FormResponse = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    responseService.getFormResponseSummary(id).then(res => setSummary(res.data));
  }, [id]);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Response Summary</h1>
      <p>Total Responses: {summary.total_responses}</p>
      <div className="space-y-4">
        {summary.responses.map((response, index) => (
          <Card key={index} className="p-4">
            <p className="text-gray-500 text-sm">Submitted: {new Date(response.submitted_at).toLocaleString()}</p>
            <ul className="mt-2 space-y-1">
              {Object.entries(response.answers).map(([question, answer], i) => (
                <li key={i} className="text-sm">
                  <strong>{question}:</strong> {answer}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormResponse;

