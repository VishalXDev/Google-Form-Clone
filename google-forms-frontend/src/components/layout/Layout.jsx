// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
            
            {/* Main Layout */}
            <div className="relative z-10">
                <Navbar />
                
                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="relative">
                        {/* Content Container */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <Outlet />
                            </div>
                            
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/50 to-pink-100/50 rounded-full blur-xl"></div>
                        </div>
                        
                        {/* Floating Action Button (Optional) */}
                        <div className="fixed bottom-8 right-8 z-20">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center group">
                                <div className="w-6 h-6 bg-white/20 rounded-sm group-hover:rotate-90 transition-transform duration-300"></div>
                            </div>
                        </div>
                    </div>
                </main>
                
                {/* Footer */}
                <footer className="mt-16 py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <p className="text-sm text-gray-500/80">
                                Built with ❤️ by Vishal Dwivedy
                            </p>
                            <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-400">
                                <span>Modern</span>
                                <span>•</span>
                                <span>Responsive</span>
                                <span>•</span>
                                <span>Beautiful</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            
            {/* Custom CSS for grid pattern */}
            <style jsx>{`
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
};

export default Layout;