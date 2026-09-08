import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      orderBy: { word: 'asc' }
    });
    
    // Parse phonemes back to array
    const wordsWithParsedPhonemes = words.map(w => ({
      ...w,
      phonemes: JSON.parse(w.phonemes)
    }));
    
    return NextResponse.json(wordsWithParsedPhonemes);
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 });
  }
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
    
    const newWord = await prisma.word.create({
      data: { 
        word: word.toUpperCase(), 
        phonemes: JSON.stringify(phonemes),
        hint, 
        difficulty: difficulty || 'EASY' 
      }
    });
    
    return NextResponse.json({
      ...newWord,
      phonemes: JSON.parse(newWord.phonemes)
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Word already exists' }, { status: 409 });
    }
    console.error('Error creating word:', error);
    return NextResponse.json({ error: 'Failed to create word' }, { status: 500 });
  }
}