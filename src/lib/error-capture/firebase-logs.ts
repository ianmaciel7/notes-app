import { onLog, setLogLevel } from "firebase/app";
import { captureError } from "./capture";

// @firebase/logger is a transitive dependency, so derive the type from onLog.
type FirebaseLogParams = Parameters<
  NonNullable<Parameters<typeof onLog>[0]>
>[0];

export function handleFirebaseLog({
  level,
  message,
  type,
}: FirebaseLogParams): void {
  captureError(new Error(message), {
    source: "firebase-sdk",
    // Offline/backend-unreachable logs are recoverable: the SDK keeps working
    // from its local cache, so they must not open the dev error overlay.
    severity: "warn",
    context: { level, type },
  });
}

/**
 * The Firebase SDK writes its own errors straight to `console.error`, which
 * bypasses every other capture channel. Mute its console output and route
 * warnings and errors through `captureError` instead.
 *
 * Call this after the Firebase modules are imported: log levels only apply to
 * loggers that already exist, so each Firebase entry module calls it again
 * (it is cheap and safe to repeat) to cover loggers created since.
 */
export function installFirebaseLogCapture(): void {
  setLogLevel("silent");
  onLog(handleFirebaseLog, { level: "warn" });
}
