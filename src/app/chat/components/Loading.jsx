import React from 'react';
import { useAppSelector } from '../../../redux/chat/hooks';
import { selectCurrentTheme } from '../../../redux/chat/themeSlice';

const Loading = () => {
  const theme = useAppSelector(selectCurrentTheme) || {
    main: '#0f172a',
    text: '#e5e7eb'
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.main }}>
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">🤖</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
          Loading...
        </h2>
        <p className="text-lg opacity-70" style={{ color: theme.text }}>
          Initializing AI Chat Application
        </p>
      </div>
    </div>
  );
};

export default Loading;
