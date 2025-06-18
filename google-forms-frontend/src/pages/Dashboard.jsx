import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Eye, BarChart3, Settings, Trash2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { formService } from '../services/api';
import { Card, Button, LoadingSpinner } from '../components/common';

const Dashboard = () => {
  const { data: forms, loading, error, refetch } = useApi(() => formService.getForms());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading forms: {error}</div>
        <Button onClick={refetch}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your forms and view responses</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/forms/create">
            <Button className="inline-flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create New Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Forms</p>
              <p className="text-2xl font-semibold text-gray-900">{forms?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Responses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {forms?.reduce((sum, form) => sum + (form.total_responses || 0), 0) || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Active Forms</p>
              <p className="text-2xl font-semibold text-gray-900">
                {forms?.filter((form) => form.is_active).length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Forms List */}
      <div>
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
        </div>

        {!forms || forms.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <FormCard key={form.id} form={form} onUpdate={refetch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FormCard = ({ form, onUpdate }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await formService.deleteForm(form.id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {form.title}
          </h3>
          {form.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {form.description}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            form.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {form.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center text-sm text-gray-500">
        <span>{form.fields?.length || 0} fields</span>
        <span className="mx-2">•</span>
        <span>{form.total_responses || 0} responses</span>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex space-x-2">
          <Link to={`/forms/${form.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
          <Link to={`/forms/${form.id}/responses`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-1" />
              Responses
            </Button>
          </Link>
        </div>
        <div className="flex space-x-2">
          <Link to={`/forms/${form.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Share link:</span>
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/form/${form.unique_link}`;
              navigator.clipboard.writeText(shareUrl);
              alert('Link copied to clipboard!');
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Copy Link
          </button>
        </div>
      </div>
    </Card>
  );
};

const EmptyState = () => (
  <Card className="p-12 text-center">
    <FileText className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">No forms yet</h3>
    <p className="mt-2 text-gray-500">Get started by creating your first form.</p>
    <div className="mt-6">
      <Link to="/forms/create">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Form
        </Button>
      </Link>
    </div>
  </Card>
);

export default Dashboard;
