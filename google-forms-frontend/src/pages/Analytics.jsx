import React, { useState, useEffect } from 'react';
import { BarChart3, LineChart, PieChart, Activity, ShieldCheck, Users, TrendingUp, Eye, Clock } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('responses');
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sample data
  const responseData = [
    { date: 'Mon', responses: 45, views: 120 },
    { date: 'Tue', responses: 52, views: 140 },
    { date: 'Wed', responses: 38, views: 100 },
    { date: 'Thu', responses: 61, views: 160 },
    { date: 'Fri', responses: 55, views: 145 },
    { date: 'Sat', responses: 42, views: 110 },
    { date: 'Sun', responses: 48, views: 125 }
  ];

  const fieldTypeData = [
    { name: 'Text Input', value: 35, color: 'bg-blue-500' },
    { name: 'Multiple Choice', value: 25, color: 'bg-green-500' },
    { name: 'Email', value: 20, color: 'bg-yellow-500' },
    { name: 'Number', value: 12, color: 'bg-red-500' },
    { name: 'Date', value: 8, color: 'bg-purple-500' }
  ];

  const activityData = [
    { hour: '6AM', responses: 5 },
    { hour: '9AM', responses: 25 },
    { hour: '12PM', responses: 45 },
    { hour: '3PM', responses: 38 },
    { hour: '6PM', responses: 22 },
    { hour: '9PM', responses: 12 }
  ];

  const securityData = [
    { type: 'Verified', count: 285, color: 'text-green-600 bg-green-100' },
    { type: 'Flagged', count: 12, color: 'text-yellow-600 bg-yellow-100' },
    { type: 'Blocked', count: 3, color: 'text-red-600 bg-red-100' }
  ];

  const StatCard = ({ icon: Icon, title, value, change, color, description }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );

  const LineChartComponent = () => {
    const maxValue = Math.max(...responseData.map(d => d[selectedMetric]));
    
    return (
      <div className="h-64 flex items-end justify-between px-4 pb-4">
        {responseData.map((item, index) => {
          const height = (item[selectedMetric] / maxValue) * 200;
          return (
            <div key={index} className="flex flex-col items-center group">
              <div className="relative mb-2">
                <div 
                  className="w-8 bg-blue-500 rounded-t-lg transition-all duration-1000 ease-out hover:bg-blue-600 cursor-pointer"
                  style={{ 
                    height: animationComplete ? `${height}px` : '0px',
                    minHeight: '4px'
                  }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {item[selectedMetric]}
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{item.date}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const PieChartComponent = () => {
    const total = fieldTypeData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {fieldTypeData.map((item, index) => {
              const angle = (item.value / total) * 360;
              const x1 = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
              
              const largeArc = angle > 180 ? 1 : 0;
              const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
              
              const result = (
                <path
                  key={index}
                  d={pathData}
                  className={`${item.color.replace('bg-', 'fill-')} hover:opacity-80 transition-opacity cursor-pointer`}
                  style={{
                    animation: animationComplete ? 'none' : `drawPie 1s ease-out ${index * 0.1}s both`
                  }}
                />
              );
              
              currentAngle += angle;
              return result;
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-600">Total Fields</div>
            </div>
          </div>
        </div>
        <div className="ml-8 space-y-2">
          {fieldTypeData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-700">{item.name}</span>
              <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BarChartComponent = () => {
    const maxValue = Math.max(...activityData.map(d => d.responses));
    
    return (
      <div className="h-64 flex items-end justify-between px-4 pb-8">
        {activityData.map((item, index) => {
          const height = (item.responses / maxValue) * 180;
          return (
            <div key={index} className="flex flex-col items-center group">
              <div className="relative mb-2">
                <div 
                  className="w-12 bg-teal-500 rounded-t-lg transition-all duration-1000 ease-out hover:bg-teal-600 cursor-pointer"
                  style={{ 
                    height: animationComplete ? `${height}px` : '0px',
                    minHeight: '8px'
                  }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.responses}
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{item.hour}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <style jsx>{`
        @keyframes drawPie {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your forms' performance and engagement</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total Responses"
          value="1,247"
          change={12.5}
          color="bg-blue-500"
          description="vs last period"
        />
        <StatCard
          icon={Eye}
          title="Form Views"
          value="3,891"
          change={8.2}
          color="bg-green-500"
          description="unique visitors"
        />
        <StatCard
          icon={TrendingUp}
          title="Conversion Rate"
          value="32.1%"
          change={-2.1}
          color="bg-purple-500"
          description="responses/views"
        />
        <StatCard
          icon={Clock}
          title="Avg. Completion Time"
          value="2m 34s"
          change={-5.4}
          color="bg-orange-500"
          description="time to complete"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Responses Over Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <LineChart className="w-5 h-5 mr-2 text-blue-500" />
              Responses Over Time
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedMetric('responses')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === 'responses' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Responses
              </button>
              <button
                onClick={() => setSelectedMetric('views')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === 'views' 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Views
              </button>
            </div>
          </div>
          <LineChartComponent />
        </div>

        {/* Field Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-500" />
            Field Types
          </h3>
          <PieChartComponent />
        </div>

        {/* Peak Activity Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 xl:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-teal-500" />
            Peak Activity Hours
          </h3>
          <BarChartComponent />
        </div>

        {/* Security Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-red-500" />
            Security Status
          </h3>
          <div className="space-y-4">
            {securityData.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${item.color} border transition-all hover:shadow-sm`}>
                <span className="text-sm font-medium">{item.type}</span>
                <span className="text-lg font-bold">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <ShieldCheck className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-700">
                <span className="font-bold">95.0%</span> security success rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold mb-4 text-indigo-800 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Coming Soon
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-indigo-700 hover:text-indigo-900 transition-colors">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Export analytics data (CSV, PDF)</span>
            </div>
            <div className="flex items-center text-indigo-700 hover:text-indigo-900 transition-colors">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Compare forms by engagement</span>
            </div>
            <div className="flex items-center text-indigo-700 hover:text-indigo-900 transition-colors">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Custom date range filters</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-indigo-700 hover:text-indigo-900 transition-colors">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Geographic insights</span>
            </div>
            <div className="flex items-center text-indigo-700 hover:text-indigo-900 transition-colors">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Device & browser analytics</span>
            </div>
            <div className="flex items-center text-indigo-700 hover:text-indigo-900 transition-colors">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Real-time notifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}