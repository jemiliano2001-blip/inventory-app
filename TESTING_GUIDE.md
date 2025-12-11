# 🧪 Testing Guide

Complete testing setup for the Inventory Management System.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Coverage](#coverage)
- [CI/CD Integration](#cicd-integration)

## 🎯 Overview

This project uses a comprehensive testing strategy:

- **Unit Tests:** Jest + React Testing Library
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright
- **Coverage Target:** 70%+ for all metrics

## 📦 Installation

### Install Dependencies

Run this command in your terminal (PowerShell):

```powershell
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest @playwright/test
```

### Initialize Playwright

```powershell
npx playwright install
```

## 🚀 Running Tests

### Unit & Component Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

## 📁 Test Structure

```
my-inventory-app/
├── src/
│   ├── utils/
│   │   ├── __tests__/
│   │   │   ├── debounce.test.ts
│   │   │   └── validation.test.ts
│   │   ├── debounce.ts
│   │   └── validation.ts
│   │
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── ErrorBoundary.test.tsx
│   │   │   └── Header.test.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Header.tsx
│   │
│   └── test-utils/
│       └── index.tsx          # Test utilities & helpers
│
├── e2e/
│   ├── auth.spec.ts          # Authentication E2E tests
│   └── inventory.spec.ts     # Inventory E2E tests
│
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup & mocks
└── playwright.config.ts      # Playwright configuration
```

## ✍️ Writing Tests

### Unit Tests

```typescript
// src/utils/__tests__/myUtil.test.ts
import { myFunction } from '../myUtil'

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input')
    expect(result).toBe('expected')
  })

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('')
    expect(myFunction(null)).toBeNull()
  })
})
```

### Component Tests

```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<MyComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### E2E Tests

```typescript
// e2e/feature.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform action', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('button', { name: /click me/i }).click()
    
    await expect(page.getByText('Success')).toBeVisible()
  })
})
```

## 📊 Coverage

### Coverage Reports

After running `npm run test:coverage`, view the report at:

```
coverage/lcov-report/index.html
```

### Coverage Thresholds

```javascript
{
  branches: 70,
  functions: 70,
  lines: 70,
  statements: 70
}
```

### Current Coverage

| Type | Files | Coverage |
|------|-------|----------|
| Utilities | 2/2 | 100% |
| Components | 2/∞ | In Progress |

## 🔧 Configuration

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

## 🚨 Mocking

### Firebase Mocks

```javascript
// jest.setup.js
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  // ... other mocks
}))
```

### Next.js Router Mock

```javascript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
}))
```

## 🔄 CI/CD Integration

### GitHub Actions

`.github/workflows/ci.yml` is configured to:

1. Run linter
2. Run type check
3. Run unit & component tests
4. Generate coverage report
5. Build application
6. Run E2E tests (optional)

### Running Locally

```bash
# Simulate CI environment
npm run test:ci
npx tsc --noEmit
npm run lint
npm run build
```

## 📝 Test Utilities

### Custom Render

```typescript
import { render } from '@/test-utils'

// Automatically wraps with providers
render(<MyComponent />)
```

### Mock Data

```typescript
import { mockInventoryItem, mockUser } from '@/test-utils'

const item = mockInventoryItem
const user = mockUser
```

## 🎯 Testing Best Practices

### 1. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - testing implementation
expect(component.state.count).toBe(1)

// ✅ Good - testing user-visible behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument()
```

### 2. Use Semantic Queries

```typescript
// ✅ Preferred order
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/email/i)
screen.getByPlaceholderText(/search/i)
screen.getByText(/welcome/i)

// ❌ Avoid
screen.getByTestId('submit-button')
```

### 3. Test Accessibility

```typescript
it('should have proper ARIA labels', () => {
  render(<SearchInput />)
  
  expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
  expect(screen.getByRole('searchbox')).toBeInTheDocument()
})
```

### 4. Async Testing

```typescript
// ✅ Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ✅ Or findBy queries (which wait automatically)
expect(await screen.findByText('Loaded')).toBeInTheDocument()
```

## 🐛 Debugging Tests

### View Test Output

```bash
npm test -- --verbose
```

### Debug Specific Test

```bash
npm test -- MyComponent.test.tsx
```

### Playwright Debug Mode

```bash
npx playwright test --debug
```

### Generate Playwright Report

```bash
npx playwright show-report
```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Testing Checklist

### Before Committing
- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Coverage meets threshold
- [ ] No console errors in tests
- [ ] Tests are deterministic (no flaky tests)

### For New Features
- [ ] Unit tests for utilities
- [ ] Component tests for UI
- [ ] Integration tests for flows
- [ ] E2E tests for critical paths
- [ ] Accessibility tests

---

**Last Updated:** December 11, 2025  
**Test Coverage:** 70%+ target  
**Total Tests:** 30+ (unit + component + E2E)
