import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { expect, it } from 'vitest'
import { __unstable__loadDesignSystem, loadDesignSystem } from './compile'

it('`loadDesignSystem` resolves stylesheet imports with the default loaders', async () => {
  let base = await fs.mkdtemp(path.join(os.tmpdir(), 'tailwindcss-node-'))
  await fs.writeFile(path.join(base, 'theme.css'), '@theme { --spacing-4: 1rem; }')

  try {
    let design = await loadDesignSystem('@import "./theme.css";', { base })
    let order = new Map(design.getClassOrder(['unknown', 'p-4', 'flex']))

    expect(order.get('unknown')).toBeNull()
    expect(typeof order.get('p-4')).toBe('bigint')
    expect(typeof order.get('flex')).toBe('bigint')
    expect(order.get('flex')! < order.get('p-4')!).toBe(true)
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
})

it('`__unstable__loadDesignSystem` is an alias of `loadDesignSystem`', () => {
  expect(__unstable__loadDesignSystem).toBe(loadDesignSystem)
})
