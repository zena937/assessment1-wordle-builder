'use client';

import WordSearchBuilder from '../Components/WordSearchBuilder';

export default function WordSearchPage() {
  return (
    <div>
      <h1 className="mb-4" style={{ color: 'var(--text-color)' }}>🔍 Create Word Search</h1>
      <WordSearchBuilder />
    </div>
  );
}