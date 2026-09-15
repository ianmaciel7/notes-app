import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

export function getServerAuth() {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const usingAuthEmulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST)

  if (!projectId) return null

  const app = getApps()[0] ?? createServerApp()

  function createServerApp() {
    if (usingAuthEmulator) return initializeApp({ projectId })
    if (!clientEmail || !privateKey) return null

    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    })
  }

  if (!app) return null

  return getAuth(app)
}

export function getServerFirestore() {
  const auth = getServerAuth()
  return auth ? getFirestore(auth.app) : null
}
