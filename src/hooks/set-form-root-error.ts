import { FirebaseUIError } from "@firebase-oss/ui-core";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function setFormRootError<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown,
) {
  const message =
    error instanceof FirebaseUIError ? error.message : String(error);
  form.setError("root", { message });
}
