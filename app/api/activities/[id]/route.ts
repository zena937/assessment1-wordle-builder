import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        words: {
          include: { word: true },
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, description, maxAttempts, gridSize, wordIds } = body;
    
    if (!name || !wordIds || wordIds.length === 0) {
      return NextResponse.json({ 
        error: 'Name and at least one word are required' 
      }, { status: 400 });
    }
    
    // First delete existing relations
    await prisma.activityWord.deleteMany({
      where: { activityId: id }
    });
    
    // Then update activity with new words
    const updated = await prisma.activity.update({
      where: { id },
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
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating activity:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.activity.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting activity:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}