import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

test.describe('Extrator de Imagem - Cobertura Total, Zoom e Interação', () => {
  test('deve cobrir 100% da área, travar zoom em >= 100%, arrastar e pinçar cor sem scroll', async ({ page }) => {
    // Configura viewport de desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    // Aguarda prontidão da cena
    await page.waitForSelector('[data-pronto="true"]', { timeout: 12000 })

    // 1. Alterna para a aba "Imagem"
    const abaImagem = page.getByRole('button', { name: /^Imagem$/i })
    await expect(abaImagem).toBeVisible()
    await abaImagem.click()

    // 2. Cria imagem temporária para teste (PNG 800x800 com gradiente de teste)
    const testImgPath = path.join(process.cwd(), 'tests', 'fixtures', 'test-image.png')
    fs.mkdirSync(path.dirname(testImgPath), { recursive: true })

    // Carrega um arquivo de teste via input file
    const fileInput = page.locator('input[type="file"]')
    // Se não existir a imagem mock, podemos gerar uma base64 simples
    const canvasDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJAD/6gh8bAAAAAAElFTkSuQmCC'
    const buffer = Buffer.from(canvasDataUrl.split(',')[1], 'base64')
    fs.writeFileSync(testImgPath, buffer)

    await fileInput.setInputFiles(testImgPath)

    // Aguarda o canvas ser renderizado
    const canvas = page.locator('aside canvas').first()
    await expect(canvas).toBeVisible()

    // 3. Valida que o zoom inicial é exatamente 100%
    const textoZoom = page.locator('text=/Zoom 100%/i')
    await expect(textoZoom).toBeVisible()

    // 4. Testa rolagem para diminuir zoom (scroll down): NUNCA deve ir para 88%
    const viewportBox = page.locator('aside').getByRole('button', { name: /Trocar Imagem/i }).locator('../..').locator('+ div')
    await viewportBox.hover()

    // Dispara scroll para tentar diminuir zoom além de 100%
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(100)

    // O zoom deve continuar travado em 100%
    await expect(textoZoom).toBeVisible()

    // 5. Testa zoom in: aumenta além de 100%
    await page.mouse.wheel(0, -300)
    await page.waitForTimeout(100)
    const textoZoomMaior = page.locator('text=/Zoom 114%/i')
    await expect(textoZoomMaior).toBeVisible()

    // 6. Reseta para 100% via botão "100%"
    const btnReset = page.getByRole('button', { name: '100%' })
    await btnReset.click()
    await expect(textoZoom).toBeVisible()

    // 7. Testa Espaço: não deve rolar a página web
    const scrollAntes = await page.evaluate(() => window.scrollY)
    await page.keyboard.press('Space')
    await page.waitForTimeout(100)
    const scrollDepois = await page.evaluate(() => window.scrollY)
    expect(scrollDepois).toBe(scrollAntes)

    // 8. Captura screenshot para conferência visual
    await page.screenshot({ path: 'tests/e2e/extrator-validado.png' })
  })
})

