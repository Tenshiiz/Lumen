import { test, expect } from '@playwright/test'

test.describe('Responsividade e Integridade Visual Multi-Dispositivo', () => {
  test('deve renderizar a interface íntegra, sem sobreposição e com canvas total', async ({ page }, testInfo) => {
    await page.goto('/')

    // Aguarda o motor da cidade concluir a renderização do primeiro quadro
    await page.waitForSelector('[data-pronto="true"]', { timeout: 12000 })

    const topo = page.locator('header').first()
    const disco = page.locator('.peitoril-disco')
    const peitoril = page.locator('.peitoril')
    const canvasCena = page.locator('canvas').first()

    await expect(topo).toBeVisible()
    await expect(disco).toBeVisible()
    await expect(peitoril).toBeVisible()
    await expect(canvasCena).toBeVisible()

    const topoBox = await topo.boundingBox()
    const discoBox = await disco.boundingBox()
    const peitorilBox = await peitoril.boundingBox()
    const viewport = page.viewportSize()

    expect(topoBox).not.toBeNull()
    expect(discoBox).not.toBeNull()
    expect(peitorilBox).not.toBeNull()
    expect(viewport).not.toBeNull()

    if (topoBox && discoBox && peitorilBox && viewport) {
      // 1. O disco nunca deve sobrepor o cabeçalho superior
      expect(discoBox.y).toBeGreaterThanOrEqual(topoBox.y + topoBox.height)

      // 2. Posicionamento horizontal: centralizado no mobile e na coluna nobre do Ateliê no desktop
      const centroDiscoX = discoBox.x + discoBox.width / 2
      const centroTelaX = viewport.width / 2

      if (viewport.width >= 1080) {
        // No modo ateliê desktop, o disco fica na coluna esquerda e o painel de contexto à direita
        expect(centroDiscoX).toBeLessThan(centroTelaX)
        const painelContexto = page.locator('aside[aria-label*="Painel de Análise"]')
        await expect(painelContexto).toBeVisible()

        // Valida alternância para a aba de Imagem e presença do extrator
        const abaImagem = page.getByRole('button', { name: /^Imagem$/i })
        if (await abaImagem.isVisible()) {
          await abaImagem.click()
          await expect(page.getByRole('button', { name: /Carregar Imagem/i })).toBeVisible()
          // Retorna para a aba de Análise
          await page.getByRole('button', { name: /Análise & Harmonias/i }).click()
        }
      } else {
        // Em telas compactas e mobile, o disco é centralizado na tela
        expect(Math.abs(centroDiscoX - centroTelaX)).toBeLessThan(15)
      }

      // 3. Em telas desktop/notebook/ipad (altura > 600), o disco não deve ultrapassar a viewport inicial
      if (viewport.height >= 600) {
        expect(discoBox.y + discoBox.height).toBeLessThanOrEqual(viewport.height)
      }

      // 4. O canvas cobre 100% da largura e altura visíveis
      const canvasBox = await canvasCena.boundingBox()
      expect(canvasBox).not.toBeNull()
      if (canvasBox) {
        expect(canvasBox.width).toBeGreaterThanOrEqual(viewport.width)
        expect(canvasBox.height).toBeGreaterThanOrEqual(viewport.height)
      }
    }

    // Captura screenshot para conferência visual de cada tela
    const nomeSanitizado = testInfo.project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    await page.screenshot({
      path: `tests/e2e/screenshots/${nomeSanitizado}.png`,
      fullPage: false,
    })
  })
})

