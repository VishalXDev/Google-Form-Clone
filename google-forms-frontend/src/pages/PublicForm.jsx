// src/pages/PublicForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formService, responseService } from '../services/api';
import { Input, Select, Textarea, Button, Card } from '../components/common';

const PublicForm = () => {
  const { link } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    formService.getFormByLink(link).then(res => setForm(res.data));
  }, [link]);

  const handleChange = (fieldId, value) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async () => {
    const field_responses = Object.entries(responses).map(([field_id, value]) => ({ field_id, value }));
    await responseService.submitResponse({ form_id: form.id, field_responses });
    alert('Response submitted!');
  };

  if (!form) return <div>Loading...</div>;

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{form.title}</h1>
      {form.description && <p className="text-gray-600">{form.description}</p>}

      {form.fields.map((field) => (
        <div key={field.field_id}>
          {field.field_details.field_type === 'text' && (
            <Input label={field.field_details.name} onChange={(e) => handleChange(field.field_id, e.target.value)} />
          )}
          {field.field_details.field_type === 'textarea' && (
            <Textarea label={field.field_details.name} onChange={(e) => handleChange(field.field_id, e.target.value)} />
          )}
          {field.field_details.field_type === 'number' && (
            <Input type="number" label={field.field_details.name} onChange={(e) => handleChange(field.field_id, e.target.value)} />
          )}
          {field.field_details.field_type === 'single_choice' && (
            <Select
              label={field.field_details.name}
              options={field.field_details.options.map(option => ({ label: option, value: option }))}
              onChange={(e) => handleChange(field.field_id, e.target.value)}
            />
          )}
        </div>
      ))}

      <Button onClick={handleSubmit}>Submit</Button>
    </Card>
  );
};

export default PublicForm;