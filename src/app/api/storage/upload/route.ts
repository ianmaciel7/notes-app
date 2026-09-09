import { createServerFirebaseAuthVerifier } from "@/lib/auth/firebase-admin-server";
import { createFirebaseStorageUploader } from "@/lib/storage/firebase-storage-server";
import { handleAuthenticatedStorageUploadRequest } from "@/lib/storage/firebase-storage-upload-route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request JSON is invalid." }, { status: 400 });
  }

  const result = await handleAuthenticatedStorageUploadRequest(body, {
    headers: request.headers,
    verifier: createServerFirebaseAuthVerifier(),
    uploader: createFirebaseStorageUploader({
      bucketName: process.env.FIREBASE_STORAGE_BUCKET,
    }),
  });

  return Response.json(result.body, { status: result.status });
}
