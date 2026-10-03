'use client';

import WordListManager from '../Components/WordListManager';

export default function WordsPage() {
  return (
    <div>
      <h1 className="mb-2" style={{ color: 'var(--text-color)' }}>
        📚 Manage Word List
      </h1>
      <p className="text-muted mb-4">
        Create, edit, and delete words used by the Wordle and Word Search builder.
      </p>
      <WordListManager />
    </div>
  );
}