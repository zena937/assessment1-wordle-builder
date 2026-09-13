import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const word = await prisma.word.findUnique({
      where: { id }
    });
    
    if (!word) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }
    
    return NextResponse.json(word);
  } catch (error) {
    console.error('Error fetching word:', error);
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
    const { word, phonemes, hint, difficulty } = body;
    
    if (!word || !phonemes || phonemes.length === 0) {
      return NextResponse.json({ 
        error: 'Word and phonemes are required' 
      }, { status: 400 });
    }
    
    const updated = await prisma.word.update({
      where: { id },
      data: { 
        word: word.toUpperCase(), 
        phonemes,
        hint, 
        difficulty 
      }
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update word' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.word.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Word deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete word' }, { status: 500 });
  }
}