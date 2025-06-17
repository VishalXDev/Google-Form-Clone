import { useEffect, useState } from "react";
import FieldBuilder from "../components/FieldBuilder";
import FormBuilder from "../components/FormBuilder";
import { getFields, getForms, deleteForm } from "../services/api";
import { useToast } from "../components/Toast";

interface Field {
  id: number;
  label: string;
  field_type: string;
  options?: string[];
}

interface Form {
  id: number;
  title: string;
  unique_link: string;
  created_at: string;
}

type TabType = 'overview' | 'fields' | 'forms' | 'manage';

export default function AdminDashboard() {
  const [fields, setFields] = useState<Field[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { showToast } = useToast();

  const fetchFields = async () => {
    try {
      const res = await getFields();
      setFields(res.data);
    } catch (err) {
      showToast("Failed to fetch fields", "error");
    }
  };

  const fetchForms = async () => {
    try {
      const res = await getForms();
      setForms(res.data);
    } catch (err) {
      showToast("Failed to fetch forms", "error");
    }
  };

  useEffect(() => {
    fetchFields();
    fetchForms();
  }, []);

  const handleDeleteForm = async (formId: number) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    
    try {
      await deleteForm(formId);
      setForms(prev => prev.filter(f => f.id !== formId));
      showToast("Form deleted successfully", "success");
    } catch (err) {
      showToast("Failed to delete form", "error");
    }
  };

  const stats = [
    { name: 'Total Fields', value: fields.length, color: 'text-blue-600' },
    { name: 'Total Forms', value: forms.length, color: 'text-green-600' },
    { name: 'Text Fields', value: fields.filter(f => f.field_type === 'text').length, color: 'text-purple-600' },
    { name: 'Choice Fields', value: fields.filter(f => f.field_type === 'single_choice').length, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Create forms, manage fields, and view responses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'fields', name: 'Create Fields' },
              { id: 'forms', name: 'Build Forms' },
              { id: 'manage', name: 'Manage Forms' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Fields</h2>
                {fields.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M28 16a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">No fields yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Get started by creating your first field</p>
                    <button
                      onClick={() => setActiveTab('fields')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                    >
                      Create Field
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fields.map(field => (
                      <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{field.label}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {field.field_type.replace('_', ' ')}
                          </span>
                        </div>
                        {field.field_type === 'single_choice' && field.options && (
                          <div className="text-sm text-gray-500">
                            Options: {field.options.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'fields' && <FieldBuilder onSuccess={fetchFields} />}
          {activeTab === 'forms' && <FormBuilder onSuccess={fetchForms} />}

          {activeTab === 'manage' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Forms</h2>
              {forms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No forms created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {forms.map(form => (
                    <div key={form.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{form.title}</h3>
                        <p className="text-sm text-gray-500">
                          Link: /form/{form.unique_link}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/form/${form.unique_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Preview
                        </a>
                        <a
                          href={`/responses/${form.id}`}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          Responses
                        </a>
                        <button
                          onClick={() => handleDeleteForm(form.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
