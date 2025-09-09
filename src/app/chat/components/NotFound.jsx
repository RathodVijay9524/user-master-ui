import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/chat/hooks';
import { selectCurrentTheme } from '../../../redux/chat/themeSlice';

const NotFound = () => {
  const theme = useAppSelector(selectCurrentTheme) || {
    main: '#0f172a',
    text: '#e5e7eb',
    border: '#1f2937'
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.main }}>
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="text-8xl mb-4">😵</div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: theme.text }}>
          404 - Page Not Found
        </h1>
        <p className="text-xl opacity-70 mb-8" style={{ color: theme.text }}>
          The page you're looking for doesn't exist.
        </p>
        
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/chat"
            className="inline-block border px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            Start Chatting
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
