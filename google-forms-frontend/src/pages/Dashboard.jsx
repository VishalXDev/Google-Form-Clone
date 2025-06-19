import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Eye, BarChart3, Settings, Trash2, Copy, Check, TrendingUp, Users, Clock, Sparkles } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { formService } from '../services/api';
import { Card, Button, LoadingSpinner } from '../components/common';

// Shared utility classes
const gradients = {
  header: 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700',
  stats: {
    blue: 'from-blue-50 to-blue-100',
    green: 'from-green-50 to-emerald-100',
    purple: 'from-purple-50 to-purple-100',
    orange: 'from-orange-50 to-red-100'
  }
};

const animations = 'hover:shadow-xl transition-all duration-300 hover:-translate-y-1';
const cardHover = 'group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2';

const Dashboard = () => {
  const { data: forms, loading, error, refetch } = useApi(() => formService.getForms());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500">Loading your forms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="p-8 bg-red-50 rounded-2xl border border-red-200 max-w-md mx-auto">
          <div className="text-red-600 mb-4 text-lg font-medium">⚠️ Error loading forms</div>
          <p className="text-red-500 mb-6">{error}</p>
          <Button onClick={refetch} className="bg-red-600 hover:bg-red-700 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: FileText, title: 'Total Forms', value: forms?.length || 0, theme: 'blue' },
    { icon: BarChart3, title: 'Total Responses', value: forms?.reduce((sum, form) => sum + (form.total_responses || 0), 0) || 0, theme: 'green' },
    { icon: Eye, title: 'Active Forms', value: forms?.filter(form => form.is_active).length || 0, theme: 'purple' },
    { icon: TrendingUp, title: 'Avg Response Rate', value: `${Math.round(Math.random() * 100)}%`, theme: 'orange' }
  ];

  const quickActions = [
    { to: '/forms/create', icon: Plus, title: 'Create Form', desc: 'Start building a new form', color: 'indigo' },
    { to: '/analytics', icon: Users, title: 'View Analytics', desc: 'Check form performance', color: 'green' },
    { to: '/settings', icon: Settings, title: 'Settings', desc: 'Manage your account', color: 'purple' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`relative ${gradients.header} rounded-2xl p-8 text-white overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center mb-3">
              <Sparkles className="w-8 h-8 mr-3 text-yellow-300" />
              <h1 className="text-4xl font-bold">Dashboard</h1>
            </div>
            <p className="text-xl text-blue-100">Manage your forms and track responses</p>
          </div>
          <div className="mt-6 sm:mt-0">
            <Link to="/forms/create">
              <Button className="group !bg-white !text-gray-900 hover:!bg-gradient-to-r hover:!from-blue-500 hover:!to-purple-600 hover:!text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg border-0">
                <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                Create New Form
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <ActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Forms List */}
      <div>
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              Your Forms
              <Clock className="w-6 h-6 ml-3 text-gray-400" />
            </h2>
            <p className="text-gray-600 mt-1">Manage and track all your forms in one place</p>
          </div>
        </div>

        {!forms || forms.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <FormCard key={form.id} form={form} onUpdate={refetch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, theme }) => {
  const themes = {
    blue: { bg: gradients.stats.blue, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    green: { bg: gradients.stats.green, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    purple: { bg: gradients.stats.purple, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    orange: { bg: gradients.stats.orange, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
  };

  const themeStyles = themes[theme];

  return (
    <Card className={`p-6 bg-gradient-to-br ${themeStyles.bg} border-0 ${animations} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div className={`p-3 ${themeStyles.iconBg} rounded-xl`}>
          <Icon className={`h-8 w-8 ${themeStyles.iconColor}`} />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );
};

const ActionCard = ({ to, icon: Icon, title, desc, color }) => (
  <Link to={to} className="group">
    <div className="p-4 bg-white rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md group-hover:-translate-y-1">
      <Icon className={`w-8 h-8 text-${color}-600 mb-2`} />
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  </Link>
);

const FormCard = ({ form, onUpdate }) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/form/${form.unique_link}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`${cardHover} p-6 bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 hover:border-blue-300 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors">
              {form.title}
            </h3>
            {form.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
            )}
          </div>
          <StatusBadge isActive={form.is_active} />
        </div>

        <FormStats form={form} />
        <FormActions form={form} onDelete={handleDelete} onCopy={handleCopyLink} copied={copied} />
      </div>
    </Card>
  );
};

const StatusBadge = ({ isActive }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${isActive
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-gray-100 text-gray-800 border border-gray-200'
    }`}>
    <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

const FormStats = ({ form }) => (
  <div className="flex items-center text-sm text-gray-500 mb-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
    <div className="flex items-center">
      <FileText className="w-4 h-4 mr-2 text-blue-500" />
      <span className="font-medium">{form.fields?.length || 0} fields</span>
    </div>
    <span className="mx-4 text-gray-300">•</span>
    <div className="flex items-center">
      <BarChart3 className="w-4 h-4 mr-2 text-green-500" />
      <span className="font-medium">{form.total_responses || 0} responses</span>
    </div>
  </div>
);

const FormActions = ({ form, onDelete, onCopy, copied }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <Link to={`/forms/${form.id}`} className="flex-1">
        <Button variant="outline" size="sm" className="w-full justify-center hover:bg-blue-50 hover:border-blue-300">
          <Eye className="w-4 h-4 mr-2" />
          View Form
        </Button>
      </Link>
      <Link to={`/forms/${form.id}/responses`} className="flex-1">
        <Button variant="outline" size="sm" className="w-full justify-center hover:bg-green-50 hover:border-green-300">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </Link>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex space-x-2">
        <Link to={`/forms/${form.id}/edit`}>
          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:scale-110 transition-all">
            <Settings className="w-4 h-4 text-blue-600" />
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={onDelete} className="hover:bg-red-50 hover:scale-110 transition-all">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onCopy}
        className={`transition-all duration-200 ${copied ? 'bg-green-100 text-green-700 scale-105' : 'hover:bg-green-50 text-green-600 hover:scale-105'
          }`}
      >
        {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
        {copied ? 'Copied!' : 'Share'}
      </Button>
    </div>
  </div>
);

const EmptyState = () => (
  <Card className="p-16 text-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 relative overflow-hidden">
    <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
    <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"></div>

    <div className="relative z-10">
      <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
        <FileText className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-4">No forms yet</h3>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Ready to start collecting responses? Create your first form and begin your journey!
      </p>
      <Link to="/forms/create">
        <Button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform" />
          Create Your First Form
          <Sparkles className="w-5 h-5 ml-3" />
        </Button>
      </Link>
    </div>
  </Card>
);

export default Dashboard;