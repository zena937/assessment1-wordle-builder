import { NextResponse } from 'next/server';

// This will use the same in-memory data
// Note: In a real app, this would use a database

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Import the words array from the main route file
    // For simplicity, we'll use a local array
    const words = [
      { id: '1', word: 'THIN', phonemes: ['θ', 'ɪ', 'n'], hint: 'θ ɪ n as in THIN', difficulty: 'EASY' },
      { id: '2', word: 'SHIP', phonemes: ['ʃ', 'ɪ', 'p'], hint: 'ʃ ɪ p as in SHIP', difficulty: 'EASY' },
      { id: '3', word: 'CHIN', phonemes: ['tʃ', 'ɪ', 'n'], hint: 'tʃ ɪ n as in CHIN', difficulty: 'MEDIUM' },
      { id: '4', word: 'JAM', phonemes: ['dʒ', 'æ', 'm'], hint: 'dʒ æ m as in JAM', difficulty: 'EASY' },
      { id: '5', word: 'FAN', phonemes: ['f', 'æ', 'n'], hint: 'f æ n as in FAN', difficulty: 'EASY' },
    ];
    
    const word = words.find(w => w.id === params.id);
    
    if (!word) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }
    
    return NextResponse.json(word);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch word' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { word, phonemes, hint, difficulty } = body;
    
    if (!word || !phonemes || phonemes.length === 0) {
      return NextResponse.json({ 
        error: 'Word and phonemes are required' 
      }, { status: 400 });
    }
    
    // Return success for now
    return NextResponse.json({ 
      id: params.id,
      word: word.toUpperCase(),
      phonemes,
      hint,
      difficulty
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update word' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    return NextResponse.json({ message: 'Word deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete word' }, { status: 500 });
  }
}