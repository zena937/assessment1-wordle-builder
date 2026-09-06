'use client';

import { useState, useEffect } from 'react';
import PhonemeKeyboard from './PhonemKeyboard';
import WordSearch from './WordSearch';
import GenerateHTML from './GenerateHTML';

interface WordSearchWord {
  id: string;
  phonemes: string[];
  display: string;
}

const WordSearchBuilder = () => {
  const [words, setWords] = useState<WordSearchWord[]>([
    { id: '1', phonemes: ['θ', 'ɪ', 'n'], display: 'THIN' },
    { id: '2', phonemes: ['ʃ', 'ɪ', 'p'], display: 'SHIP' },
    { id: '3', phonemes: ['tʃ', 'ɪ', 'n'], display: 'CHIN' },
    { id: '4', phonemes: ['dʒ', 'æ', 'm'], display: 'JAM' },
    { id: '5', phonemes: ['f', 'æ', 'n'], display: 'FAN' }
  ]);
  const [currentPhonemes, setCurrentPhonemes] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [apiWords, setApiWords] = useState<WordSearchWord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch words from API on component mount
  useEffect(() => {
    fetch('/api/words')
      .then(res => res.json())
      .then(data => {
        // Convert API data to WordSearchWord format
        const formatted = data.map((word: any) => ({
          id: word.id,
          phonemes: Array.isArray(word.phonemes) ? word.phonemes : JSON.parse(word.phonemes),
          display: word.word
        }));
        setApiWords(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch words:', err);
        setLoading(false);
      });
  }, []);

  // Add phoneme to current word being built
  const addPhoneme = (phoneme: string) => {
    setCurrentPhonemes([...currentPhonemes, phoneme]);
  };

  // Clear current phonemes
  const clearCurrentPhonemes = () => {
    setCurrentPhonemes([]);
  };

  // Remove last phoneme (backspace)
  const removeLastPhoneme = () => {
    if (currentPhonemes.length > 0) {
      setCurrentPhonemes(currentPhonemes.slice(0, -1));
    }
  };

  // Add current phonemes as a word to the list
  const addWordToList = () => {
    if (currentPhonemes.length < 2) {
      alert('Please select at least 2 phonemes to form a word.');
      return;
    }

    const displayName = currentPhonemes.join('').toUpperCase();
    
    if (words.some(w => w.display === displayName)) {
      alert(`"${displayName}" is already in the list!`);
      return;
    }

    const newWord: WordSearchWord = {
      id: Date.now().toString(),
      phonemes: [...currentPhonemes],
      display: displayName
    };

    setWords([...words, newWord]);
    setCurrentPhonemes([]);
  };

  // Remove a word from the list
  const removeWord = (id: string) => {
    if (words.length <= 3) {
      alert('Please keep at least 3 words in the list.');
      return;
    }
    setWords(words.filter(w => w.id !== id));
  };

  // Get phoneme label (e.g., "TH" for /θ/)
  const getPhonemeLabel = (phoneme: string): string => {
    const labels: { [key: string]: string } = {
      'θ': 'TH', 'ʃ': 'SH', 'ð': 'DH', 'ʒ': 'ZH', 'tʃ': 'CH',
      'dʒ': 'J', 'ŋ': 'NG', 'ɹ': 'R', 'j': 'Y', 'iː': 'EE',
      'ɪ': 'I', 'eː': 'AY', 'æ': 'A', 'ɐ': 'U', 'ɐː': 'AR',
      'ɜː': 'ER', 'ʉː': 'OO', 'ɔ': 'O', 'oː': 'OR', 'ʊ': 'U',
      'æɪ': 'AI', 'ɑe': 'IE', 'oɪ': 'OI', 'əʉ': 'OU',
      'æɔ': 'OW', 'ɪə': 'EAR', 'ə': 'UH'
    };
    return labels[phoneme] || phoneme;
  };

  // --- THIS IS THE FUNCTION YOU REPLACED ---
  function generateWordSearchHTML(wordList: string[], fullWords: WordSearchWord[]): string {
    const gridSize = Math.max(12, Math.max(...wordList.map(w => w.length)) + 3);
    
    // Create grid with random letters
    const grid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );
    
    // Store word positions
    const wordPositions: { [key: string]: { row: number; col: number }[] } = {};
    
    // Place words in 8 directions
    const placeWord = (word: string, startRow: number, startCol: number, dRow: number, dCol: number) => {
      const pos: { row: number; col: number }[] = [];
      for (let i = 0; i < word.length; i++) {
        const row = startRow + i * dRow;
        const col = startCol + i * dCol;
        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
          grid[row][col] = word[i];
          pos.push({ row, col });
        } else {
          return null;
        }
      }
      return pos;
    };

    // Place each word randomly (8 directions)
    wordList.forEach((word) => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        const directions = [
          [0, 1], [1, 0], [1, 1], [1, -1],
          [0, -1], [-1, 0], [-1, -1], [-1, 1]
        ];
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const pos = placeWord(word, row, col, dir[0], dir[1]);
        if (pos) {
          wordPositions[word] = pos;
          placed = true;
        }
        attempts++;
      }
      // Fallback: place horizontally
      if (!placed) {
        const row = Math.floor(Math.random() * gridSize);
        const pos: { row: number; col: number }[] = [];
        for (let i = 0; i < word.length && i < gridSize; i++) {
          grid[row][i] = word[i];
          pos.push({ row, col: i });
        }
        wordPositions[word] = pos;
      }
    });

    // Build grid HTML
    let gridHTML = '';
    for (let r = 0; r < gridSize; r++) {
      gridHTML += '<div class="row">';
      for (let c = 0; c < gridSize; c++) {
        gridHTML += `<div class="grid-cell" data-row="${r}" data-col="${c}">${grid[r][c]}</div>`;
      }
      gridHTML += '</div>';
    }

    // Build word list HTML with phoneme hints
    let wordListHTML = '';
    fullWords.forEach((w) => {
      const label = w.phonemes.map(p => getPhonemeLabel(p)).join('');
      wordListHTML += `
        <span class="word-item" data-word="${w.display}" onclick="toggleWord('${w.display}')">
          ${label}
          <span class="phoneme-hint">(${w.phonemes.join(' ')} as in ${w.display})</span>
        </span>
      `;
    });

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
            user-select: none;
            touch-action: none;
        }
        .row { display: flex; justify-content: center; }
        .grid-cell { 
            width: 40px; 
            height: 40px; 
            border: 1px solid #ddd; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 1.3rem; 
            font-weight: bold;
            background: white;
            transition: background 0.2s;
            cursor: pointer;
            margin: 1px;
            border-radius: 4px;
        }
        .grid-cell.selected {
            background: #bbdefb;
            border-color: #0d6efd;
            box-shadow: inset 0 0 0 2px #0d6efd;
        }
        .grid-cell.found {
            background: #c8e6c9;
            color: #2e7d32;
        }
        .grid-cell:hover {
            background: #e3f2fd;
        }
        
        .hint {
            background: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ff9800;
        }
        
        .word-list { margin-top: 25px; }
        .word-item { 
            display: inline-block; 
            margin: 5px 8px; 
            padding: 8px 18px; 
            background: #e8f5e9; 
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s;
            border: 2px solid transparent;
            font-weight: bold;
        }
        .word-item.found {
            background: #c8e6c9;
            text-decoration: line-through;
            opacity: 0.7;
            border-color: #4CAF50;
        }
        .word-item:hover { 
            background: #c8e6c9;
            border-color: #4CAF50;
            transform: scale(1.05);
        }
        .phoneme-hint {
            display: none;
            font-size: 0.8rem;
            color: #666;
            margin-left: 5px;
        }
        .word-item:hover .phoneme-hint {
            display: inline;
        }
        
        .progress-container {
            margin: 15px 0;
        }
        .progress-bar {
            width: 100%;
            height: 10px;
            background: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #4CAF50;
            transition: width 0.3s ease;
            border-radius: 5px;
        }
        .status-text {
            margin-top: 5px;
            font-size: 0.9rem;
            color: #666;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 0.8rem;
        }
        
        .btn-reset {
            margin-top: 15px;
            padding: 10px 30px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
        }
        .btn-reset:hover {
            background: #5a6268;
        }
        
        .victory {
            margin-top: 15px;
            padding: 15px;
            background: #4CAF50;
            color: white;
            border-radius: 8px;
            font-size: 1.2rem;
            display: none;
        }
        .victory.show {
            display: block;
        }
        
        @media (max-width: 500px) {
            .grid-cell { width: 30px; height: 30px; font-size: 1rem; }
            .container { padding: 20px; }
        }
    </style>
</head>
<body>
<div class="container">
    <h1>🔍 Phoneme Word Search</h1>
    
    <div class="hint">
        💡 <strong>How to play:</strong> Click and drag across letters to select a word. 
        If it matches a word in the list, it will be crossed off!
    </div>
    
    <div class="progress-container">
        <div class="status-text">Found: <span id="foundCount">0</span> / ${wordList.length} words</div>
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill" style="width: 0%"></div>
        </div>
    </div>
    
    <div class="grid" id="gridContainer">
        ${gridHTML}
    </div>
    
    <div id="selectedWordDisplay" style="margin: 10px 0; min-height: 30px;"></div>
    
    <div class="word-list">
        <p><strong>Find these phoneme words:</strong></p>
        ${wordListHTML}
    </div>
    
    <div class="victory" id="victoryMessage">
        🎉🎊 CONGRATULATIONS! You found all ${wordList.length} words! 🎊🎉
    </div>
    
    <button class="btn-reset" onclick="resetGame()">🔄 Reset Game</button>
    
    <div class="footer">Phoneme Activity Builder - Assessment 1</div>
</div>

<script>
    // === GAME STATE ===
    const wordList = ${JSON.stringify(wordList)};
    const wordPositions = ${JSON.stringify(wordPositions)};
    const gridSize = ${gridSize};
    
    let foundWords = [];
    let selectedCells = [];
    let isSelecting = false;
    let isMouseDown = false;
    
    // === DOM REFS ===
    const gridContainer = document.getElementById('gridContainer');
    const foundCountEl = document.getElementById('foundCount');
    const progressFill = document.getElementById('progressFill');
    const victoryMessage = document.getElementById('victoryMessage');
    const selectedWordDisplay = document.getElementById('selectedWordDisplay');
    
    // === UTILITY FUNCTIONS ===
    function isWordFound(word) {
        return foundWords.includes(word);
    }
    
    function isCellFound(row, col) {
        for (const word of foundWords) {
            const positions = wordPositions[word];
            if (positions) {
                for (const pos of positions) {
                    if (pos.row === row && pos.col === col) return true;
                }
            }
        }
        return false;
    }
    
    function isCellSelected(row, col) {
        return selectedCells.some(pos => pos.row === row && pos.col === col);
    }
    
    function getSelectedWord() {
        if (selectedCells.length < 2) return '';
        return selectedCells.map(pos => {
            const cell = document.querySelector(\`.grid-cell[data-row="\${pos.row}"][data-col="\${pos.col}"]\`);
            return cell ? cell.textContent : '';
        }).join('');
    }
    
    function updateProgress() {
        const count = foundWords.length;
        foundCountEl.textContent = count;
        const percent = wordList.length > 0 ? (count / wordList.length) * 100 : 0;
        progressFill.style.width = percent + '%';
        
        if (count === wordList.length && wordList.length > 0) {
            victoryMessage.classList.add('show');
        } else {
            victoryMessage.classList.remove('show');
        }
        
        // Update word items
        document.querySelectorAll('.word-item').forEach(el => {
            const word = el.dataset.word;
            if (isWordFound(word)) {
                el.classList.add('found');
            } else {
                el.classList.remove('found');
            }
        });
        
        // Update grid cells
        document.querySelectorAll('.grid-cell').forEach(el => {
            const row = parseInt(el.dataset.row);
            const col = parseInt(el.dataset.col);
            if (isCellFound(row, col)) {
                el.classList.add('found');
            } else {
                el.classList.remove('found');
            }
        });
    }
    
    function checkSelectedWord() {
        const selectedWord = getSelectedWord();
        if (selectedWord.length < 2) {
            clearSelection();
            return;
        }
        
        const matchedWord = wordList.find(w => w === selectedWord);
        if (matchedWord && !isWordFound(matchedWord)) {
            foundWords.push(matchedWord);
            updateProgress();
            selectedWordDisplay.innerHTML = \`✅ Found "<strong>\${matchedWord}</strong>"!\`;
            selectedWordDisplay.style.color = '#4CAF50';
        } else if (matchedWord && isWordFound(matchedWord)) {
            selectedWordDisplay.innerHTML = \`⚠️ Already found "\${matchedWord}"\`;
            selectedWordDisplay.style.color = '#ff9800';
        } else if (selectedWord.length >= 3) {
            selectedWordDisplay.innerHTML = \`❌ "\${selectedWord}" is not in the word list\`;
            selectedWordDisplay.style.color = '#f44336';
        }
        
        clearSelection();
        isSelecting = false;
        isMouseDown = false;
    }
    
    function clearSelection() {
        document.querySelectorAll('.grid-cell.selected').forEach(el => {
            el.classList.remove('selected');
        });
        selectedCells = [];
        if (!selectedWordDisplay.innerHTML.includes('✅')) {
            selectedWordDisplay.textContent = '';
        }
    }
    
    // === MOUSE HANDLERS ===
    function handleMouseDown(e) {
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        if (cell.classList.contains('found')) return;
        
        isMouseDown = true;
        isSelecting = true;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        selectedCells = [{ row, col }];
        cell.classList.add('selected');
        selectedWordDisplay.textContent = '';
    }
    
    function handleMouseEnter(e) {
        if (!isMouseDown || !isSelecting) return;
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;
        if (cell.classList.contains('found')) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const last = selectedCells[selectedCells.length - 1];
        
        if (last) {
            const dRow = Math.abs(row - last.row);
            const dCol = Math.abs(col - last.col);
            if ((dRow <= 1 && dCol <= 1) && !(dRow === 0 && dCol === 0)) {
                if (!isCellSelected(row, col)) {
                    selectedCells.push({ row, col });
                    cell.classList.add('selected');
                    
                    const word = getSelectedWord();
                    if (word.length > 1) {
                        selectedWordDisplay.innerHTML = \`Selecting: <strong>\${word}</strong>\`;
                        selectedWordDisplay.style.color = '#0d6efd';
                    }
                }
            }
        }
    }
    
    function handleMouseUp(e) {
        if (isMouseDown && isSelecting) {
            checkSelectedWord();
        }
        isMouseDown = false;
        isSelecting = false;
    }
    
    function handleMouseLeave(e) {
        // Don't auto-check on leave
    }
    
    // === TOUCH HANDLERS ===
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const cell = element ? element.closest('.grid-cell') : null;
        if (!cell) return;
        if (cell.classList.contains('found')) return;
        
        isSelecting = true;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        selectedCells = [{ row, col }];
        cell.classList.add('selected');
        selectedWordDisplay.textContent = '';
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        if (!isSelecting) return;
        
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const cell = element ? element.closest('.grid-cell') : null;
        if (!cell) return;
        if (cell.classList.contains('found')) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const last = selectedCells[selectedCells.length - 1];
        
        if (last) {
            const dRow = Math.abs(row - last.row);
            const dCol = Math.abs(col - last.col);
            if ((dRow <= 1 && dCol <= 1) && !(dRow === 0 && dCol === 0)) {
                if (!isCellSelected(row, col)) {
                    selectedCells.push({ row, col });
                    cell.classList.add('selected');
                    
                    const word = getSelectedWord();
                    if (word.length > 1) {
                        selectedWordDisplay.innerHTML = \`Selecting: <strong>\${word}</strong>\`;
                        selectedWordDisplay.style.color = '#0d6efd';
                    }
                }
            }
        }
    }
    
    function handleTouchEnd(e) {
        e.preventDefault();
        if (isSelecting) {
            checkSelectedWord();
        }
        isSelecting = false;
    }
    
    // === WORD TOGGLE (click to mark/unmark) ===
    function toggleWord(word) {
        if (isWordFound(word)) {
            foundWords = foundWords.filter(w => w !== word);
            updateProgress();
            selectedWordDisplay.innerHTML = \`↩️ Unmarked "\${word}"\`;
            selectedWordDisplay.style.color = '#6c757d';
        } else {
            if (wordList.includes(word)) {
                foundWords.push(word);
                updateProgress();
                selectedWordDisplay.innerHTML = \`✅ Marked "\${word}" as found\`;
                selectedWordDisplay.style.color = '#4CAF50';
            }
        }
        setTimeout(() => {
            if (!selectedWordDisplay.innerHTML.includes('✅')) {
                selectedWordDisplay.textContent = '';
            }
        }, 2000);
    }
    
    // === RESET GAME ===
    function resetGame() {
        foundWords = [];
        clearSelection();
        isSelecting = false;
        isMouseDown = false;
        selectedWordDisplay.textContent = '';
        selectedWordDisplay.style.color = '';
        updateProgress();
        victoryMessage.classList.remove('show');
    }
    
    // === ATTACH EVENTS ===
    document.addEventListener('DOMContentLoaded', () => {
        gridContainer.addEventListener('mousedown', handleMouseDown);
        gridContainer.addEventListener('mouseup', handleMouseUp);
        gridContainer.addEventListener('mouseleave', handleMouseLeave);
        gridContainer.addEventListener('mouseover', handleMouseEnter);
        gridContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        gridContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        gridContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
        updateProgress();
    });
    
    window.toggleWord = toggleWord;
    window.resetGame = resetGame;
</script>
</body>
</html>`;
  }

  // === HANDLE GENERATE ===
  const handleGenerate = () => {
    if (words.length < 3) {
      alert('Please add at least 3 words to generate a puzzle.');
      return;
    }

    const wordList = words.map(w => w.display);
    const html = generateWordSearchHTML(wordList, words);
    setGeneratedHTML(html);
    setShowPreview(true);
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Build Your Word List</h5>
          
          {/* Phoneme Keyboard */}
          <div className="mb-3">
            <label className="form-label">Click phonemes to build a word:</label>
            <PhonemeKeyboard 
              onPhonemeSelect={addPhoneme}
              selectedPhonemes={currentPhonemes}
            />
          </div>

          {/* Current word being built */}
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <div className="border rounded p-2 bg-light">
                <strong>Current word: </strong>
                {currentPhonemes.length > 0 ? (
                  <span className="badge bg-primary p-2 fs-6">
                    {currentPhonemes.map(p => getPhonemeLabel(p)).join('')}
                    <span className="ms-2 text-light opacity-50">
                      ({currentPhonemes.join(' ')})
                    </span>
                  </span>
                ) : (
                  <span className="text-muted">No phonemes selected</span>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex gap-2">
                <button 
                  onClick={addWordToList}
                  className="btn btn-success btn-sm flex-grow-1"
                  disabled={currentPhonemes.length < 2}
                >
                  + Add Word
                </button>
                <button 
                  onClick={removeLastPhoneme}
                  className="btn btn-warning btn-sm"
                  disabled={currentPhonemes.length === 0}
                  title="Remove last phoneme"
                >
                  ⌫
                </button>
                <button 
                  onClick={clearCurrentPhonemes}
                  className="btn btn-danger btn-sm"
                  disabled={currentPhonemes.length === 0}
                  title="Clear all"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Word list */}
          <div className="mb-3">
            <label className="form-label">Word List ({words.length} words):</label>
            <div className="d-flex flex-wrap gap-2 p-2 border rounded" style={{ minHeight: '60px', background: 'var(--bg-color)' }}>
              {words.map((word) => {
                const label = word.phonemes.map(p => getPhonemeLabel(p)).join('');
                return (
                  <span key={word.id} className="badge bg-primary p-2 d-inline-flex align-items-center">
                    {label}
                    <span className="ms-1 opacity-75" style={{ fontSize: '0.7rem' }}>
                      ({word.phonemes.join(' ')})
                    </span>
                    <button 
                      onClick={() => removeWord(word.id)}
                      className="btn-close btn-close-white ms-2"
                      style={{ fontSize: '0.5rem' }}
                      aria-label="Remove word"
                    ></button>
                  </span>
                );
              })}
              {loading ? (
                <span className="text-muted">Loading words from database...</span>
              ) : words.length === 0 ? (
                <span className="text-muted">No words added yet. Build words using the keyboard above.</span>
              ) : null}
            </div>
            <small className="text-muted d-block mt-1">
              Add at least 3 words to generate a puzzle
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
            <WordSearch words={words.map(w => w.display)} />
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
};

export default WordSearchBuilder;