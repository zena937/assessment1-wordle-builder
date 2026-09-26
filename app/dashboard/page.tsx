import Link from 'next/link';
import prisma from '@/app/lib/prisma';
import StatCard from '../Components/StatCard';

// Force dynamic rendering — the dashboard always shows fresh data.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // ---- 1. Activity counts (from Activity table) ----
  const [wordleCreatedCount, wordsearchCreatedCount] = await Promise.all([
    prisma.activity.count({ where: { type: 'WORDLE' } }),
    prisma.activity.count({ where: { type: 'WORDSEARCH' } }),
  ]);

  // ---- 2. Generation events (from ActivityEvent) ----
  const [wordleGenerated, wordsearchGenerated] = await Promise.all([
    prisma.activityEvent.count({
      where: { eventType: 'GENERATED', activityType: 'WORDLE' },
    }),
    prisma.activityEvent.count({
      where: { eventType: 'GENERATED', activityType: 'WORDSEARCH' },
    }),
  ]);

  const [wordleFailed, wordsearchFailed] = await Promise.all([
    prisma.activityEvent.count({
      where: { eventType: 'FAILED', activityType: 'WORDLE' },
    }),
    prisma.activityEvent.count({
      where: { eventType: 'FAILED', activityType: 'WORDSEARCH' },
    }),
  ]);

  // ---- 3. Avg time on page & page view count ----
  const avgResult = await prisma.pageView.aggregate({
    _avg: { durationMs: true },
    _count: { _all: true },
  });
  const avgTimeOnPageSec = Math.round((avgResult._avg.durationMs ?? 0) / 1000);
  const totalPageViews = avgResult._count._all;

  // ---- 4. Word list size ----
  const totalWords = await prisma.word.count();

  // ---- 5. Most-used activity type ----
  const mostUsedActivityType =
    wordleGenerated + wordleCreatedCount >=
    wordsearchGenerated + wordsearchCreatedCount
      ? 'Wordle'
      : 'Word Search';

  // ---- 6. Alerts ----
  const alerts: { level: 'warning' | 'error'; message: string }[] = [];
  if (totalWords === 0) {
    alerts.push({
      level: 'error',
      message: 'Word list is empty. Add words to enable activity generation.',
    });
  }
  const successfulGenerations = wordleGenerated + wordsearchGenerated;
  const failedGenerations = wordleFailed + wordsearchFailed;
  if (failedGenerations > 0 && successfulGenerations === 0) {
    alerts.push({
      level: 'warning',
      message: 'All generation attempts have failed. Check word list integrity.',
    });
  }
  if (wordleFailed > wordleGenerated && wordleFailed > 0) {
    alerts.push({
      level: 'warning',
      message: 'Wordle failure rate is high. Review recent failed events.',
    });
  }

  // ---- 7. Recent events ----
  const recentEvents = await prisma.activityEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // ---- 8. Recent words (for the word list preview) ----
  const recentWords = await prisma.word.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // ---- 9. Render ----
  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1" style={{ color: 'var(--text-color)' }}>
            📊 Dashboard
          </h1>
          <p className="text-muted mb-0">
            Operational overview of the Phoneme Activity Builder
          </p>
        </div>
        <Link href="/wordle" className="btn btn-primary">
          + Create Activity
        </Link>
      </div>

      {/* Health banner */}
      <div
        className={`alert ${
          alerts.length === 0 ? 'alert-success' : 'alert-warning'
        } d-flex align-items-center mb-4`}
        role="alert"
      >
        <span style={{ fontSize: '1.5rem' }} className="me-2">
          {alerts.length === 0 ? '✅' : '⚠️'}
        </span>
        <div>
          <strong>
            {alerts.length === 0
              ? 'System healthy — no alerts'
              : `${alerts.length} alert${alerts.length > 1 ? 's' : ''} need attention`}
          </strong>
          {alerts.length === 0 && (
            <div className="small">
              Word list: {totalWords} entries · Page views: {totalPageViews} ·
              Avg time on page: {avgTimeOnPageSec}s
            </div>
          )}
        </div>
      </div>

      {/* Alert details */}
      {alerts.length > 0 && (
        <div className="mb-4">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`alert ${
                alert.level === 'error' ? 'alert-danger' : 'alert-warning'
              } py-2 mb-2`}
              role="alert"
            >
              <strong>
                {alert.level === 'error' ? 'Error:' : 'Warning:'}
              </strong>{' '}
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* KPI cards row 1 */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <StatCard
            title="Wordle Activities"
            value={wordleCreatedCount}
            subtitle="Created"
            variant="primary"
            icon="🔤"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Word Search Activities"
            value={wordsearchCreatedCount}
            subtitle="Created"
            variant="primary"
            icon="🔍"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Successful Generations"
            value={successfulGenerations}
            subtitle="Total"
            variant="success"
            icon="✅"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Failed Generations"
            value={failedGenerations}
            subtitle="Total"
            variant={failedGenerations > 0 ? 'danger' : 'secondary'}
            icon="❌"
          />
        </div>
      </div>

      {/* KPI cards row 2 */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Avg Time on Page"
            value={`${avgTimeOnPageSec}s`}
            subtitle={`${totalPageViews} page views logged`}
            variant="info"
            icon="⏱️"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Most-Used Activity"
            value={mostUsedActivityType}
            subtitle="By creation + generation"
            variant="warning"
            icon="⭐"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Word List Size"
            value={totalWords}
            subtitle="Entries in DB"
            variant="secondary"
            icon="📚"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Health Status"
            value={alerts.length === 0 ? 'OK' : 'DEGRADED'}
            subtitle="From /api/health"
            variant={alerts.length === 0 ? 'success' : 'warning'}
            icon="💚"
          />
        </div>
      </div>

      {/* Two-column reporting view */}
      <div className="row g-3 mb-4">
        {/* Recent events table */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header">
              <strong>Recent Activity Events</strong>
            </div>
            <div className="card-body p-0">
              {recentEvents.length === 0 ? (
                <p className="text-muted p-3 mb-0">
                  No events logged yet. Create an activity to see data appear
                  here.
                </p>
              ) : (
                <table className="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Activity</th>
                      <th>Words</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((evt) => (
                      <tr key={evt.id}>
                        <td>
                          <span
                            className={`badge ${
                              evt.eventType === 'FAILED'
                                ? 'bg-danger'
                                : evt.eventType === 'GENERATED'
                                  ? 'bg-success'
                                  : 'bg-secondary'
                            }`}
                          >
                            {evt.eventType}
                          </span>
                        </td>
                        <td>{evt.activityType}</td>
                        <td>{evt.wordCount ?? '—'}</td>
                        <td className="text-muted small">
                          {new Date(evt.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Word list preview */}
        <div className="col-lg-4">
          <div className="card h-100">
            <div className="card-header">
              <strong>Latest Word List Entries</strong>
            </div>
            <div className="card-body p-0">
              {recentWords.length === 0 ? (
                <p className="text-muted p-3 mb-0">No words in database.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {recentWords.map((w) => (
                    <li
                      key={w.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        <strong>{w.word}</strong>{' '}
                        <small className="text-muted">
                          /{w.phonemes.join('')}/
                        </small>
                      </span>
                      <span className="badge bg-secondary">{w.difficulty}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity generation counts */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <strong>Wordle Generation Breakdown</strong>
            </div>
            <div className="card-body">
              <p className="mb-1">
                <strong>Successful:</strong> {wordleGenerated}
              </p>
              <p className="mb-0">
                <strong>Failed:</strong> {wordleFailed}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <strong>Word Search Generation Breakdown</strong>
            </div>
            <div className="card-body">
              <p className="mb-1">
                <strong>Successful:</strong> {wordsearchGenerated}
              </p>
              <p className="mb-0">
                <strong>Failed:</strong> {wordsearchFailed}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}