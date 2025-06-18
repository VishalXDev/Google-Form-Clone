// src/pages/ViewForm/ViewForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formService } from '../services/api';
import { Card } from '../components/common';

const ViewForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    formService.getForm(id).then(res => setForm(res.data));
  }, [id]);

  if (!form) return <div>Loading...</div>;

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{form.title}</h1>
      <p className="text-gray-600">{form.description}</p>
      <ul className="list-disc list-inside">
        {form.fields.map((field, i) => (
          <li key={i}>
            <strong>{field.field_details.name}</strong> ({field.field_details.field_type})
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default ViewForm;
