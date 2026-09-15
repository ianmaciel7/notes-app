// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import messages from '@/messages/en.json'
import { SpaceShell } from './space-shell'

describe('SpaceShell', () => {
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

  it('renders the space sidebar alongside the page content', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SpaceShell pathname="/">
          <p>Page content</p>
        </SpaceShell>
      </NextIntlClientProvider>,
    )

    expect(screen.getByText('KnowledgeOS')).toBeTruthy()
    expect(screen.getByText('Overview')).toBeTruthy()
    expect(screen.getByText('All cards')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Overview' }).getAttribute('href'),
    ).toBe('/')
    expect(
      screen.getByRole('link', { name: 'Settings' }).getAttribute('href'),
    ).toBe('/settings')
    expect(screen.getByRole('button', { name: 'Switch space' })).toBeTruthy()
    expect(screen.queryByText('React fundamentals')).toBeNull()
    expect(screen.getByText('Page content')).toBeTruthy()
  })

  it('keeps nested card routes active and exposes the current page', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SpaceShell pathname="/cards/review">
          <p>Review content</p>
        </SpaceShell>
      </NextIntlClientProvider>,
    )

    expect(
      screen
        .getByRole('link', { name: 'All cards' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      screen
        .getByRole('link', { name: 'Overview' })
        .getAttribute('aria-current'),
    ).toBeNull()
  })

  it('marks settings as the current page', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SpaceShell pathname="/settings">
          <p>Settings content</p>
        </SpaceShell>
      </NextIntlClientProvider>,
    )

    expect(
      screen
        .getByRole('link', { name: 'Settings' })
        .getAttribute('aria-current'),
    ).toBe('page')
  })
})
