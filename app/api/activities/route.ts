import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ id: '1', ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}