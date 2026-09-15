// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { SpaceProvider, useSpace } from './space-provider'

function SpaceConsumer() {
  const { pathname, sidebarOpen, toggleSidebar } = useSpace()

  return (
    <div>
      <output data-testid="pathname">{pathname}</output>
      <output data-testid="sidebar-state">
        {sidebarOpen ? 'open' : 'closed'}
      </output>
      <button type="button" onClick={toggleSidebar}>
        Toggle
      </button>
    </div>
  )
}

describe('SpaceProvider', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.matchMedia = () =>
      ({
        matches: false,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList
  })

  it('exposes the current pathname and sidebar state', async () => {
    render(
      <SpaceProvider pathname="/cards/review">
        <SpaceConsumer />
      </SpaceProvider>,
    )

    expect(screen.getByTestId('pathname').textContent).toBe('/cards/review')
    expect(screen.getByTestId('sidebar-state').textContent).toBe('open')

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))

    expect(screen.getByTestId('sidebar-state').textContent).toBe('closed')
  })

  it('throws when its hook is used outside the provider', () => {
    expect(() => render(<SpaceConsumer />)).toThrow(
      'useSpace must be used within a SpaceProvider.',
    )
  })
})
