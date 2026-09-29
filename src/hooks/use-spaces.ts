"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/firestore";
import { validateCreateSpaceInput } from "@/lib/validators/space";
import type {
  CreateSpaceInput,
  Space,
  SpaceFirestoreDocument,
} from "@/types/space";

export interface UseSpacesResult {
  spaces: Space[];
  loading: boolean;
  error: Error | null;
  createSpace: (input: CreateSpaceInput) => Promise<string>;
}

export function useSpaces(): UseSpacesResult {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setSpaces([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const spacesRef = collection(db, "users", user.uid, "spaces");
    const spacesQuery = query(spacesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      spacesQuery,
      (snapshot) => {
        const loadedSpaces: Space[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Space;
          return {
            ...data,
            id: docSnap.id,
          };
        });
        setSpaces(loadedSpaces);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const createSpace = async (input: CreateSpaceInput): Promise<string> => {
    if (!user) {
      throw new Error("Must be authenticated to create a space");
    }

    const validation = validateCreateSpaceInput(input);
    if (!validation.success || !validation.data) {
      const errorMsg =
        validation.fieldErrors?.name ||
        validation.fieldErrors?.icon ||
        validation.error ||
        "Invalid space data";
      throw new Error(errorMsg);
    }

    const spaceId = crypto.randomUUID();
    const spaceDocRef = doc(db, "users", user.uid, "spaces", spaceId);

    const newSpace: SpaceFirestoreDocument = {
      id: spaceId,
      ownerId: user.uid,
      name: validation.data.name,
      description: validation.data.description ?? "",
      icon: validation.data.icon ?? "folder",
      stateVersion: 1,
      schemaVersion: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(spaceDocRef, newSpace);
    return spaceId;
  };

  return {
    spaces,
    loading,
    error,
    createSpace,
  };
}
