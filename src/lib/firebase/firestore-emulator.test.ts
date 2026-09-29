import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { describe, expect, it } from "vitest";
import { connectToFirestoreEmulator, db } from "./firestore";

describe("Firebase Firestore Emulator Integration", () => {
  it("performs end-to-end CRUD and real-time subscription against Firestore emulator if reachable", async () => {
    const isEmulatorReachable = await fetch("http://127.0.0.1:8080")
      .then(() => true)
      .catch(() => false);

    if (!isEmulatorReachable) {
      // Graceful fallback for hermetic CI / environments without running emulator daemon
      return;
    }

    connectToFirestoreEmulator("127.0.0.1", 8080);

    const testId = `integration-doc-${Date.now()}`;
    const testDocRef = doc(db, "integration_test_collection", testId);

    // 1. Create (setDoc)
    const initialData = {
      title: "Local First Note",
      content: "Testing offline persistence & emulator CRUD",
      createdAt: Date.now(),
      status: "draft",
    };

    await setDoc(testDocRef, initialData);

    // 2. Read (getDoc)
    const readSnap = await getDoc(testDocRef);
    expect(readSnap.exists()).toBe(true);
    expect(readSnap.data()?.title).toBe("Local First Note");
    expect(readSnap.data()?.status).toBe("draft");

    // 3. Real-time listener (onSnapshot)
    let snapshotCount = 0;
    let latestStatus = "";

    const unsubscribe = onSnapshot(testDocRef, (snap) => {
      if (snap.exists()) {
        snapshotCount++;
        latestStatus = snap.data()?.status;
      }
    });

    // 4. Update (updateDoc)
    await updateDoc(testDocRef, {
      status: "published",
      updatedAt: Date.now(),
    });

    // Allow time for snapshot event
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(latestStatus).toBe("published");
    unsubscribe();

    // 5. Query collection (getDocs)
    const colRef = collection(db, "integration_test_collection");
    const colSnap = await getDocs(colRef);
    expect(colSnap.empty).toBe(false);
    expect(colSnap.docs.some((d) => d.id === testId)).toBe(true);

    // 6. Delete (deleteDoc)
    await deleteDoc(testDocRef);
    const deletedSnap = await getDoc(testDocRef);
    expect(deletedSnap.exists()).toBe(false);
  });
});
