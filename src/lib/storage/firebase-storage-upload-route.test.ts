import { describe, expect, it } from "vitest";

import { createFirebaseAuthVerifier } from "@/lib/auth/firebase-auth";
import { handleAuthenticatedStorageUploadRequest } from "@/lib/storage/firebase-storage-upload-route";

function verifier() {
  return createFirebaseAuthVerifier({
    async verifyIdToken(token) {
      if (token !== "id-token") throw new Error("bad token");
      return { uid: "user-a", email: "user@example.com", email_verified: true };
    },
  });
}

describe("Authenticated Firebase Storage upload route handler", () => {
  it("requires Firebase authentication before storing a blob", async () => {
    let uploaded = false;

    const result = await handleAuthenticatedStorageUploadRequest(
      {
        spaceId: "space-a",
        fileName: "paper.pdf",
        mimeType: "application/pdf",
        fileBase64: Buffer.from("pdf bytes").toString("base64"),
      },
      {
        headers: new Headers(),
        verifier: verifier(),
        createBlobId: () => "blob-a",
        uploader: async () => {
          uploaded = true;
          return { bucket: "demo.appspot.com" };
        },
      },
    );

    expect(result).toEqual({
      status: 401,
      body: { error: "Authentication token is required." },
    });
    expect(uploaded).toBe(false);
  });

  it("rejects non-reader binary types before storing a blob", async () => {
    let uploaded = false;

    const result = await handleAuthenticatedStorageUploadRequest(
      {
        spaceId: "space-a",
        fileName: "notes.exe",
        mimeType: "application/x-msdownload",
        fileBase64: Buffer.from("not a reader file").toString("base64"),
      },
      {
        headers: new Headers({ authorization: "Bearer id-token" }),
        verifier: verifier(),
        createBlobId: () => "blob-a",
        uploader: async () => {
          uploaded = true;
          return { bucket: "demo.appspot.com" };
        },
      },
    );

    expect(result).toEqual({
      status: 400,
      body: { error: "Storage upload payload is invalid." },
    });
    expect(uploaded).toBe(false);
  });

  it("stores valid PDF and EPUB blobs under the authenticated user's Space namespace", async () => {
    const uploads: Array<{ path: string; contentType: string; data: Buffer }> = [];

    const result = await handleAuthenticatedStorageUploadRequest(
      {
        spaceId: "space-a",
        fileName: "retrieval practice.pdf",
        mimeType: "application/pdf",
        fileBase64: Buffer.from("pdf bytes").toString("base64"),
      },
      {
        headers: new Headers({ authorization: "Bearer id-token" }),
        verifier: verifier(),
        createBlobId: () => "blob-a",
        uploader: async (upload) => {
          uploads.push(upload);
          return { bucket: "demo.appspot.com" };
        },
      },
    );

    expect(result).toEqual({
      status: 200,
      body: {
        blobKey: "gs://demo.appspot.com/users/user-a/spaces/space-a/media/blob-a-retrieval-practice.pdf",
        path: "users/user-a/spaces/space-a/media/blob-a-retrieval-practice.pdf",
        sizeBytes: 9,
        mimeType: "application/pdf",
        userId: "user-a",
      },
    });
    expect(uploads).toEqual([
      {
        path: "users/user-a/spaces/space-a/media/blob-a-retrieval-practice.pdf",
        contentType: "application/pdf",
        data: Buffer.from("pdf bytes"),
      },
    ]);
  });
});
