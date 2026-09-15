'use client'

import { getApps, initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
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

function getClientAuth() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return null
  }

  const app = getApps()[0] ?? initializeApp(firebaseConfig)
  return getAuth(app)
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
