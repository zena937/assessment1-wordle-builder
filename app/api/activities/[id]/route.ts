import { NextResponse } from 'next/server';

// Temporary in-memory data for activities
let activities: any[] = [];
let nextActivityId = 1;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const activity = activities.find(a => a.id === params.id);
    
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, type, description, maxAttempts, gridSize, wordIds } = body;
    
    if (!name || !wordIds || wordIds.length === 0) {
      return NextResponse.json({ 
        error: 'Name and at least one word are required' 
      }, { status: 400 });
    }
    
    const index = activities.findIndex(a => a.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    
    activities[index] = {
      ...activities[index],
      name,
      type: type || 'WORDLE',
      description: description || '',
      maxAttempts: maxAttempts || 6,
      gridSize: gridSize || 12,
      wordIds
    };
    
    return NextResponse.json(activities[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const index = activities.findIndex(a => a.id === params.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    
    activities.splice(index, 1);
    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}