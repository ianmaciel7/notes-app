import { useUI } from "@firebase-oss/ui-react";
import {
  multiFactor,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSignOutButton } from "@/hooks/use-sign-out-button";
import { classifyAuthFailure } from "@/lib/firebase/auth-error";
import {
  readSecondFactorSnapshot,
  type SecondFactorSnapshot,
} from "@/lib/firebase/second-factors";
import { createServerSession } from "@/lib/firebase/session-client";

type PanelNotice = {
  reauthenticate?: boolean;
  severity: "error" | "info";
  text: string;
};

export function useSecondFactorPanel() {
  const ui = useUI();
  const translate = useTranslations("auth");
  const { handleSignOut } = useSignOutButton();
  // `undefined` while Firebase restores the browser session.
  const [snapshot, setSnapshot] = useState<
    SecondFactorSnapshot | null | undefined
  >();
  const [notice, setNotice] = useState<PanelNotice | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(ui.auth, (user) => {
      if (!user) {
        setSnapshot(null);
        return;
      }

      setSnapshot(readSecondFactorSnapshot(user));
      // The e-mail may have been verified elsewhere since the last token.
      user
        .reload()
        .then(() => setSnapshot(readSecondFactorSnapshot(user)))
        .catch(() => undefined);
    });
  }, [ui.auth]);

  // Enrolling or removing a factor makes Firebase revoke the other sessions,
  // so the server cookie is re-issued from a fresh token. If the revocation
  // reached this browser too, the user is signed out and sent to sign in.
  async function syncSession() {
    const user = ui.auth.currentUser;
    if (!user) {
      await handleSignOut();
      return;
    }

    setSnapshot(readSecondFactorSnapshot(user));
    try {
      await createServerSession(await user.getIdToken(true));
    } catch {
      setNotice({ severity: "error", text: translate("sessionFailed") });
    }
  }

  async function removeFactor(uid: string) {
    const user = ui.auth.currentUser;
    if (!user || pending) {
      return;
    }

    setPending(true);
    setNotice(null);
    try {
      await multiFactor(user).unenroll(uid);
    } catch (error) {
      const requiresRecentLogin =
        classifyAuthFailure(error) === "requiresRecentLogin";
      setNotice({
        reauthenticate: requiresRecentLogin,
        severity: "error",
        text: translate(
          requiresRecentLogin
            ? "requiresRecentLogin"
            : "removeSecondFactorError",
        ),
      });
      setPending(false);
      return;
    }

    setPending(false);
    await syncSession();
  }

  async function sendVerificationEmail() {
    const user = ui.auth.currentUser;
    if (!user || pending) {
      return;
    }

    setPending(true);
    setNotice(null);
    try {
      await sendEmailVerification(user);
      setNotice({ severity: "info", text: translate("verificationEmailSent") });
    } catch {
      setNotice({
        severity: "error",
        text: translate("verificationEmailError"),
      });
    } finally {
      setPending(false);
    }
  }

  // The ID token carries `email_verified`, so it is refreshed with the user.
  async function checkEmailVerification() {
    const user = ui.auth.currentUser;
    if (!user || pending) {
      return;
    }

    setPending(true);
    setNotice(null);
    try {
      await user.reload();
      await user.getIdToken(true);
      setSnapshot(readSecondFactorSnapshot(user));
      if (!user.emailVerified) {
        setNotice({
          severity: "info",
          text: translate("emailVerificationRequired"),
        });
      }
    } catch {
      setNotice({
        severity: "error",
        text: translate("verificationEmailError"),
      });
    } finally {
      setPending(false);
    }
  }

  return {
    checkEmailVerification,
    notice,
    pending,
    removeFactor,
    sendVerificationEmail,
    snapshot,
    syncSession,
  };
}
