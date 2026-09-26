import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// POST /api/events
// Body: { eventType, activityType, activityId?, wordCount?, errorMessage? }
// Logs an ActivityEvent and bumps the matching UsageStat counter.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventType,
      activityType,
      activityId,
      wordCount,
      errorMessage,
    } = body;

    // Validate required fields
    const validEventTypes = ['CREATED', 'GENERATED', 'FAILED', 'VIEWED'];
    const validActivityTypes = ['WORDLE', 'WORDSEARCH'];

    if (!eventType || !validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: `eventType must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (!activityType || !validActivityTypes.includes(activityType)) {
      return NextResponse.json(
        { error: `activityType must be one of: ${validActivityTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // 1. Log the event
    const event = await prisma.activityEvent.create({
      data: {
        eventType,
        activityType,
        activityId: activityId ?? null,
        wordCount: typeof wordCount === 'number' ? wordCount : null,
        errorMessage: errorMessage ?? null,
      },
    });

    // 2. Increment the matching counter (upsert so it works on first call)
    const metricKey = `${activityType.toLowerCase()}_${eventType.toLowerCase()}`;
    await prisma.usageStat.upsert({
      where: { metric: metricKey },
      update: { value: { increment: 1 } },
      create: { metric: metricKey, value: 1 },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to log event:', error);
    return NextResponse.json(
      {
        error: 'Failed to log event',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET /api/events?limit=20
// Returns the most recent events — useful for the dashboard table.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Number(limitParam) || 20, 100);

    const events = await prisma.activityEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch events',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}