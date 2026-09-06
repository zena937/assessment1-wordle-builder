import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Return empty for now
    return NextResponse.json({ id, message: 'Activity not found' }, { status: 404 });
  } catch (error) {
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
    return NextResponse.json({ id, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return NextResponse.json({ id, message: 'Activity deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}