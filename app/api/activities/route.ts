import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        words: {
          include: { word: true },
          orderBy: { order: 'asc' }
        }
      }
    });
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, description, maxAttempts, gridSize, wordIds } = body;
    
    if (!name || !wordIds || wordIds.length === 0) {
      return NextResponse.json({ 
        error: 'Name and at least one word are required' 
      }, { status: 400 });
    }
    
    const newActivity = await prisma.activity.create({
      data: {
        name,
        type: type || 'WORDLE',
        description,
        maxAttempts: maxAttempts || 6,
        gridSize: gridSize || 12,
        words: {
          create: wordIds.map((wordId: string, index: number) => ({
            wordId,
            order: index
          }))
        }
      },
      include: {
        words: { include: { word: true } }
      }
    });
    
    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}