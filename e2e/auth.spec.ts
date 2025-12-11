import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should redirect unauthenticated users to login page', async ({ page }) => {
    // Landing page should redirect to login if not authenticated
    await expect(page).toHaveURL(/\/login/)
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible()
    await expect(page.getByPlaceholder(/correo electrónico/i)).toBeVisible()
    await expect(page.getByPlaceholder(/contraseña/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByPlaceholder(/correo electrónico/i).fill('invalid@example.com')
    await page.getByPlaceholder(/contraseña/i).fill('wrongpassword')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    
    // Should show error message
    await expect(page.getByText(/error/i)).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByPlaceholder(/correo electrónico/i).fill('invalid-email')
    await page.getByPlaceholder(/contraseña/i).fill('password123')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    
    // Should show validation error
    await expect(page.getByText(/correo.*válido/i)).toBeVisible()
  })

  test('should require both email and password', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    
    // Should show required field errors
    const emailInput = page.getByPlaceholder(/correo electrónico/i)
    const passwordInput = page.getByPlaceholder(/contraseña/i)
    
    await expect(emailInput).toHaveAttribute('required', '')
    await expect(passwordInput).toHaveAttribute('required', '')
  })

  test('should show loading state during login', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByPlaceholder(/correo electrónico/i).fill('test@example.com')
    await page.getByPlaceholder(/contraseña/i).fill('password123')
    
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i })
    await loginButton.click()
    
    // Button should be disabled during loading
    await expect(loginButton).toBeDisabled()
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect to login when accessing inventory without auth', async ({ page }) => {
    await page.goto('/inventory')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect to login when accessing history without auth', async ({ page }) => {
    await page.goto('/history')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect to login when accessing loans without auth', async ({ page }) => {
    await page.goto('/loans')
    await expect(page).toHaveURL(/\/login/)
  })
})
