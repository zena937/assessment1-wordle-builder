import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// POST /api/pageview
// Body: { path, durationMs }
// Logs time-on-page. Called from the client on unload (via sendBeacon)
// or on route change.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, durationMs } = body;

    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { error: 'path is required' },
        { status: 400 }
      );
    }

    const sanitizedDuration = Math.max(
      0,
      Math.min(Number(durationMs) || 0, 3_600_000) // cap at 1 hour
    );

    const pageView = await prisma.pageView.create({
      data: {
        path,
        durationMs: sanitizedDuration,
      },
    });

    return NextResponse.json(pageView, { status: 201 });
  } catch (error) {
    console.error('Failed to log pageview:', error);
    return NextResponse.json(
      {
        error: 'Failed to log pageview',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}