// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Plus, FormInput, Sparkles } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: FileText },
    { name: 'Create Form', href: '/forms/create', icon: Plus },
  ];
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <FormInput className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Google Form Builder
              </h1>
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out
                    ${isActive 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30' 
                      : 'text-white/80 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-white/70'}`} />
                  <span className="text-sm">{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-white/5 rounded-lg blur-sm -z-10"></div>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Version Badge */}
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/90 backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              v2.0
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;