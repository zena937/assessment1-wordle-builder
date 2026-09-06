'use client';

const Footer = () => {
  return (
    <footer className="text-center py-4 mt-5" style={{ 
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--navbar-bg)',
      color: 'var(--text-color)'
    }}>
      <p className="mb-0">
        Assessment 1 - CSE5006 | Your Name | Student ID: 12345678
      </p>
      <small style={{ opacity: 0.7 }}>
        © 2026 Phoneme Activity Builder
      </small>
    </footer>
  );
};

export default Footer;
