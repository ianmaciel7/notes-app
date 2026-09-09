import { createServerFirebaseAuthVerifier } from "@/lib/auth/firebase-admin-server";
import { getGoogleCloudAccessToken } from "@/lib/sync/google-cloud-access-token";
import { handleAuthenticatedSyncPushRequest } from "@/lib/sync/remote-sync-route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request JSON is invalid." }, { status: 400 });
  }

  const result = await handleAuthenticatedSyncPushRequest(body, {
    headers: request.headers,
    verifier: createServerFirebaseAuthVerifier(),
    projectId:
      process.env.FIREBASE_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT ?? process.env.GCLOUD_PROJECT,
    accessToken: process.env.FIRESTORE_ACCESS_TOKEN,
    getAccessToken: process.env.FIRESTORE_ACCESS_TOKEN ? undefined : getGoogleCloudAccessToken,
    databaseId: process.env.FIRESTORE_DATABASE_ID,
  });

  return Response.json(result.body, { status: result.status });
}
