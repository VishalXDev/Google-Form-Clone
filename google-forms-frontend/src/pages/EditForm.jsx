// src/pages/EditForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formService } from '../services/api';
import { Input, Button, Card } from '../components/common';

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      const response = await formService.getForm(id);
      setForm(response.data);
    };
    fetchForm();
  }, [id]);

  const handleUpdate = async () => {
    await formService.updateForm(id, {
      title: form.title,
      description: form.description,
      is_active: form.is_active
    });
    navigate('/');
  };

  if (!form) return <div>Loading...</div>;

  return (
    <Card className="p-6 space-y-4">
      <Input
        label="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Input
        label="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
        />
        <span>Form is Active</span>
      </label>
      <Button onClick={handleUpdate}>Update Form</Button>
    </Card>
  );
};

export default EditForm;
