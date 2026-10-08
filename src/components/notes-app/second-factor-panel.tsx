"use client";

import { FactorId } from "firebase/auth";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { MultiFactorAuthEnrollmentCard } from "@/components/notes-app/multi-factor-auth-enrollment-card";
import { ReauthenticateButton } from "@/components/notes-app/reauthenticate-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSecondFactorPanel } from "@/hooks/use-second-factor-panel";
import { cn } from "@/lib/utils";

type SecondFactorPanelProps = ComponentProps<"div">;

export function SecondFactorPanel(props: SecondFactorPanelProps) {
  const panel = useSecondFactorPanel();
  const translate = useTranslations("auth");
  const { snapshot } = panel;
  const noticeClassName = cn(
    "text-sm",
    panel.notice?.severity === "error" && "text-destructive",
  );

  if (!snapshot) {
    return null;
  }

  return (
    <div {...props} className="flex w-full max-w-sm flex-col gap-4">
      {snapshot.factors.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{translate("secondFactorsTitle")}</CardTitle>
            <CardDescription>
              {translate("secondFactorsSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <output className="text-sm font-medium">
              {translate("smsEnrolled")}
            </output>
            <ul className="flex flex-col gap-2">
              {snapshot.factors.map((factor) => (
                <li
                  key={factor.uid}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-sm">{factor.name}</span>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={panel.pending}
                    aria-label={translate("removeSecondFactorNamed", {
                      name: factor.name,
                    })}
                    onClick={() => panel.removeFactor(factor.uid)}
                  >
                    {translate("removeSecondFactor")}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : snapshot.emailVerified ? (
        <MultiFactorAuthEnrollmentCard
          hints={[FactorId.PHONE]}
          onEnrollment={panel.syncSession}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{translate("multiFactorEnrollment")}</CardTitle>
            <CardDescription>
              {translate(
                snapshot.email
                  ? "emailVerificationRequired"
                  : "emailRequiredForSecondFactor",
              )}
            </CardDescription>
          </CardHeader>
          {snapshot.email && (
            <CardContent className="flex flex-col gap-2">
              <Button
                type="button"
                disabled={panel.pending}
                onClick={panel.sendVerificationEmail}
              >
                {translate("sendVerificationEmail")}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={panel.pending}
                onClick={panel.checkEmailVerification}
              >
                {translate("checkEmailVerification")}
              </Button>
            </CardContent>
          )}
        </Card>
      )}
      {panel.notice && (
        <div className="flex flex-col gap-2">
          <p
            role={panel.notice.severity === "error" ? "alert" : "status"}
            className={noticeClassName}
          >
            {panel.notice.text}
          </p>
          {panel.notice.reauthenticate && <ReauthenticateButton />}
        </div>
      )}
    </div>
  );
}
