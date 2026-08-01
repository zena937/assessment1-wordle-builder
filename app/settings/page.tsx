'use client';

import { useState, useEffect } from 'react';

export default function Settings() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    setTheme(savedTheme);
    setFontSize(savedFontSize);
    
    document.documentElement.style.fontSize = 
      savedFontSize === 'large' ? '1.2rem' : 
      savedFontSize === 'small' ? '0.9rem' : '1rem';
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.style.fontSize = 
      size === 'large' ? '1.2rem' : 
      size === 'small' ? '0.9rem' : '1rem';
  };

  return (
    <div>
      <h1 className="mb-4" style={{ color: 'var(--text-color)' }}>⚙️ Settings</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5>🌓 Theme Preferences</h5>
          <p className="text-muted">Choose your preferred color scheme</p>
          <div className="btn-group" role="group">
            <button 
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => handleThemeChange('light')}
            >
              ☀️ Light
            </button>
            <button 
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => handleThemeChange('dark')}
            >
              🌙 Dark
            </button>
          </div>
          <div className="mt-2">
            <small className="text-muted">
              Current theme: <strong>{theme.charAt(0).toUpperCase() + theme.slice(1)}</strong>
            </small>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          <h5>🔤 Font Size</h5>
          <p className="text-muted">Adjust text size for better readability</p>
          <div className="btn-group" role="group">
            <button 
              className={`btn ${fontSize === 'small' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => handleFontSizeChange('small')}
            >
              A- Small
            </button>
            <button 
              className={`btn ${fontSize === 'medium' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => handleFontSizeChange('medium')}
            >
              A Medium
            </button>
            <button 
              className={`btn ${fontSize === 'large' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => handleFontSizeChange('large')}
            >
              A+ Large
            </button>
          </div>
          <div className="mt-2">
            <small className="text-muted">
              Current size: <strong>{fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}</strong>
            </small>
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-body">
          <h5>ℹ️ About Settings</h5>
          <p className="text-muted">
            Your preferences are saved in your browser's local storage and will persist across sessions.
          </p>
          <ul>
            <li><strong>Theme:</strong> Light or Dark mode</li>
            <li><strong>Font Size:</strong> Small, Medium, or Large</li>
          </ul>
        </div>
      </div>
    </div>
  );
}