import { describe, expect, it } from 'vitest'
import { POST } from './route'

describe('POST /api/reviews', () => {
  it('rejects review writes without a Firebase token', async () => {
    const response = await POST(
      new Request('http://localhost/api/reviews', {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    )

    expect(response.status).toBe(401)
  })
})
