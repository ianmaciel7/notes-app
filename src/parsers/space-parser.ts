import type { DocumentSnapshot } from "firebase/firestore";
import type { Space } from "@/domain/space";
import { parseDate } from "@/lib/parser";

const REQUIRED_STRINGS = ["ownerId", "name", "icon"] as const;

export function parseSpace(snapshot: DocumentSnapshot): Space | null {
  // "estimate" gives pending serverTimestamp() fields a local value.
  const data = snapshot.data({ serverTimestamps: "estimate" });
  const createdAt = parseDate(data?.createdAt);
  const updatedAt = parseDate(data?.updatedAt);

  if (
    !(data && createdAt && updatedAt) ||
    typeof data.stateVersion !== "number" ||
    !REQUIRED_STRINGS.every((key) => typeof data[key] === "string")
  ) {
    return null;
  }

  return {
    id: snapshot.id,
    ownerId: data.ownerId,
    name: data.name,
    ...(typeof data.description === "string" && {
      description: data.description,
    }),
    icon: data.icon,
    stateVersion: data.stateVersion,
    createdAt,
    updatedAt,
  };
}

export function parseSpaces(snapshots: DocumentSnapshot[]): Space[] {
  return snapshots.flatMap((snapshot) => parseSpace(snapshot) ?? []);
}
