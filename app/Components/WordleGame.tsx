'use client';

import { useState } from 'react';

interface WordleGameProps {
  wordleData: {
    word: string;
    phoneme: string;
    hint: string;
    maxAttempts?: number;
  };
}

const WordleGame = ({ wordleData }: WordleGameProps) => {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('Enter a word to start playing!');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showPhonemeHint, setShowPhonemeHint] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'info' | 'correct' | 'wrong'>('info');

  const maxAttempts = wordleData.maxAttempts || 6;

  const handleGuess = () => {
    const guessUpper = guess.toUpperCase().trim();
    
    if (!guessUpper) {
      setFeedback('⚠️ Please enter a word.');
      setFeedbackType('wrong');
      return;
    }

    if (gameOver) {
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessUpper === wordleData.word) {
      setFeedback(`🎉 Correct! The answer is "${wordleData.word}" 
        (${wordleData.phoneme} as in ${wordleData.hint})`);
      setFeedbackType('correct');
      setGameOver(true);
      return;
    }

    if (newAttempts >= maxAttempts) {
      setFeedback(`❌ Game Over! The answer was "${wordleData.word}" 
        (${wordleData.phoneme} as in ${wordleData.hint})`);
      setFeedbackType('wrong');
      setGameOver(true);
      return;
    }

    setFeedback(`❌ Try again! Attempt ${newAttempts} of ${maxAttempts}`);
    setFeedbackType('wrong');
    setGuess('');
  };

  return (
    <div className="text-center">
      {/* Phoneme Display */}
      <div style={{ 
        fontSize: '4rem', 
        color: '#4CAF50',
        fontWeight: 'bold',
        backgroundColor: '#e8f5e9',
        padding: '20px',
        borderRadius: '12px',
        margin: '10px 0'
      }}>
        {wordleData.phoneme}
      </div>
      
      {/* Hint with hover */}
      <div style={{ 
        margin: '15px 0', 
        padding: '10px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
        borderLeft: '4px solid #ff9800'
      }}>
        💡 <span 
          onMouseEnter={() => setShowPhonemeHint(true)}
          onMouseLeave={() => setShowPhonemeHint(false)}
          style={{ 
            cursor: 'help', 
            borderBottom: '2px dashed #999',
            paddingBottom: '2px'
          }}
        >
          {wordleData.hint}
        </span>
        {showPhonemeHint && (
          <span className="ms-2 badge bg-info">
            Sound: {wordleData.phoneme}
          </span>
        )}
      </div>
      
      {/* Input Area */}
      <div className="input-group mb-3" style={{ maxWidth: '400px', margin: '20px auto' }}>
        <input
          type="text"
          className="form-control"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess..."
          disabled={gameOver}
          onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
          style={{ fontSize: '1.2rem' }}
        />
        <button 
          className="btn btn-primary" 
          onClick={handleGuess}
          disabled={gameOver}
          style={{ fontSize: '1.2rem' }}
        >
          Guess
        </button>
      </div>
      
      {/* Feedback */}
      <div className={`p-3 rounded ${
        feedbackType === 'correct' ? 'bg-success text-white' :
        feedbackType === 'wrong' ? 'bg-danger text-white' :
        'bg-light'
      }`} style={{ minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {feedback}
      </div>
      
      {/* Attempts Counter */}
      <div className="mt-2 text-muted">
        Attempts: {attempts} / {maxAttempts}
      </div>
    </div>
  );
};

export default WordleGame;