# Adopt Firebase Open Source Auth UI Components

We needed production-ready, accessible authentication and multi-factor authentication UI components integrated with `@firebase-oss/ui-core` and `@firebase-oss/ui-react`. We integrated the Firebase Open Source UI components into `src/components/firebase` via the `@firebase` registry (`https://firebaseopensource.com/r/{name}.json`), providing modular auth flows (sign-in, sign-up, phone auth, email link, OAuth, SMS MFA, and TOTP MFA) matching our Base UI / shadcn design system while skipping linter and duplicate checks on external vendor templates.

## Immutability Rule for Vendor Components

The `src/components/firebase/` directory is treated strictly as an immutable upstream vendor registry drop. Files in `src/components/firebase/` must never undergo direct modifications in the repository. Whenever a component requires adaptation, bug fixing, styling tweaks, or application-specific wiring, developers must copy the component into `src/components/notes-app/` and maintain the customized version there.
