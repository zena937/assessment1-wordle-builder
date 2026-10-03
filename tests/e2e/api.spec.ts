import { test, expect } from '@playwright/test';

/**
 * Second-layer tests: direct REST API contract checks for /api/words.
 * Complements the browser-driven E2E test in builder.spec.ts.
 */

test.describe.serial('Word API contract (layer 2)', () => {
  const testWord = `API${Date.now().toString().slice(-6)}`;
  let createdId: string;

  test('POST /api/words creates a word', async ({ request }) => {
    const res = await request.post('/api/words', {
      data: {
        word: testWord,
        phonemes: ['a', 'p', 'i'],
        hint: 'API layer test',
        difficulty: 'EASY',
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.word).toBe(testWord);
    createdId = body.id;
  });

  test('GET /api/words returns the new word', async ({ request }) => {
    const res = await request.get('/api/words');
    expect(res.status()).toBe(200);
    const words = await res.json();
    expect(words.some((w: any) => w.id === createdId)).toBe(true);
  });

  test('PUT /api/words/[id] updates the word', async ({ request }) => {
    // PUT is a full replacement: we must send word + phonemes too.
    const res = await request.put(`/api/words/${createdId}`, {
      data: {
        word: testWord,
        phonemes: ['a', 'p', 'i'],
        hint: 'Updated via API',
        difficulty: 'HARD',
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.hint).toBe('Updated via API');
    expect(body.difficulty).toBe('HARD');
  });

  test('POST duplicate returns 409', async ({ request }) => {
    const res = await request.post('/api/words', {
      data: { word: testWord, phonemes: ['a', 'p', 'i'] },
    });
    expect(res.status()).toBe(409);
  });

  test('DELETE /api/words/[id] removes the word', async ({ request }) => {
    const res = await request.delete(`/api/words/${createdId}`);
    expect([200, 204]).toContain(res.status());

    const check = await request.get('/api/words');
    const words = await check.json();
    expect(words.some((w: any) => w.id === createdId)).toBe(false);
  });
});