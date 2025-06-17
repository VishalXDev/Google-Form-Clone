import { useEffect, useState } from "react";
import FieldBuilder from "../components/FieldBuilder";
import FormBuilder from "../components/FormBuilder";
import { getFields } from "../services/api";

interface Field {
  id: number;
  label: string;
  field_type: string;
  options?: string[];
}

type TabType = 'overview' | 'fields' | 'forms';

const FIELD_TYPES = {
  TEXT: "text",
  NUMBER: "number",
  SINGLE_CHOICE: "single_choice"
} as const;

export default function AdminDashboard() {
  const [fields, setFields] = useState<Field[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const fetchFields = async () => {
    try {
      const res = await getFields();
      setFields(res.data); // assume backend already parses `options`
    } catch (err) {
      console.error("Failed to fetch fields", err);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    const el = document.getElementById(activeTab);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [activeTab]);

  const stats = [
    { name: 'Total Fields', value: fields.length, icon: '🏷️', color: 'from-blue-500 to-blue-600' },
    { name: 'Text Fields', value: fields.filter(f => f.field_type === FIELD_TYPES.TEXT).length, icon: '📝', color: 'from-green-500 to-green-600' },
    { name: 'Choice Fields', value: fields.filter(f => f.field_type === FIELD_TYPES.SINGLE_CHOICE).length, icon: '☑️', color: 'from-purple-500 to-purple-600' },
    { name: 'Number Fields', value: fields.filter(f => f.field_type === FIELD_TYPES.NUMBER).length, icon: '🔢', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-12 sm:px-16 sm:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to FormCraft Dashboard
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Create powerful forms with reusable fields and collect responses effortlessly.
              Build, customize, and analyze all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('fields')}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-200 border border-white/20"
              >
                Create Field
              </button>
              <button
                onClick={() => setActiveTab('forms')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 shadow-lg"
              >
                Build Form
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 translate-x-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-2xl shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200" id={activeTab}>
        <div className="flex border-b border-slate-200">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'fields', name: 'Create Fields', icon: '🏷️' },
            { id: 'forms', name: 'Build Forms', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Field Library</h2>
                {fields.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No fields created yet</h3>
                    <p className="text-slate-500 mb-6">Start by creating your first reusable field component</p>
                    <button
                      onClick={() => setActiveTab('fields')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Create Your First Field
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fields.map(field => (
                      <div key={field.id} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all hover:scale-105">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                            field.field_type === FIELD_TYPES.TEXT ? 'bg-green-100 text-green-600' :
                            field.field_type === FIELD_TYPES.NUMBER ? 'bg-orange-100 text-orange-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {field.field_type === FIELD_TYPES.TEXT ? '📝' :
                             field.field_type === FIELD_TYPES.NUMBER ? '🔢' : '☑️'}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            field.field_type === FIELD_TYPES.TEXT ? 'bg-green-100 text-green-800' :
                            field.field_type === FIELD_TYPES.NUMBER ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {field.field_type.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{field.label}</h3>
                        {field.field_type === FIELD_TYPES.SINGLE_CHOICE &&
                          Array.isArray(field.options) && field.options.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-slate-500 mb-2">Options:</p>
                              <div className="flex flex-wrap gap-1">
                                {field.options.slice(0, 3).map((option, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-white rounded text-xs text-slate-600 border">
                                    {option}
                                  </span>
                                ))}
                                {field.options.length > 3 && (
                                  <span className="px-2 py-1 bg-slate-200 rounded text-xs text-slate-500">
                                    +{field.options.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'fields' && <FieldBuilder />}
          {activeTab === 'forms' && <FormBuilder />}
        </div>
      </div>
    </div>
  );
}
