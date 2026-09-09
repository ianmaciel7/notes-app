import { getStorage } from "firebase-admin/storage";

import { getServerFirebaseAdminApp } from "@/lib/auth/firebase-admin-server";
import type { StorageUploader } from "@/lib/storage/firebase-storage-upload-route";

export function createFirebaseStorageUploader(input: { bucketName?: string } = {}): StorageUploader {
  return async ({ path, contentType, data }) => {
    const bucket = getStorage(getServerFirebaseAdminApp()).bucket(input.bucketName);
    await bucket.file(path).save(data, {
      metadata: { contentType },
      resumable: false,
    });
    return { bucket: bucket.name };
  };
}
