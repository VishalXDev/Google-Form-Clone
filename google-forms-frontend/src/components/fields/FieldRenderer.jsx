import React from 'react';
import { Input, Select, Textarea } from '../common';

const FieldRenderer = ({ field, value, onChange }) => {
  const type = field.field_details.field_type;
  const name = field.field_details.name;

  switch (type) {
    case 'text':
      return <Input label={name} value={value} onChange={onChange} required={field.field_details.is_required} />;
    case 'number':
      return <Input type="number" label={name} value={value} onChange={onChange} required={field.field_details.is_required} />;
    case 'single_choice':
      return (
        <Select
          label={name}
          options={field.field_details.options.map(opt => ({ label: opt, value: opt }))}
          value={value}
          onChange={onChange}
          required={field.field_details.is_required}
        />
      );
    case 'textarea':
      return <Textarea label={name} value={value} onChange={onChange} required={field.field_details.is_required} />;
    default:
      return null;
  }
};

export default FieldRenderer;
