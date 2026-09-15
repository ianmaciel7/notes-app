// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { SpaceShell } from './space-shell'

describe('SpaceShell', () => {
  beforeEach(() => {
    window.matchMedia = () =>
      ({
        matches: false,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList
  })

  it('renders the space sidebar alongside the page content', () => {
    render(
      <SpaceShell pathname="/">
        <p>Page content</p>
      </SpaceShell>,
    )

    expect(screen.getByText('KnowledgeOS')).toBeTruthy()
    expect(screen.getByText('Overview')).toBeTruthy()
    expect(screen.getByText('All cards')).toBeTruthy()
    expect(screen.queryByText('React fundamentals')).toBeNull()
    expect(screen.getByText('Page content')).toBeTruthy()
  })
})
