# Adopt Firebase Authentication with Local Emulator

We needed local development, automated testing, and isolated user identity without external cloud dependencies or real credentials. We adopted Firebase Authentication with the local Firebase Auth Emulator (`port: 9099`, UI on `port: 4000`), integrating native Firebase `User` nomenclature with client-side React 19 `use(AuthContext)` in `src/components/notes-app/auth-provider.tsx` and custom hooks in `src/hooks/use-auth.ts`, supported by pre-seeded test accounts in `firebase/seeds/` and dedicated login routes in `src/app/(auth)/login/`.

## Component Customization Boundary

In accordance with ADR 0008, `src/components/firebase/` remains an immutable vendor directory. All application-consumed authentication forms, screens, and policy handlers (`SignInAuthScreen`, `SignUpAuthScreen`, `SignInAuthForm`, `SignUpAuthForm`, `Policies`) are copied and maintained directly within `src/components/notes-app/`.
