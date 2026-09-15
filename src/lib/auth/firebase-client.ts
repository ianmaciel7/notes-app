'use client'

import { getApps, initializeApp } from 'firebase/app'
import type { User } from 'firebase/auth'
import {
  connectAuthEmulator,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let emulatorConnected = false

function getClientAuth() {
  if (!isFirebaseConfigured()) {
    return null
  }

  const app = getApps()[0] ?? initializeApp(firebaseConfig)
  const auth = getAuth(app)

  if (
    process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === 'true' &&
    !emulatorConnected
  ) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
      disableWarnings: true,
    })
    emulatorConnected = true
  }

  return auth
}

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  )
}

export async function signInWithGoogle() {
  const auth = getClientAuth()
  if (!auth) throw new Error('Firebase Google Auth is not configured')
  const result = await signInWithPopup(auth, new GoogleAuthProvider())
  return result.user
}

export async function getCurrentIdToken() {
  const user = getClientAuth()?.currentUser
  return user ? user.getIdToken() : null
}

export async function signOutFromFirebase() {
  const auth = getClientAuth()
  if (auth) await signOut(auth)
}

export function subscribeToAuthState(onChange: (user: User | null) => void) {
  const auth = getClientAuth()
  if (!auth) {
    onChange(null)
    return () => undefined
  }

  return onAuthStateChanged(auth, onChange)
}
