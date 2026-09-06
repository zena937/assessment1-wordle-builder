import { NextResponse } from 'next/server';

const words = [
  { id: '1', word: 'THIN', phonemes: ['θ', 'ɪ', 'n'], hint: 'θ ɪ n as in THIN', difficulty: 'EASY' },
  { id: '2', word: 'SHIP', phonemes: ['ʃ', 'ɪ', 'p'], hint: 'ʃ ɪ p as in SHIP', difficulty: 'EASY' },
  { id: '3', word: 'CHIN', phonemes: ['tʃ', 'ɪ', 'n'], hint: 'tʃ ɪ n as in CHIN', difficulty: 'MEDIUM' },
  { id: '4', word: 'JAM', phonemes: ['dʒ', 'æ', 'm'], hint: 'dʒ æ m as in JAM', difficulty: 'EASY' },
  { id: '5', word: 'FAN', phonemes: ['f', 'æ', 'n'], hint: 'f æ n as in FAN', difficulty: 'EASY' },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const word = words.find(w => w.id === id);
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    return NextResponse.json({ id, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update word' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return NextResponse.json({ id, message: 'Word deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete word' }, { status: 500 });
  }
}