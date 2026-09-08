'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Cookies from 'js-cookie';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = Cookies.get('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <html lang="en">
      <body>
        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <main className="container mt-5 pt-5">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}