import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Desktop 1920x1080',
      use: {
        viewport: { width: 1920, height: 1080 },
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'Notebook 1366x768',
      use: {
        viewport: { width: 1366, height: 768 },
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'iPad Pro 11 Retrato',
      use: {
        ...devices['iPad Pro 11'],
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'iPad Pro 11 Paisagem',
      use: {
        ...devices['iPad Pro 11 landscape'],
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'iPad Mini',
      use: {
        ...devices['iPad Mini'],
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'iPhone 15',
      use: {
        ...devices['iPhone 15'],
        defaultBrowserType: 'chromium',
      },
    },
    {
      name: 'Pixel 7',
      use: {
        ...devices['Pixel 7'],
        defaultBrowserType: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'npx next dev -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 45000,
  },
})
