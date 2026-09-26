import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/stats
// Returns aggregated observability metrics for the dashboard.
// Counts are derived from the source-of-truth tables so they stay accurate.
// UsageStat is a hot-counter cache we can fall back to under future scale.
export async function GET() {
  try {
    // ---- 1. Activities created (from the Activity table) ----
    const [wordleCreatedCount, wordsearchCreatedCount] = await Promise.all([
      prisma.activity.count({ where: { type: 'WORDLE' } }),
      prisma.activity.count({ where: { type: 'WORDSEARCH' } }),
    ]);

    // ---- 2. Generation events (from ActivityEvent) ----
    const [wordleGeneratedCount, wordsearchGeneratedCount] = await Promise.all([
      prisma.activityEvent.count({
        where: { eventType: 'GENERATED', activityType: 'WORDLE' },
      }),
      prisma.activityEvent.count({
        where: { eventType: 'GENERATED', activityType: 'WORDSEARCH' },
      }),
    ]);

    const [wordleFailedCount, wordsearchFailedCount] = await Promise.all([
      prisma.activityEvent.count({
        where: { eventType: 'FAILED', activityType: 'WORDLE' },
      }),
      prisma.activityEvent.count({
        where: { eventType: 'FAILED', activityType: 'WORDSEARCH' },
      }),
    ]);

    // ---- 3. Most-used activity type ----
    const mostUsedActivityType =
      wordleGeneratedCount + wordleCreatedCount >=
      wordsearchGeneratedCount + wordsearchCreatedCount
        ? 'WORDLE'
        : 'WORDSEARCH';

    // ---- 4. Average time on page ----
    const avgResult = await prisma.pageView.aggregate({
      _avg: { durationMs: true },
      _count: { _all: true },
    });

    const avgTimeOnPageMs = Math.round(avgResult._avg.durationMs ?? 0);
    const totalPageViews = avgResult._count._all ?? 0;

    // ---- 5. Generation totals ----
    const successfulGenerations = wordleGeneratedCount + wordsearchGeneratedCount;
    const failedGenerations = wordleFailedCount + wordsearchFailedCount;

    // ---- 6. Word list size (for the "empty word list" alert) ----
    const totalWords = await prisma.word.count();

    // ---- 7. Alerts / warnings ----
    const alerts: { level: 'warning' | 'error'; message: string }[] = [];

    if (totalWords === 0) {
      alerts.push({
        level: 'error',
        message: 'Word list is empty. Add words to enable activity generation.',
      });
    }

    if (failedGenerations > 0 && successfulGenerations === 0) {
      alerts.push({
        level: 'warning',
        message: 'All generation attempts have failed. Check word list integrity.',
      });
    }

    if (wordleFailedCount > wordleGeneratedCount && wordleFailedCount > 0) {
      alerts.push({
        level: 'warning',
        message: 'Wordle failure rate is high. Review recent failed events.',
      });
    }

    // ---- 8. Response ----
    return NextResponse.json(
      {
        health: {
          status: 'OK',
          timestamp: new Date().toISOString(),
        },
        activityCounts: {
          wordle: wordleCreatedCount,
          wordsearch: wordsearchCreatedCount,
          total: wordleCreatedCount + wordsearchCreatedCount,
        },
        generationCounts: {
          wordle: wordleGeneratedCount,
          wordsearch: wordsearchGeneratedCount,
        },
        mostUsedActivityType,
        averageTimeOnPageMs: avgTimeOnPageMs,
        averageTimeOnPageSec: Math.round(avgTimeOnPageMs / 1000),
        totalPageViews,
        generations: {
          successful: successfulGenerations,
          failed: failedGenerations,
          wordleSuccessful: wordleGeneratedCount,
          wordleFailed: wordleFailedCount,
          wordsearchSuccessful: wordsearchGeneratedCount,
          wordsearchFailed: wordsearchFailedCount,
        },
        totalWords,
        alerts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}