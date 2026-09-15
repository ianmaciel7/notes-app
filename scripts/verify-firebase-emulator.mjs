const emulatorUrl =
  'http://127.0.0.1:9099/emulator/v1/projects/demo-notes-app/config'

const response = await fetch(emulatorUrl)
if (!response.ok) {
  throw new Error(`Firebase Auth Emulator returned HTTP ${response.status}`)
}

const config = await response.json()
if (!config.signIn) {
  throw new Error('Firebase Auth Emulator returned an invalid configuration')
}

console.log('Firebase Auth Emulator is ready')
