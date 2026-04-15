import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('crisis footer is visible', async ({ page }) => {
  await page.goto('/contact')
  await expect(
    page.getByRole('complementary', { name: 'Crisis support information' })
  ).toBeVisible()
})
