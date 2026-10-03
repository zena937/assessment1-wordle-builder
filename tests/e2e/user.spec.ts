import { test, expect } from '@playwright/test';

/**
 * User use case: a speech pathology student visits the Wordle builder page,
 * selects phonemes, and generates a playable Wordle preview.
 */

test.describe('Wordle generation (user use case)', () => {
  test('User can load the Wordle builder page', async ({ page }) => {
    await page.goto('/wordle');
    await expect(
      page.getByRole('heading', { name: /Create Wordle Activity/i })
    ).toBeVisible();
  });

  test('Clicking Generate with no phonemes shows a warning', async ({ page }) => {
    await page.goto('/wordle');

    // In auto-hint mode (default) the Generate button is enabled even
    // without phonemes. Clicking it should trigger the warning path.
    const generateBtn = page.getByRole('button', {
      name: /Generate & Preview/i,
    });
    await expect(generateBtn).toBeEnabled();
    await generateBtn.click();

    await expect(page.locator('.alert-info')).toContainText(
      /Please select at least one phoneme/i
    );
  });

  test('User selects phonemes and generates a Wordle preview', async ({ page }) => {
    await page.goto('/wordle');

    // Wait for the word list to finish loading
    await page.waitForResponse(
      (res) => res.url().includes('/api/words') && res.status() === 200
    );

    // Click any phoneme button rendered by PhonemeKeyboard. We look for
    // buttons whose text is a short IPA symbol.
    const allButtons = page.locator('button');
    const count = await allButtons.count();
    let clicked = false;
    for (let i = 0; i < count && !clicked; i++) {
      const text = (await allButtons.nth(i).textContent())?.trim() || '';
      if (text.length > 0 && text.length <= 3 && /[θʃɪptʃdʒnfæm]/.test(text)) {
        await allButtons.nth(i).click();
        clicked = true;
      }
    }

    expect(clicked).toBe(true);

    const generateBtn = page.getByRole('button', {
      name: /Generate & Preview/i,
    });
    await generateBtn.click();

    // Preview section appears
    await expect(page.getByRole('heading', { name: /Preview/i })).toBeVisible({
      timeout: 5_000,
    });
  });

  test('Dashboard shows observability metric cards', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(
      page.getByRole('heading', { name: /Dashboard/i })
    ).toBeVisible();

    await expect(page.getByText(/Wordle Activities/i).first()).toBeVisible();
    await expect(page.getByText(/Successful Generations/i).first()).toBeVisible();
    await expect(page.getByText(/Failed Generations/i).first()).toBeVisible();
    await expect(page.getByText(/Avg Time on Page/i).first()).toBeVisible();
  });
});