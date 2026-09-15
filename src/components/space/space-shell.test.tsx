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

  it('renders the study sidebar alongside the page content', () => {
    render(
      <SpaceShell pathname="/study">
        <p>Study content</p>
      </SpaceShell>,
    )

    expect(screen.getByText('KnowledgeOS')).toBeTruthy()
    expect(screen.getByText('React fundamentals')).toBeTruthy()
    expect(screen.getByText('Study content')).toBeTruthy()
  })
})
