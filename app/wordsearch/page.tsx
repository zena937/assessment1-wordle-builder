'use client';

import { useState } from 'react';
import WordSearch from '../Components/WordSearch';
import GenerateHTML from '../Components/GenerateHTML';

export default function WordSearchPage() {
  const [words, setWords] = useState(['TH', 'SH', 'CH', 'NG', 'PH']);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState('');

  const handleGenerate = () => {
    const html = generateWordSearchHTML(words);
    setGeneratedHTML(html);
    setShowPreview(true);
  };

  const addWord = () => {
    const newWord = prompt('Enter a new phoneme word (e.g., TH, SH, CH, NG, PH):');
    if (newWord && newWord.trim()) {
      const upperWord = newWord.trim().toUpperCase();
      if (!words.includes(upperWord)) {
        setWords([...words, upperWord]);
      } else {
        alert('This word already exists in the list!');
      }
    }
  };

  const removeWord = (index: number) => {
    if (words.length <= 3) {
      alert('Please keep at least 3 words in the list.');
      return;
    }
    setWords(words.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1 className="mb-4" style={{ color: 'var(--text-color)' }}>🔍 Create Word Search</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Configure Your Word Search</h5>
          
          <div className="mb-3">
            <label className="form-label">Phoneme Word List</label>
            <div className="d-flex flex-wrap gap-2 p-2 border rounded" style={{ minHeight: '60px', background: 'var(--bg-color)' }}>
              {words.map((word, index) => (
                <span key={index} className="badge bg-primary p-2 d-inline-flex align-items-center">
                  {word}
                  <button 
                    onClick={() => removeWord(index)}
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: '0.6rem' }}
                    aria-label="Remove word"
                  ></button>
                </span>
              ))}
              {words.length === 0 && (
                <span className="text-muted">No words added yet</span>
              )}
            </div>
            <button onClick={addWord} className="btn btn-outline-primary btn-sm mt-2">
              + Add Phoneme Word
            </button>
            <small className="text-muted d-block mt-1">
              Add at least 3 phoneme words (e.g., TH, SH, CH, NG, PH)
            </small>
          </div>
          
          <button 
            onClick={handleGenerate}
            className="btn btn-success"
            disabled={words.length < 3}
          >
            🚀 Generate & Preview
          </button>
          {words.length < 3 && (
            <small className="text-danger d-block mt-1">Add at least 3 words to generate</small>
          )}
        </div>
      </div>
      
      {showPreview && (
        <div className="card">
          <div className="card-body">
            <h5>📱 Preview</h5>
            <WordSearch words={words} />
            <hr />
            <GenerateHTML 
              htmlContent={generatedHTML} 
              filename="wordsearch-activity.html"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function generateWordSearchHTML(words: string[]): string {
  const gridSize = Math.max(12, Math.max(...words.map(w => w.length)) + 3);
  const grid = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill(null).map(() => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  );
  
  words.forEach((word, idx) => {
    const row = idx % gridSize;
    if (word.length < gridSize) {
      for (let i = 0; i < word.length; i++) {
        grid[row][i] = word[i];
      }
    }
  });

  const phonemeMap: { [key: string]: string } = {
    'TH': '/θ/',
    'SH': '/ʃ/',
    'CH': '/tʃ/',
    'NG': '/ŋ/',
    'PH': '/f/',
    'WH': '/w/',
    'ZH': '/ʒ/',
    'DH': '/ð/'
  };

  const gridHTML = grid.map(row => 
    row.map(cell => `<span class="cell">${cell}</span>`).join('')
  ).map(row => `<div class="row">${row}</div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phoneme Word Search</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            text-align: center; 
            padding: 40px 20px; 
            max-width: 700px; 
            margin: 0 auto; 
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; margin-bottom: 10px; }
        .grid { 
            display: inline-block; 
            margin: 20px auto;
            background: white;
            padding: 10px;
            border-radius: 8px;
        }
        .row { display: flex; }
        .cell { 
            width: 40px; 
            height: 40px; 
            border: 1px solid #ddd; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 1.3rem; 
            font-weight: bold;
            background: white;
            transition: background 0.3s;
        }
        .cell:hover { background: #e3f2fd; }
        .word-list { margin-top: 25px; }
        .word-list span { 
            display: inline-block; 
            margin: 5px 8px; 
            padding: 8px 18px; 
            background: #e8f5e9; 
            border-radius: 20px;
            cursor: help;
            transition: all 0.3s;
            border: 2px solid transparent;
            font-weight: bold;
        }
        .word-list span:hover { 
            background: #c8e6c9;
            border-color: #4CAF50;
            transform: scale(1.05);
        }
        .word-list .phoneme-hint {
            display: none;
            font-size: 0.8rem;
            color: #666;
            margin-left: 5px;
        }
        .word-list span:hover .phoneme-hint {
            display: inline;
        }
        .hint {
            background: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ff9800;
        }
        .hint strong { color: #e65100; }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 0.8rem;
        }
        @media (max-width: 500px) {
            .cell { width: 30px; height: 30px; font-size: 1rem; }
            .container { padding: 20px; }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>🔍 Phoneme Word Search</h1>
    <div class="hint">
        💡 Find these phoneme sounds: 
        ${words.map(w => `<strong>${phonemeMap[w] || '/θ/'}</strong> (${w})`).join(', ')}
        <br>
        <span style="font-size: 0.9rem;">Hover over a phoneme below to see its pronunciation</span>
    </div>
    <div class="grid">
        ${gridHTML}
    </div>
    <div class="word-list">
        <p><strong>Find these phoneme words:</strong></p>
        ${words.map(w => `
            <span title="${phonemeMap[w] || '/θ/'} as in ${w}">
                ${w}
                <span class="phoneme-hint">(${phonemeMap[w] || '/θ/'})</span>
            </span>
        `).join('')}
    </div>
    <div class="footer">Phoneme Activity Builder - Assessment 1</div>
</div>
</body>
</html>`;
}