import { test, expect } from '@playwright/test';

test('Authentication Flow: Register and Login', async ({ page }) => {
  // 1. Go to Register page
  await page.goto('/register');
  
  // 2. Fill Registration Form
  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';

  await page.fill('#name', name);
  await page.fill('#email', email);
  await page.fill('#password', password);
  
  // 3. Submit Registration
  await page.click('button[type="submit"]');

  // 4. Should redirect to Login page (root)
  await expect(page).toHaveURL('/');

  // 5. Fill Login Form
  await page.fill('#email', email);
  await page.fill('#password', password);
  
  // 6. Submit Login
  await page.click('button[type="submit"]');

  // 7. Should redirect to Home page
  await expect(page).toHaveURL('/home');
  
  // 8. Verify Welcome message
  await expect(page.getByRole('heading', { name: 'Welcome, Test User!' })).toBeVisible();
});
