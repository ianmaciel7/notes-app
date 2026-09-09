import {
  type createFirebaseAuthVerifier,
  requireAuthenticatedUser,
} from "@/lib/auth/firebase-auth";

type AuthVerifier = ReturnType<typeof createFirebaseAuthVerifier>;

export type StorageUploadInput = {
  path: string;
  contentType: string;
  data: Buffer;
};

export type StorageUploader = (input: StorageUploadInput) => Promise<{ bucket: string }>;

type StorageUploadResult = {
  status: number;
  body: Record<string, unknown>;
};

const ACCEPTED_READER_MIME_TYPES = new Set(["application/pdf", "application/epub+zip"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isReaderMimeType(value: string) {
  return ACCEPTED_READER_MIME_TYPES.has(value);
}

function sanitizeFileName(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
  return normalized || "upload.bin";
}

function parseBase64(value: string) {
  const normalized = value.trim();
  if (!normalized || normalized.length % 4 !== 0) return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalized)) return null;
  return Buffer.from(normalized, "base64");
}

function parseUploadBody(body: unknown) {
  if (!isRecord(body)) return null;
  if (typeof body.spaceId !== "string" || body.spaceId.trim().length === 0) return null;
  if (typeof body.fileName !== "string" || body.fileName.trim().length === 0) return null;
  if (typeof body.mimeType !== "string" || !isReaderMimeType(body.mimeType.trim())) return null;
  if (typeof body.fileBase64 !== "string") return null;

  const data = parseBase64(body.fileBase64);
  if (!data || data.byteLength === 0) return null;

  return {
    spaceId: body.spaceId.trim(),
    fileName: sanitizeFileName(body.fileName),
    mimeType: body.mimeType.trim(),
    data,
  };
}

export async function handleAuthenticatedStorageUploadRequest(
  body: unknown,
  dependencies: {
    headers: Headers;
    verifier: AuthVerifier;
    uploader: StorageUploader;
    createBlobId?: () => string;
  },
): Promise<StorageUploadResult> {
  let user: { uid: string; email?: string };
  try {
    user = await requireAuthenticatedUser(dependencies.headers, dependencies.verifier);
  } catch (error) {
    return {
      status: 401,
      body: { error: error instanceof Error ? error.message : "Authentication failed." },
    };
  }

  const parsed = parseUploadBody(body);
  if (!parsed) {
    return { status: 400, body: { error: "Storage upload payload is invalid." } };
  }

  const blobId = dependencies.createBlobId?.() ?? crypto.randomUUID();
  const path = [
    "users",
    encodeURIComponent(user.uid),
    "spaces",
    encodeURIComponent(parsed.spaceId),
    "media",
    `${blobId}-${parsed.fileName}`,
  ].join("/");

  try {
    const uploaded = await dependencies.uploader({
      path,
      contentType: parsed.mimeType,
      data: parsed.data,
    });

    return {
      status: 200,
      body: {
        blobKey: `gs://${uploaded.bucket}/${path}`,
        path,
        sizeBytes: parsed.data.byteLength,
        mimeType: parsed.mimeType,
        userId: user.uid,
      },
    };
  } catch {
    return { status: 502, body: { error: "Storage upload failed." } };
  }
}
