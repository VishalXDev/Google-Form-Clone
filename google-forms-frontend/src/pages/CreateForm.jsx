// src/pages/CreateForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { fieldService, formService } from '../services/api';
import { Input, Select, Button, Card } from '../components/common';

const fieldTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Single Choice', value: 'single_choice' }
];

const CreateForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([...fields, { name: '', field_type: 'text', options: [], is_required: false }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleCreate = async () => {
    const createdFieldIds = [];
    for (const field of fields) {
      const response = await fieldService.createField(field);
      createdFieldIds.push(response.data.id);
    }

    await formService.createForm({ title, description, field_ids: createdFieldIds });
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Form</h1>
      <Card className="p-6 space-y-4">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Fields</h2>
          {fields.map((field, index) => (
            <Card key={index} className="p-4">
              <Input
                label="Field Name"
                value={field.name}
                onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
              />
              <Select
                label="Field Type"
                value={field.field_type}
                onChange={(e) => handleFieldChange(index, 'field_type', e.target.value)}
                options={fieldTypes}
              />
              {field.field_type === 'single_choice' && (
                <Input
                  label="Options (comma separated)"
                  value={field.options.join(',')}
                  onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(','))}
                />
              )}
              <Button
                variant="ghost"
                className="mt-2 text-red-500"
                onClick={() => setFields(fields.filter((_, i) => i !== index))}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Remove Field
              </Button>
            </Card>
          ))}
          <Button type="button" onClick={addField}>
            <Plus className="w-4 h-4 mr-2" /> Add Field
          </Button>
        </div>

        <Button onClick={handleCreate}>Create Form</Button>
      </Card>
    </div>
  );
};

export default CreateForm;