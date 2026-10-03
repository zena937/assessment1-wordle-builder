'use client';

import { useState, useEffect } from 'react';

interface WordEntry {
  id: string;
  word: string;
  phonemes: string[];
  hint?: string | null;
  difficulty: string;
}

export default function WordListManager() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Form state
  const [newWord, setNewWord] = useState('');
  const [newPhonemes, setNewPhonemes] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('EASY');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHint, setEditHint] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('EASY');

  const fetchWords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/words');
      if (!res.ok) throw new Error('Failed to fetch words');
      const data = await res.json();
      setWords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const phonemeArray = newPhonemes
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    if (!newWord || phonemeArray.length === 0) {
      setError('Word and at least one phoneme are required.');
      return;
    }

    try {
      const res = await fetch('/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: newWord.toUpperCase(),
          phonemes: phonemeArray,
          hint: newHint || undefined,
          difficulty: newDifficulty,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to create word (${res.status})`);
      }

      setSuccess(`Word "${newWord.toUpperCase()}" created.`);
      setNewWord('');
      setNewPhonemes('');
      setNewHint('');
      setNewDifficulty('EASY');
      await fetchWords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDelete = async (id: string, word: string) => {
    clearMessages();
    if (!confirm(`Delete "${word}"?`)) return;

    try {
      const res = await fetch(`/api/words/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Failed to delete (${res.status})`);
      }
      setSuccess(`Word "${word}" deleted.`);
      await fetchWords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const startEdit = (w: WordEntry) => {
    setEditingId(w.id);
    setEditHint(w.hint || '');
    setEditDifficulty(w.difficulty);
    clearMessages();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditHint('');
    setEditDifficulty('EASY');
  };

  // 🔵 FIXED: sends the full word object because PUT is a full replacement
  const handleUpdate = async (id: string) => {
    clearMessages();
    try {
      const target = words.find((w) => w.id === id);
      if (!target) {
        throw new Error('Word not found in local list');
      }

      const res = await fetch(`/api/words/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: target.word,
          phonemes: target.phonemes,
          hint: editHint,
          difficulty: editDifficulty,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to update (${res.status})`);
      }
      setSuccess('Word updated.');
      setEditingId(null);
      await fetchWords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div>
      {/* Messages */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* Create form */}
      <div className="card mb-4">
        <div className="card-header">
          <strong>Add a new word</strong>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="word-input" className="form-label">
                  Word
                </label>
                <input
                  id="word-input"
                  type="text"
                  className="form-control"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g., THIN"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="phonemes-input" className="form-label">
                  Phonemes (comma-separated)
                </label>
                <input
                  id="phonemes-input"
                  type="text"
                  className="form-control"
                  value={newPhonemes}
                  onChange={(e) => setNewPhonemes(e.target.value)}
                  placeholder="θ, ɪ, n"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="hint-input" className="form-label">
                  Hint (optional)
                </label>
                <input
                  id="hint-input"
                  type="text"
                  className="form-control"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  placeholder="θ ɪ n as in THIN"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="difficulty-select" className="form-label">
                  Difficulty
                </label>
                <select
                  id="difficulty-select"
                  className="form-select"
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value)}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3"
              name="add-word-button"
            >
              + Add Word
            </button>
          </form>
        </div>
      </div>

      {/* Word list table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Word List ({words.length})</strong>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchWords}
          >
            Refresh
          </button>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <p className="p-3 mb-0">Loading…</p>
          ) : words.length === 0 ? (
            <p className="p-3 mb-0 text-muted">
              No words yet. Add one above.
            </p>
          ) : (
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Phonemes</th>
                  <th>Hint</th>
                  <th>Difficulty</th>
                  <th style={{ width: '180px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {words.map((w) => (
                  <tr key={w.id} data-testid={`word-row-${w.word}`}>
                    <td>
                      <strong>{w.word}</strong>
                    </td>
                    <td>
                      <code>{w.phonemes.join(' ')}</code>
                    </td>
                    <td>
                      {editingId === w.id ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editHint}
                          onChange={(e) => setEditHint(e.target.value)}
                        />
                      ) : (
                        <span className="text-muted">{w.hint || '—'}</span>
                      )}
                    </td>
                    <td>
                      {editingId === w.id ? (
                        <select
                          className="form-select form-select-sm"
                          value={editDifficulty}
                          onChange={(e) => setEditDifficulty(e.target.value)}
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      ) : (
                        <span className="badge bg-secondary">{w.difficulty}</span>
                      )}
                    </td>
                    <td>
                      {editingId === w.id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-1"
                            onClick={() => handleUpdate(w.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => startEdit(w)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(w.id, w.word)}
                            data-testid={`delete-${w.word}`}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}