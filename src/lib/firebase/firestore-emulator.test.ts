import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { describe, expect, it } from "vitest";
import { auth, connectToAuthEmulator } from "./client";
import { connectToFirestoreEmulator, db } from "./firestore";

describe("Firebase Firestore Emulator Integration", () => {
  it("enforces user isolation while exercising CRUD and real-time subscriptions", async () => {
    const [isAuthReachable, isFirestoreReachable] = await Promise.all([
      fetch("http://127.0.0.1:9099")
        .then(() => true)
        .catch(() => false),
      fetch("http://127.0.0.1:8080")
        .then(() => true)
        .catch(() => false),
    ]);

    if (!isAuthReachable || !isFirestoreReachable) {
      return;
    }

    connectToAuthEmulator("127.0.0.1:9099");
    connectToFirestoreEmulator("127.0.0.1", 8080);

    if (auth.currentUser) {
      await signOut(auth);
    }

    const ownerEmail = `firestore-owner-${Date.now()}@notesapp.dev`;
    const ownerPassword = "emulatorPassword123";
    const ownerCredential = await createUserWithEmailAndPassword(
      auth,
      ownerEmail,
      ownerPassword,
    );
    const ownerUid = ownerCredential.user.uid;
    const testId = `integration-doc-${Date.now()}`;
    const testDocRef = doc(
      db,
      "users",
      ownerUid,
      "spaces",
      "integration-space",
      "integration_test_collection",
      testId,
    );

    const initialData = {
      title: "Local First Note",
      content: "Testing offline persistence & emulator CRUD",
      createdAt: Date.now(),
      status: "draft",
    };

    await setDoc(testDocRef, initialData);

    const readSnap = await getDoc(testDocRef);
    expect(readSnap.exists()).toBe(true);
    expect(readSnap.data()?.title).toBe("Local First Note");
    expect(readSnap.data()?.status).toBe("draft");

    let latestStatus = "";
    const unsubscribe = onSnapshot(testDocRef, (snap) => {
      if (snap.exists()) {
        latestStatus = snap.data()?.status;
      }
    });

    await updateDoc(testDocRef, {
      status: "published",
      updatedAt: Date.now(),
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(latestStatus).toBe("published");
    unsubscribe();

    const colRef = collection(
      db,
      "users",
      ownerUid,
      "spaces",
      "integration-space",
      "integration_test_collection",
    );
    const colSnap = await getDocs(colRef);
    expect(colSnap.docs.some((item) => item.id === testId)).toBe(true);

    await signOut(auth);
    await signInAnonymously(auth);

    await expect(getDocFromServer(testDocRef)).rejects.toMatchObject({
      code: "permission-denied",
    });

    await signOut(auth);
    await signInWithEmailAndPassword(auth, ownerEmail, ownerPassword);

    await deleteDoc(testDocRef);
    expect((await getDoc(testDocRef)).exists()).toBe(false);

    await signOut(auth);
  });
});
