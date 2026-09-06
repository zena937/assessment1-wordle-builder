import { NextResponse } from 'next/server';

// Temporary in-memory data (works without database)
let words = [
  { id: '1', word: 'THIN', phonemes: ['θ', 'ɪ', 'n'], hint: 'θ ɪ n as in THIN', difficulty: 'EASY' },
  { id: '2', word: 'SHIP', phonemes: ['ʃ', 'ɪ', 'p'], hint: 'ʃ ɪ p as in SHIP', difficulty: 'EASY' },
  { id: '3', word: 'CHIN', phonemes: ['tʃ', 'ɪ', 'n'], hint: 'tʃ ɪ n as in CHIN', difficulty: 'MEDIUM' },
  { id: '4', word: 'JAM', phonemes: ['dʒ', 'æ', 'm'], hint: 'dʒ æ m as in JAM', difficulty: 'EASY' },
  { id: '5', word: 'FAN', phonemes: ['f', 'æ', 'n'], hint: 'f æ n as in FAN', difficulty: 'EASY' },
];

let nextId = 6;

export async function GET() {
  return NextResponse.json(words);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, phonemes, hint, difficulty } = body;
    
    if (!word || !phonemes || phonemes.length === 0) {
      return NextResponse.json({ 
        error: 'Word and phonemes are required' 
      }, { status: 400 });
    }
    
    const newWord = {
      id: String(nextId++),
      word: word.toUpperCase(),
      phonemes,
      hint: hint || '',
      difficulty: difficulty || 'EASY'
    };
    
    words.push(newWord);
    return NextResponse.json(newWord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create word' }, { status: 500 });
  }
}