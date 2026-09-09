export type FirebaseDecodedToken = {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export type AuthenticatedUser = {
  uid: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
};

export type FirebaseIdTokenAdapter = {
  verifyIdToken(token: string): Promise<FirebaseDecodedToken>;
};

export type FirebaseAdminAuthLike = {
  verifyIdToken(token: string): Promise<FirebaseDecodedToken>;
};

export function extractBearerToken(headers: Headers) {
  const authorization = headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export function createFirebaseAdminAuthAdapter(
  adminAuth: FirebaseAdminAuthLike,
): FirebaseIdTokenAdapter {
  return {
    verifyIdToken(token) {
      return adminAuth.verifyIdToken(token);
    },
  };
}

export function createFirebaseAuthVerifier(adapter: FirebaseIdTokenAdapter) {
  async function verify(token: string): Promise<AuthenticatedUser> {
    try {
      const decoded = await adapter.verifyIdToken(token);
      return {
        uid: decoded.uid,
        email: decoded.email,
        emailVerified: Boolean(decoded.email_verified),
        displayName: decoded.name,
        photoURL: decoded.picture,
      };
    } catch {
      throw new Error("Authentication token is invalid.");
    }
  }

  return { verify };
}

export async function requireAuthenticatedUser(
  headers: Headers,
  verifier: ReturnType<typeof createFirebaseAuthVerifier>,
) {
  const token = extractBearerToken(headers);
  if (!token) throw new Error("Authentication token is required.");
  return verifier.verify(token);
}
