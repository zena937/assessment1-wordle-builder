import { test, expect } from '@playwright/test';

/**
 * Builder use case (E2E via browser UI):
 * A teacher opens /words, creates a word, edits its hint/difficulty, then deletes it.
 */

test.describe.serial('Word list manager (builder UI)', () => {
  const uniqueWord = `PW${Date.now().toString().slice(-6)}`; // e.g. PW123456

  test('Page loads with the Add Word form and existing word list', async ({ page }) => {
    await page.goto('/words');
    await expect(page.getByRole('heading', { name: /Manage Word List/i })).toBeVisible();
    await expect(page.getByLabel('Word', { exact: false }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Word/i })).toBeVisible();
  });

  test('CREATE — teacher adds a new word via the form', async ({ page }) => {
    await page.goto('/words');

    await page.getByLabel('Word', { exact: false }).first().fill(uniqueWord);
    await page.getByLabel(/Phonemes/i).fill('p, w, t');
    await page.getByLabel(/Hint/i).fill('Playwright E2E test word');
    await page.getByLabel(/Difficulty/i).selectOption('MEDIUM');
    await page.getByRole('button', { name: /Add Word/i }).click();

    // Success banner
    await expect(page.locator('.alert-success')).toContainText(uniqueWord);

    // Row appears in table
    const row = page.getByTestId(`word-row-${uniqueWord}`);
    await expect(row).toBeVisible();
    await expect(row).toContainText('MEDIUM');
  });

  test('UPDATE — teacher edits the hint and difficulty inline', async ({ page }) => {
    await page.goto('/words');

    const row = page.getByTestId(`word-row-${uniqueWord}`);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: /Edit/i }).click();

    // The row switches to edit mode — hint input and difficulty select appear
    const editHint = row.locator('input[type="text"]');
    await editHint.fill('Updated hint from Playwright');
    const editDifficulty = row.locator('select');
    await editDifficulty.selectOption('HARD');

    await row.getByRole('button', { name: /Save/i }).click();

    await expect(page.locator('.alert-success')).toContainText('updated');
    await expect(row).toContainText('HARD');
    await expect(row).toContainText('Updated hint from Playwright');
  });

  test('DELETE — teacher removes the word', async ({ page }) => {
    await page.goto('/words');

    // Auto-accept the confirm() dialog
    page.on('dialog', (dialog) => dialog.accept());

    const row = page.getByTestId(`word-row-${uniqueWord}`);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: /Delete/i }).click();

    await expect(page.locator('.alert-success')).toContainText('deleted');
    await expect(page.getByTestId(`word-row-${uniqueWord}`)).not.toBeVisible();
  });
});