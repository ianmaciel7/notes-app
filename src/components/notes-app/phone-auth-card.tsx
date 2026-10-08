"use client";

import type { User } from "firebase/auth";
import type { PropsWithChildren } from "react";
import { MultiFactorAuthAssertionCard } from "@/components/notes-app/multi-factor-auth-assertion-card";
import { PhoneAuthForm } from "@/components/notes-app/phone-auth-form";
import { RedirectError } from "@/components/notes-app/redirect-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSignInCard } from "@/hooks/use-sign-in-card";

export type PhoneAuthCardProps = PropsWithChildren<{
  onSignIn?: (user: User) => void;
}>;

export function PhoneAuthCard({ children, onSignIn }: PhoneAuthCardProps) {
  const { titleText, subtitleText, hasMultiFactorResolver } =
    useSignInCard(onSignIn);

  if (hasMultiFactorResolver) {
    return <MultiFactorAuthAssertionCard />;
  }

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <PhoneAuthForm />
          {children ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-col gap-2">
                {children}
                <RedirectError />
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
