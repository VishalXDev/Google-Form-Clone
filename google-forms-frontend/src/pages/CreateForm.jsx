import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, FileText, Hash, CircleDot, Check, Move, Sparkles, Eye, Settings, AlertCircle } from 'lucide-react';
import { formService } from '../services/api';
import { Input, Select, Button, Card } from '../components/common';

const fieldTypes = [
  { label: 'Text Input', value: 'text', icon: FileText, description: 'Single line text field' },
  { label: 'Number', value: 'number', icon: Hash, description: 'Numeric input only' },
  { label: 'Single Choice', value: 'single_choice', icon: CircleDot, description: 'Radio button selection' }
];

const CreateForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const addField = () => {
    setFields([...fields, { 
      id: Date.now(), name: '', field_type: 'text', options: [], is_required: false 
    }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const duplicateField = (index) => {
    const fieldToCopy = { ...fields[index], id: Date.now() };
    const newFields = [...fields];
    newFields.splice(index + 1, 0, fieldToCopy);
    setFields(newFields);
  };

  const moveField = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) return;
    
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFields(newFields);
  };

  const handleCreate = async () => {
    if (!title.trim()) return alert('Title is required');
    if (fields.length === 0) return alert('Add at least one field');

    // Validate field names
    const emptyFields = fields.filter(field => !field.name.trim());
    if (emptyFields.length > 0) {
      return alert('All fields must have a name');
    }

    try {
      setLoading(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        fields: fields.map((field) => ({
          field_details: {
            name: field.name.trim(),
            type: field.field_type,
            options: field.field_type === 'single_choice' ? field.options.filter(opt => opt.trim()) : [],
            is_required: field.is_required
          }
        }))
      };

      await formService.createForm(payload);
      alert('Form created successfully!');
      navigate('/');
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/10 rounded-xl mr-4">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create New Form</h1>
              <p className="text-blue-100 text-lg">Build beautiful forms in minutes</p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-4 mt-6">
            <div className="flex items-center text-white/80">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                <span className="text-sm font-bold">1</span>
              </div>
              <span className="text-sm">Form Details</span>
            </div>
            <div className="w-8 h-0.5 bg-white/30"></div>
            <div className="flex items-center text-white/80">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                <span className="text-sm font-bold">2</span>
              </div>
              <span className="text-sm">Add Fields</span>
            </div>
            <div className="w-8 h-0.5 bg-white/30"></div>
            <div className="flex items-center text-white/80">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                <span className="text-sm font-bold">3</span>
              </div>
              <span className="text-sm">Publish</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form Details Card */}
          <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border border-blue-200">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Form Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Form Title"
                  placeholder="Enter a compelling form title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="pr-10"
                />
                <Sparkles className="absolute right-3 top-9 w-4 h-4 text-yellow-500" />
              </div>
              
              <Input
                label="Description"
                placeholder="Add a brief description to help users understand your form"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
              />
            </div>
          </Card>

          {/* Fields Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Form Fields ({fields.length})
                </h2>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
                <Button 
                  onClick={addField} 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </div>

            {fields.length === 0 ? (
              <EmptyFieldsState onAddField={addField} />
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <EnhancedFieldCard
                    key={field.id}
                    field={field}
                    index={index}
                    onFieldChange={handleFieldChange}
                    onRemove={removeField}
                    onDuplicate={duplicateField}
                    onMove={moveField}
                    canMoveUp={index > 0}
                    canMoveDown={index < fields.length - 1}
                    previewMode={previewMode}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={loading || !title.trim() || fields.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Form
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Field Types Palette */}
          <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 text-purple-600 mr-2" />
              Field Types
            </h3>
            <div className="space-y-3">
              {fieldTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.value}
                    onClick={addField}
                    className="group p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                        <Icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Form Stats */}
          <Card className="p-6 bg-gradient-to-br from-white to-green-50 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-green-600 mr-2" />
              Form Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Fields</span>
                <span className="font-bold text-gray-900">{fields.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Required Fields</span>
                <span className="font-bold text-gray-900">
                  {fields.filter(f => f.is_required).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Optional Fields</span>
                <span className="font-bold text-gray-900">
                  {fields.filter(f => !f.is_required).length}
                </span>
              </div>
            </div>
          </Card>

          {/* Tips Card */}
          <Card className="p-6 bg-gradient-to-br from-white to-yellow-50 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              Pro Tips
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Keep field names clear and concise</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Use required fields sparingly to improve completion rates</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Preview your form before publishing</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const EmptyFieldsState = ({ onAddField }) => (
  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
    <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
      <Plus className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No fields added yet</h3>
    <p className="text-gray-600 mb-6">Start building your form by adding your first field</p>
    <Button 
      onClick={onAddField}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Your First Field
    </Button>
  </div>
);

const EnhancedFieldCard = ({ 
  field, index, onFieldChange, onRemove, onDuplicate, onMove, 
  canMoveUp, canMoveDown, previewMode 
}) => {
  return (
    <Card className="group p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
          </div>
          <span className="font-medium text-gray-900">
            {field.name || `Field ${index + 1}`}
          </span>
          {field.is_required && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
              Required
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onMove(index, 'up')} disabled={!canMoveUp}>
            <Move className="w-4 h-4 text-gray-400 rotate-180" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onMove(index, 'down')} disabled={!canMoveDown}>
            <Move className="w-4 h-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(index)}>
            <Plus className="w-4 h-4 text-green-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
      
      {!previewMode ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Field Name"
              value={field.name}
              onChange={(e) => onFieldChange(index, 'name', e.target.value)}
              placeholder="Enter field name..."
            />
            <Select
              label="Field Type"
              value={field.field_type}
              onChange={(e) => onFieldChange(index, 'field_type', e.target.value)}
              options={fieldTypes}
            />
          </div>

          {field.field_type === 'single_choice' && (
            <Input
              label="Options (comma separated)"
              value={field.options.join(', ')}
              onChange={(e) => onFieldChange(
                index, 'options', e.target.value.split(',').map(opt => opt.trim())
              )}
              placeholder="Option 1, Option 2, Option 3..."
              className="mb-4"
            />
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={field.is_required}
              onChange={(e) => onFieldChange(index, 'is_required', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700 font-medium">
              Required field
            </label>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {field.name}
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.field_type === 'text' && (
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Sample text input..."
              disabled
            />
          )}
          
          {field.field_type === 'number' && (
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number..."
              disabled
            />
          )}
          
          {field.field_type === 'single_choice' && (
            <div className="space-y-2">
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center">
                  <input
                    type="radio"
                    name={`field-${field.id}`}
                    className="w-4 h-4 text-blue-600"
                    disabled
                  />
                  <label className="ml-2 text-sm text-gray-700">{option}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default CreateForm;