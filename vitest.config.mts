import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Espelha o paths "@/*" do tsconfig, que o Vitest não lê por conta própria.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    // Restrito a tests/unit para não colidir com os *.spec.ts do Playwright em tests/e2e.
    include: ['tests/unit/**/*.test.ts'],
  },
})
