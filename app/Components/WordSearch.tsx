'use client';

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';

interface WordSearchProps {
  words: string[];
}

interface Position {
  row: number;
  col: number;
}

const WordSearch = ({ words }: WordSearchProps) => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPositions, setWordPositions] = useState<{ [key: string]: Position[] }>({});
  const gridRef = useRef<HTMLDivElement>(null);

  // Phoneme mapping for hints
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

  // Generate grid ONCE when component mounts
  useEffect(() => {
    generateGrid();
  }, [words]);

  const generateGrid = () => {
    const gridSize = Math.max(12, Math.max(...words.map(w => w.length)) + 3);
    const newGrid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );

    const positions: { [key: string]: Position[] } = {};

    // Place words in all 8 directions
    const placeWord = (word: string, startRow: number, startCol: number, dRow: number, dCol: number) => {
      const pos: Position[] = [];
      for (let i = 0; i < word.length; i++) {
        const row = startRow + i * dRow;
        const col = startCol + i * dCol;
        if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
          newGrid[row][col] = word[i];
          pos.push({ row, col });
        } else {
          return null;
        }
      }
      return pos;
    };

    // Place words randomly
    words.forEach((word) => {
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
          positions[word] = pos;
          placed = true;
        }
        attempts++;
      }
      if (!placed) {
        // Fallback: place horizontally
        const row = Math.floor(Math.random() * gridSize);
        const pos: Position[] = [];
        for (let i = 0; i < word.length && i < gridSize; i++) {
          newGrid[row][i] = word[i];
          pos.push({ row, col: i });
        }
        positions[word] = pos;
      }
    });

    setGrid(newGrid);
    setWordPositions(positions);
  };

  // Check if a word is found
  const isWordFound = (word: string): boolean => {
    return foundWords.includes(word);
  };

  // Check if a cell is part of a found word
  const isCellInFoundWord = (row: number, col: number): boolean => {
    for (const word of foundWords) {
      const positions = wordPositions[word];
      if (positions) {
        for (const pos of positions) {
          if (pos.row === row && pos.col === col) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Check if a cell is currently selected
  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some(pos => pos.row === row && pos.col === col);
  };

  // Get the word formed by selected cells
  const getSelectedWord = (): string => {
    if (selectedCells.length < 2) return '';
    return selectedCells.map(pos => grid[pos.row]?.[pos.col] || '').join('');
  };

  // Check if selected cells form a valid word
  const checkSelectedWord = () => {
    const selectedWord = getSelectedWord();
    if (selectedWord.length < 2) {
      setSelectedCells([]);
      setIsSelecting(false);
      return;
    }

    // Check if it matches any word in the list
    const matchedWord = words.find(w => w === selectedWord);
    if (matchedWord && !isWordFound(matchedWord)) {
      setFoundWords([...foundWords, matchedWord]);
      // Visual feedback
      const cellElements = document.querySelectorAll('.grid-cell');
      cellElements.forEach(el => {
        el.classList.add('word-found');
        setTimeout(() => el.classList.remove('word-found'), 500);
      });
    } else if (matchedWord && isWordFound(matchedWord)) {
      // Already found
      alert(`You already found "${matchedWord}"!`);
    } else {
      // Not a valid word - show hint but don't be annoying
      if (selectedWord.length >= 3) {
        // Just clear selection silently
      }
    }
    
    setSelectedCells([]);
    setIsSelecting(false);
  };

  // --- Mouse Event Handlers ---
  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      // Check if this cell is adjacent to the last selected cell
      const last = selectedCells[selectedCells.length - 1];
      if (last) {
        const dRow = Math.abs(row - last.row);
        const dCol = Math.abs(col - last.col);
        // Only allow adjacent cells (including diagonals)
        if ((dRow <= 1 && dCol <= 1) && !(dRow === 0 && dCol === 0)) {
          // Check if cell is already selected
          if (!isCellSelected(row, col)) {
            setSelectedCells([...selectedCells, { row, col }]);
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      checkSelectedWord();
    }
  };

  const handleMouseLeave = () => {
    if (isSelecting) {
      checkSelectedWord();
    }
  };

  // --- Touch Event Handlers for Mobile ---
  const handleTouchStart = (row: number, col: number, e: TouchEvent) => {
    e.preventDefault();
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!isSelecting || !gridRef.current) return;
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element) {
      const row = parseInt(element.getAttribute('data-row') || '-1');
      const col = parseInt(element.getAttribute('data-col') || '-1');
      if (row >= 0 && col >= 0 && grid[row] && grid[row][col]) {
        const last = selectedCells[selectedCells.length - 1];
        if (last) {
          const dRow = Math.abs(row - last.row);
          const dCol = Math.abs(col - last.col);
          if ((dRow <= 1 && dCol <= 1) && !(dRow === 0 && dCol === 0)) {
            if (!isCellSelected(row, col)) {
              setSelectedCells([...selectedCells, { row, col }]);
            }
          }
        }
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (isSelecting) {
      checkSelectedWord();
    }
  };

  // Toggle word found status (for clicking on word list)
  const toggleWordFound = (word: string) => {
    if (isWordFound(word)) {
      setFoundWords(foundWords.filter(w => w !== word));
    }
  };

  // If grid is empty, show loading
  if (grid.length === 0) {
    return <div>Loading puzzle...</div>;
  }

  return (
    <div className="text-center">
      {/* Instructions */}
      <div className="alert alert-info small mb-3">
        <strong>How to play:</strong> Click and drag across letters in the grid to select a word. 
        If it matches a word in the list, it will be crossed off!
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted small">
            Found: {foundWords.length} / {words.length} words
          </span>
          <span className="text-muted small">
            {foundWords.length === words.length ? '🎉 All found!' : '👆 Drag across letters to find words'}
          </span>
        </div>
        <div className="progress" style={{ height: '10px' }}>
          <div 
            className="progress-bar bg-success" 
            style={{ 
              width: `${(foundWords.length / words.length) * 100}%`,
              transition: 'width 0.3s ease'
            }}
          ></div>
        </div>
      </div>

      {/* Grid */}
      <div 
        ref={gridRef}
        style={{ 
          display: 'inline-block', 
          margin: '20px auto',
          backgroundColor: 'var(--card-bg)',
          padding: '12px',
          borderRadius: '12px',
          border: '2px solid var(--border-color)',
          userSelect: 'none',
          touchAction: 'none'
        }}
        onMouseLeave={handleMouseLeave}
      >
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} style={{ display: 'flex' }}>
            {row.map((cell, colIdx) => {
              const isFound = isCellInFoundWord(rowIdx, colIdx);
              const isSelected = isCellSelected(rowIdx, colIdx);
              
              return (
                <div 
                  key={colIdx}
                  data-row={rowIdx}
                  data-col={colIdx}
                  className="grid-cell"
                  style={{
                    width: '40px',
                    height: '40px',
                    border: isSelected ? '2px solid #0d6efd' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    backgroundColor: isFound ? '#c8e6c9' : (isSelected ? '#bbdefb' : 'var(--bg-color)'),
                    color: isFound ? '#2e7d32' : (isSelected ? '#0d6efd' : 'var(--text-color)'),
                    transition: 'all 0.15s ease',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    margin: '1px',
                    boxShadow: isSelected ? 'inset 0 0 0 2px #0d6efd' : 'none'
                  }}
                  onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                  onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                  onMouseUp={handleMouseUp}
                  onTouchStart={(e) => handleTouchStart(rowIdx, colIdx, e)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {cell}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected word preview */}
      {selectedCells.length > 1 && (
        <div className="mb-2">
          <span className="badge bg-primary p-2">
            Selecting: <strong>{getSelectedWord()}</strong>
          </span>
          <button 
            onClick={() => { setSelectedCells([]); setIsSelecting(false); }}
            className="btn btn-outline-secondary btn-sm ms-2"
          >
            ✕ Clear
          </button>
        </div>
      )}
      
      {/* Word List */}
      <div className="mt-3">
        <p><strong>Find these phoneme words:</strong></p>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {words.map((word, idx) => {
            const isFound = isWordFound(word);
            return (
              <span 
                key={idx}
                onClick={() => toggleWordFound(word)}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: isFound ? '#c8e6c9' : '#e8f5e9',
                  borderRadius: '20px',
                  cursor: isFound ? 'pointer' : 'default',
                  border: isFound ? '2px solid #4CAF50' : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold',
                  textDecoration: isFound ? 'line-through' : 'none',
                  opacity: isFound ? 0.7 : 1,
                  color: isFound ? '#2e7d32' : 'var(--text-color)',
                  fontSize: '1rem'
                }}
                title={isFound ? 'Click to unmark' : 'Find this word in the grid!'}
              >
                {isFound && <span className="me-1">✅</span>}
                {word}
                <span className="ms-1 badge bg-info" style={{ fontSize: '0.6rem' }}>
                  {phonemeMap[word] || '/θ/'}
                </span>
              </span>
            );
          })}
        </div>
        
        {/* Reset button */}
        {foundWords.length > 0 && (
          <button 
            onClick={() => { setFoundWords([]); setSelectedCells([]); }}
            className="btn btn-outline-secondary btn-sm mt-3"
          >
            🔄 Reset Game
          </button>
        )}
        
        {foundWords.length === words.length && words.length > 0 && (
          <div className="alert alert-success mt-3" style={{ fontSize: '1.2rem' }}>
            🎉🎊 CONGRATULATIONS! You found all {words.length} words! 🎊🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSearch;