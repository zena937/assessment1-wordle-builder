'use client';

const Footer = () => {
  return (
    <footer className="text-center py-4 mt-5" style={{ 
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--navbar-bg)',
      color: 'var(--text-color)'
    }}>
      <p className="mb-0">
      Assessment 2 - CSE3CWA | Zena Oosthuizen | Student ID: 22409698
    </p>
    <small style={{ opacity: 0.7 }}>
      © 2026 Phoneme Activity Builder
    </small>
    </footer>
  );
};

export default Footer;
