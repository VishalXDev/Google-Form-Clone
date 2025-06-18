import React from 'react';
import { Input, Select, Button } from '../common';
import { Trash2 } from 'lucide-react';

const fieldTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Single Choice', value: 'single_choice' }
];

const FormBuilder = ({ fields, onChangeField, onRemoveField }) => {
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="border p-4 rounded-lg bg-white shadow-sm">
          <Input
            label="Field Name"
            value={field.name}
            onChange={(e) => onChangeField(index, 'name', e.target.value)}
          />
          <Select
            label="Field Type"
            value={field.field_type}
            options={fieldTypes}
            onChange={(e) => onChangeField(index, 'field_type', e.target.value)}
          />
          {field.field_type === 'single_choice' && (
            <Input
              label="Options (comma separated)"
              value={field.options.join(',')}
              onChange={(e) => onChangeField(index, 'options', e.target.value.split(','))}
            />
          )}
          <Button variant="ghost" onClick={() => onRemoveField(index)} className="mt-2 text-red-500">
            <Trash2 className="w-4 h-4 mr-1" /> Remove Field
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FormBuilder;
