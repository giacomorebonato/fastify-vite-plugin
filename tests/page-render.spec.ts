import { expect, test } from '@playwright/test';

test('loads the page', async ({ page }) => {
  await page.goto('http://localhost:3000');


  await expect(page.getByTestId('root')).toHaveText('Client code');
  await expect(page.getByTestId('title')).toHaveText('Hello');
});
