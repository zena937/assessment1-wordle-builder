'use client';

import { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie'; // Add this import

interface NavbarProps {
  toggleTheme: (theme: string) => void; // Change to accept theme parameter
  theme: string;
}

const Navbar = ({ toggleTheme, theme }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Add this function
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme(newTheme);
    Cookies.set('theme', newTheme, { expires: 365 });
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{ 
      backgroundColor: 'var(--navbar-bg)', 
      borderBottom: '1px solid var(--border-color)',
      padding: '10px 0'
    }}>
      <div className="container">
        <Link href="/" className="navbar-brand" style={{ 
          color: 'var(--text-color)', 
          fontWeight: '700',
          fontSize: '1.3rem'
        }}>
          🎯 Phoneme Builder
        </Link>

        <button  
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}           // ← ADD THIS
          aria-label="Toggle navigation"   // ← ADD THIS
          style={{ borderColor: 'var(--border-color)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link" style={{ color: 'var(--text-color)' }} onClick={handleLinkClick}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/wordle" className="nav-link" style={{ color: 'var(--text-color)' }} onClick={handleLinkClick}>
                Wordle
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/wordsearch" className="nav-link" style={{ color: 'var(--text-color)' }} onClick={handleLinkClick}>
                Word Search
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link" style={{ color: 'var(--text-color)' }} onClick={handleLinkClick}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/settings" className="nav-link" style={{ color: 'var(--text-color)' }} onClick={handleLinkClick}>
                Settings
              </Link>
            </li>
            <li className="nav-item">
              <button 
                // Replace the inline onClick with handleThemeToggle
                onClick={handleThemeToggle} 
                className="btn btn-outline-secondary btn-sm ms-2"
                style={{ 
                  color: 'var(--text-color)', 
                  borderColor: 'var(--border-color)'
                }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;