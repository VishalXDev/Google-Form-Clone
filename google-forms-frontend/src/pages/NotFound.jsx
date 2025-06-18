// src/pages/NotFound.jsx
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <a href="/" className="text-primary-600 hover:underline">
        Go back to homepage
      </a>
    </div>
  );
};

export default NotFound;