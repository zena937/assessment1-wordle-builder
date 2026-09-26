import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET /api/stats
// Returns the aggregated observability metrics for the dashboard.
export async function GET() {
  try {
    // ---- 1. Activity type counts ----
    const [wordleCreated, wordsearchCreated] = await Promise.all([
      prisma.usageStat.findUnique({ where: { metric: 'wordle_created' } }),
      prisma.usageStat.findUnique({ where: { metric: 'wordsearch_created' } }),
    ]);

    const [wordleGenerated, wordsearchGenerated] = await Promise.all([
      prisma.usageStat.findUnique({ where: { metric: 'wordle_generated' } }),
      prisma.usageStat.findUnique({ where: { metric: 'wordsearch_generated' } }),
    ]);

    const [wordleFailed, wordsearchFailed] = await Promise.all([
      prisma.usageStat.findUnique({ where: { metric: 'wordle_failed' } }),
      prisma.usageStat.findUnique({ where: { metric: 'wordsearch_failed' } }),
    ]);

    const wordleCreatedCount = wordleCreated?.value ?? 0;
    const wordsearchCreatedCount = wordsearchCreated?.value ?? 0;
    const wordleGeneratedCount = wordleGenerated?.value ?? 0;
    const wordsearchGeneratedCount = wordsearchGenerated?.value ?? 0;
    const wordleFailedCount = wordleFailed?.value ?? 0;
    const wordsearchFailedCount = wordsearchFailed?.value ?? 0;

    // ---- 2. Most-used activity type ----
    const mostUsedActivityType =
      wordleCreatedCount >= wordsearchCreatedCount ? 'WORDLE' : 'WORDSEARCH';

    // ---- 3. Average time on page ----
    const avgResult = await prisma.pageView.aggregate({
      _avg: { durationMs: true },
      _count: { _all: true },
    });

    const avgTimeOnPageMs = Math.round(avgResult._avg.durationMs ?? 0);
    const totalPageViews = avgResult._count._all ?? 0;

    // ---- 4. Total successful vs failed generations ----
    const successfulGenerations = wordleGeneratedCount + wordsearchGeneratedCount;
    const failedGenerations = wordleFailedCount + wordsearchFailedCount;

    // ---- 5. Word list size (for the "empty word list" alert) ----
    const totalWords = await prisma.word.count();

    // ---- 6. Alerts / warnings ----
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

    // ---- 7. Response ----
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
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}