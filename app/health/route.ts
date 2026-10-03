import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /health
// Same as /api/health but at the root path required by the assessment brief.
export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - started;

    return NextResponse.json(
      {
        status: 'OK',
        database: 'connected',
        dbLatencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'DEGRADED',
        database: 'unreachable',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}