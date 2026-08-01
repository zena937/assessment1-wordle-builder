'use client';

import { useState } from 'react';
import WordleGame from '../Components/WordleGame';
import GenerateHTML from '../Components/GenerateHTML';

export default function WordlePage() {
  const [showPreview, setShowPreview] = useState(false);
  const [wordleData, setWordleData] = useState({
    word: 'TH',
    phoneme: '/θ/',
    hint: 'TH as in thin',
    maxAttempts: 6
  });
  const [generatedHTML, setGeneratedHTML] = useState('');

  const handleGenerate = () => {
    const html = generateWordleHTML(wordleData);
    setGeneratedHTML(html);
    setShowPreview(true);
  };

  const updateField = (field: string, value: string) => {
    setWordleData({ ...wordleData, [field]: value.toUpperCase() });
  };

  return (
    <div>
      <h1 className="mb-4" style={{ color: 'var(--text-color)' }}>🎮 Create Wordle Activity</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Configure Your Wordle</h5>
          
          <div className="mb-3">
            <label className="form-label">Phoneme Word</label>
            <input 
              type="text" 
              className="form-control" 
              value={wordleData.word}
              onChange={(e) => updateField('word', e.target.value)}
              placeholder="e.g., TH"
            />
            <small className="text-muted">Enter the phoneme representation</small>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Phoneme Symbol (IPA)</label>
            <input 
              type="text" 
              className="form-control" 
              value={wordleData.phoneme}
              onChange={(e) => setWordleData({...wordleData, phoneme: e.target.value})}
              placeholder="e.g., /θ/"
            />
            <small className="text-muted">International Phonetic Alphabet symbol</small>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Hint (English Equivalent)</label>
            <input 
              type="text" 
              className="form-control" 
              value={wordleData.hint}
              onChange={(e) => setWordleData({...wordleData, hint: e.target.value})}
              placeholder="e.g., TH as in thin"
            />
            <small className="text-muted">Shows the English word equivalent</small>
          </div>
          
          <button 
            onClick={handleGenerate}
            className="btn btn-success"
          >
            🚀 Generate & Preview
          </button>
        </div>
      </div>
      
      {showPreview && (
        <div className="card">
          <div className="card-body">
            <h5>📱 Preview</h5>
            <WordleGame wordleData={wordleData} />
            <hr />
            <GenerateHTML 
              htmlContent={generatedHTML} 
              filename={`wordle-${wordleData.word.toLowerCase()}.html`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function generateWordleHTML(data: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phoneme Wordle - ${data.word}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            text-align: center; 
            padding: 40px 20px; 
            max-width: 600px; 
            margin: 0 auto; 
            background: #f5f5f5;
            color: #333;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; margin-bottom: 10px; }
        .phoneme-display { 
            font-size: 4rem; 
            color: #4CAF50; 
            margin: 20px 0;
            font-weight: bold;
            background: #e8f5e9;
            padding: 20px;
            border-radius: 12px;
        }
        .hint { 
            color: #666; 
            margin: 15px 0 25px; 
            font-size: 1.1rem;
            padding: 10px;
            background: #fff3e0;
            border-radius: 8px;
            border-left: 4px solid #ff9800;
        }
        .input-group {
            display: flex;
            gap: 10px;
            max-width: 400px;
            margin: 20px auto;
            justify-content: center;
        }
        input { 
            padding: 12px 20px; 
            font-size: 1.2rem; 
            flex: 1;
            border: 2px solid #ddd;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.3s;
        }
        input:focus { border-color: #4CAF50; }
        input:disabled { opacity: 0.5; }
        button { 
            padding: 12px 30px; 
            font-size: 1.2rem; 
            background: #4CAF50; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer;
            transition: background 0.3s;
            font-weight: bold;
        }
        button:hover:not(:disabled) { background: #388E3C; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .feedback { 
            margin-top: 20px; 
            padding: 15px; 
            background: #f0f0f0; 
            border-radius: 8px;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
        }
        .correct { color: #4CAF50; font-weight: bold; }
        .wrong { color: #f44336; font-weight: bold; }
        .attempts { 
            margin-top: 15px; 
            color: #666;
            font-size: 0.9rem;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>🎯 Phoneme Wordle</h1>
    <p style="color: #666;">Find the English word containing this phoneme:</p>
    <div class="phoneme-display">${data.phoneme}</div>
    <div class="hint">💡 ${data.hint}</div>
    
    <div class="input-group">
        <input type="text" id="guessInput" placeholder="Enter your guess..." onkeypress="if(event.key==='Enter') checkGuess()">
        <button onclick="checkGuess()">Guess</button>
    </div>
    <div id="feedback" class="feedback">Enter a word to start playing!</div>
    <div id="attempts" class="attempts">Attempts: 0 / ${data.maxAttempts}</div>
    <div class="footer">Phoneme Activity Builder - Assessment 1</div>
</div>

<script>
    const answer = '${data.word}';
    let attempts = 0;
    const maxAttempts = ${data.maxAttempts};
    const feedbackEl = document.getElementById('feedback');
    const attemptsEl = document.getElementById('attempts');
    const inputEl = document.getElementById('guessInput');
    
    function checkGuess() {
        const guess = inputEl.value.toUpperCase().trim();
        
        if (!guess) {
            feedbackEl.innerHTML = '⚠️ Please enter a word.';
            return;
        }
        
        attempts++;
        attemptsEl.textContent = \`Attempts: \${attempts} / \${maxAttempts}\`;
        
        if (guess === answer) {
            feedbackEl.innerHTML = '🎉 <span class="correct">Correct!</span> The answer is <strong>' + answer + '</strong> (' + '${data.phoneme}' + ' as in ${data.hint}).';
            feedbackEl.className = 'feedback correct';
            inputEl.disabled = true;
            document.querySelector('button').disabled = true;
            return;
        }
        
        if (attempts >= maxAttempts) {
            feedbackEl.innerHTML = '❌ <span class="wrong">Game Over!</span> The answer was <strong>' + answer + '</strong> (' + '${data.phoneme}' + ' as in ${data.hint}).';
            feedbackEl.className = 'feedback wrong';
            inputEl.disabled = true;
            document.querySelector('button').disabled = true;
            return;
        }
        
        feedbackEl.innerHTML = \`❌ Try again! Attempt \${attempts} of \${maxAttempts}.\`;
        feedbackEl.className = 'feedback';
    }
</script>
</body>
</html>`;
}