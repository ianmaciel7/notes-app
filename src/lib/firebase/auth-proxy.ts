const PROJECT_ID_PATTERN = /^[a-z0-9-]+$/;

// Firebase's redirect best practice: serve the sign-in helper under the app's
// own domain so browsers that block third-party storage still return the
// redirect result. Requires `authDomain` to be the app domain. See
// https://firebase.google.com/docs/auth/web/redirect-best-practices
export function getAuthProxyRewrites(rawConfig: string | undefined) {
  if (!rawConfig) {
    return [];
  }

  let projectId: unknown;

  try {
    projectId = (JSON.parse(rawConfig) as { projectId?: unknown }).projectId;
  } catch {
    return [];
  }

  if (typeof projectId !== "string" || !PROJECT_ID_PATTERN.test(projectId)) {
    return [];
  }

  return [
    {
      source: "/__/auth/:path*",
      destination: `https://${projectId}.firebaseapp.com/__/auth/:path*`,
    },
  ];
}
