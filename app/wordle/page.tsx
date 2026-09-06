'use client';

import { useState } from 'react';
import WordleGame from '../Components/WordleGame';
import GenerateHTML from '../Components/GenerateHTML';
import PhonemeKeyboard from '../Components/PhonemKeyboard';

// HCE Word List - 3 phoneme words
const wordList: { word: string; phonemes: string[]; hint: string }[] = [
  { word: 'BED', phonemes: ['b', 'e', 'd'], hint: 'b e d as in BED' },
  { word: 'BID', phonemes: ['b', 'ɪ', 'd'], hint: 'b ɪ d as in BID' },
  { word: 'BAD', phonemes: ['b', 'æ', 'd'], hint: 'b æ d as in BAD' },
  { word: 'BUD', phonemes: ['b', 'ɐ', 'd'], hint: 'b ɐ d as in BUD' },
  { word: 'BIRD', phonemes: ['b', 'ɜː', 'd'], hint: 'b ɜː d as in BIRD' },
  { word: 'BARK', phonemes: ['b', 'ɐː', 'k'], hint: 'b ɐː k as in BARK' },
  { word: 'BOOK', phonemes: ['b', 'ʊ', 'k'], hint: 'b ʊ k as in BOOK' },
  { word: 'BOOT', phonemes: ['b', 'ʉː', 't'], hint: 'b ʉː t as in BOOT' },
  { word: 'BOAT', phonemes: ['b', 'əʉ', 't'], hint: 'b əʉ t as in BOAT' },
  { word: 'BIKE', phonemes: ['b', 'ɑe', 'k'], hint: 'b ɑe k as in BIKE' },
  { word: 'BAIT', phonemes: ['b', 'æɪ', 't'], hint: 'b æɪ t as in BAIT' },
  { word: 'BOIL', phonemes: ['b', 'oɪ', 'l'], hint: 'b oɪ l as in BOIL' },
  { word: 'BEARD', phonemes: ['b', 'ɪə', 'd'], hint: 'b ɪə d as in BEARD' },
  { word: 'THIN', phonemes: ['θ', 'ɪ', 'n'], hint: 'θ ɪ n as in THIN' },
  { word: 'THEN', phonemes: ['ð', 'e', 'n'], hint: 'ð e n as in THEN' },
  { word: 'SHIP', phonemes: ['ʃ', 'ɪ', 'p'], hint: 'ʃ ɪ p as in SHIP' },
  { word: 'CHIN', phonemes: ['tʃ', 'ɪ', 'n'], hint: 'tʃ ɪ n as in CHIN' },
  { word: 'JAM', phonemes: ['dʒ', 'æ', 'm'], hint: 'dʒ æ m as in JAM' },
  { word: 'YES', phonemes: ['j', 'e', 's'], hint: 'j e s as in YES' },
  { word: 'WIN', phonemes: ['w', 'ɪ', 'n'], hint: 'w ɪ n as in WIN' },
  { word: 'RING', phonemes: ['ɹ', 'ɪ', 'ŋ'], hint: 'ɹ ɪ ŋ as in RING' },
  { word: 'LOG', phonemes: ['l', 'ɔ', 'ɡ'], hint: 'l ɔ ɡ as in LOG' },
  { word: 'FAN', phonemes: ['f', 'æ', 'n'], hint: 'f æ n as in FAN' },
  { word: 'VAN', phonemes: ['v', 'æ', 'n'], hint: 'v æ n as in VAN' },
  { word: 'SUN', phonemes: ['s', 'ɐ', 'n'], hint: 's ɐ n as in SUN' },
  { word: 'ZIP', phonemes: ['z', 'ɪ', 'p'], hint: 'z ɪ p as in ZIP' },
  { word: 'GUM', phonemes: ['ɡ', 'ɐ', 'm'], hint: 'ɡ ɐ m as in GUM' },
  { word: 'HAT', phonemes: ['h', 'æ', 't'], hint: 'h æ t as in HAT' },
  { word: 'FORK', phonemes: ['f', 'oː', 'k'], hint: 'f oː k as in FORK' },
];

export default function WordlePage() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPhonemes, setSelectedPhonemes] = useState<string[]>([]);
  const [useAutoHint, setUseAutoHint] = useState(true);
  const [wordleData, setWordleData] = useState({
    word: 'THIN',
    phoneme: '/θɪn/',
    hint: 'θ ɪ n as in THIN',
    maxAttempts: 6
  });
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [debugMessage, setDebugMessage] = useState('');

  // Add phoneme to the word being built
  const addPhoneme = (phoneme: string) => {
    setSelectedPhonemes([...selectedPhonemes, phoneme]);
    setDebugMessage('');
  };

  // Clear selected phonemes
  const clearPhonemes = () => {
    setSelectedPhonemes([]);
    setDebugMessage('');
  };

  // Remove last phoneme
  const removeLastPhoneme = () => {
    if (selectedPhonemes.length > 0) {
      setSelectedPhonemes(selectedPhonemes.slice(0, -1));
      setDebugMessage('');
    }
  };

  // Find the best matching word
  const findMatchingWord = (phonemes: string[]): { word: string; phoneme: string; hint: string } | null => {
    if (phonemes.length === 0) return null;

    // Try to find exact match
    for (const entry of wordList) {
      const matches = entry.phonemes.every((p, index) => {
        return index < phonemes.length && phonemes[index] === p;
      });

      if (matches && phonemes.length === entry.phonemes.length) {
        const phonemeStr = phonemes.join('');
        return {
          word: entry.word,
          phoneme: `/${phonemeStr}/`,
          hint: entry.hint
        };
      }
    }

    // Try partial match
    for (const entry of wordList) {
      const matches = entry.phonemes.every((p, index) => {
        return index < phonemes.length && phonemes[index] === p;
      });

      if (matches && phonemes.length < entry.phonemes.length) {
        const phonemeStr = phonemes.join('');
        return {
          word: entry.word,
          phoneme: `/${phonemeStr}/`,
          hint: `${phonemeStr} as in ${entry.word}`
        };
      }
    }

    // No match found
    const phonemeStr = phonemes.join('');
    const displayWord = phonemeStr.toUpperCase();
    
    if (phonemes.length === 1) {
      const singlePhonemeMap: { [key: string]: string } = {
        'b': 'BED', 'e': 'BED', 'd': 'BED',
        'ɪ': 'BID', 'æ': 'HAT', 'ɐ': 'SUN',
        'θ': 'THIN', 'ʃ': 'SHIP', 'tʃ': 'CHIN',
        'dʒ': 'JAM', 'j': 'YES', 'w': 'WIN',
        'ɹ': 'RING', 'l': 'LOG', 'f': 'FAN',
        'v': 'VAN', 's': 'SUN', 'z': 'ZIP',
        'ɡ': 'GUM', 'h': 'HAT'
      };
      const foundWord = singlePhonemeMap[phonemes[0]];
      if (foundWord) {
        return {
          word: foundWord,
          phoneme: `/${phonemes[0]}/`,
          hint: `${phonemes[0]} as in ${foundWord}`
        };
      }
    }

    return {
      word: displayWord,
      phoneme: `/${phonemeStr}/`,
      hint: `${phonemeStr} as in ${displayWord}`
    };
  };

  const handleGenerate = () => {
    if (selectedPhonemes.length === 0) {
      setDebugMessage('⚠️ Please select at least one phoneme!');
      return;
    }

    if (useAutoHint) {
      // Auto-generate from phonemes
      const match = findMatchingWord(selectedPhonemes);
      if (match) {
        setWordleData({
          word: match.word,
          phoneme: match.phoneme,
          hint: match.hint,
          maxAttempts: 6
        });
        
        if (selectedPhonemes.length >= 3 && match.word !== selectedPhonemes.join('').toUpperCase()) {
          setDebugMessage(`✅ Found: ${match.word} (${match.phoneme})`);
        } else if (selectedPhonemes.length >= 2) {
          setDebugMessage(`🔍 Matching: ${match.phoneme} → ${match.word}`);
        }
      } else {
        setDebugMessage('⚠️ No matching word found. Try different phonemes.');
      }
    } else {
      // Use manual values - keep what the user typed
      // Just validate that there's something entered
      if (!wordleData.word || !wordleData.phoneme) {
        setDebugMessage('⚠️ Please enter both a word and phoneme symbol.');
        return;
      }
      setDebugMessage(`✅ Using manual: ${wordleData.word} (${wordleData.phoneme})`);
    }

    const html = generateWordleHTML(wordleData);
    setGeneratedHTML(html);
    setShowPreview(true);
  };

  const updateField = (field: string, value: string) => {
    setWordleData({ ...wordleData, [field]: value });
  };

  // --- HTML Generation ---
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

  return (
    <div>
      <h1 className="mb-4" style={{ color: 'var(--text-color)' }}>🎮 Create Wordle Activity</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Build Your Wordle</h5>
          
          {/* Phoneme Keyboard */}
          <div className="mb-3">
            <label className="form-label">Click phonemes to build a word (3-5 phonemes):</label>
            <PhonemeKeyboard 
              onPhonemeSelect={addPhoneme}
              selectedPhonemes={selectedPhonemes}
            />
            
            <div className="mt-2">
              <strong>Selected phonemes: </strong>
              {selectedPhonemes.length > 0 ? (
                <span className="badge bg-primary p-2">
                  {selectedPhonemes.join(' ')}
                </span>
              ) : (
                <span className="text-muted">Click phonemes above</span>
              )}
              <button 
                onClick={removeLastPhoneme}
                className="btn btn-outline-warning btn-sm ms-2"
                disabled={selectedPhonemes.length === 0}
              >
                ⌫ Backspace
              </button>
              <button 
                onClick={clearPhonemes}
                className="btn btn-outline-danger btn-sm ms-1"
                disabled={selectedPhonemes.length === 0}
              >
                ✕ Clear
              </button>
            </div>

            {/* Toggle auto/manual hint */}
            <div className="mt-2">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoHintSwitch"
                  checked={useAutoHint}
                  onChange={() => setUseAutoHint(!useAutoHint)}
                />
                <label className="form-check-label" htmlFor="autoHintSwitch">
                  {useAutoHint ? '🔮 Auto-generate hint from phonemes' : '✏️ Use manual hint (edit below)'}
                </label>
              </div>
              <small className="text-muted">
                {useAutoHint 
                  ? 'Hint will be generated from selected phonemes' 
                  : 'You can edit the hint fields below'}
              </small>
            </div>

            {/* Debug message */}
            {debugMessage && (
              <div className="mt-2 alert alert-info py-1" style={{ fontSize: '0.9rem' }}>
                {debugMessage}
              </div>
            )}
          </div>

          <hr />

          {/* Manual Input */}
          <div className="mb-3">
            <label className="form-label">
              {useAutoHint ? 'Preview (auto-generated):' : 'Enter manually:'}
            </label>
            <div className="row">
              <div className="col-md-4">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={wordleData.word}
                  onChange={(e) => updateField('word', e.target.value)}
                  placeholder="Word (e.g., THIN)"
                  disabled={useAutoHint}
                  style={useAutoHint ? { opacity: 0.7 } : {}}
                />
                <small className="text-muted">English word</small>
              </div>
              <div className="col-md-4">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={wordleData.phoneme}
                  onChange={(e) => updateField('phoneme', e.target.value)}
                  placeholder="Phoneme (e.g., /θ/)"
                  disabled={useAutoHint}
                  style={useAutoHint ? { opacity: 0.7 } : {}}
                />
                <small className="text-muted">IPA symbol</small>
              </div>
              <div className="col-md-4">
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={wordleData.hint}
                  onChange={(e) => updateField('hint', e.target.value)}
                  placeholder="Hint (e.g., θ as in THIN)"
                  disabled={useAutoHint}
                  style={useAutoHint ? { opacity: 0.7 } : {}}
                />
                <small className="text-muted">Hint</small>
              </div>
            </div>
            {useAutoHint && (
              <small className="text-muted d-block mt-1">
                💡 Turn off "Auto-generate" to edit these fields manually
              </small>
            )}
          </div>
          
          <button 
            onClick={handleGenerate}
            className="btn btn-success mt-2"
            disabled={selectedPhonemes.length === 0 && !useAutoHint}
          >
            🚀 Generate & Preview
          </button>
          {selectedPhonemes.length === 0 && useAutoHint && (
            <small className="text-danger d-block mt-1">Select at least one phoneme first!</small>
          )}
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