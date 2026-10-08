import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/lib/firebase/identity";

export const instant = false;

export default async function Home() {
  const identity = await getCurrentIdentity();

  redirect(identity ? "/dashboard" : "/sign-in");
}
