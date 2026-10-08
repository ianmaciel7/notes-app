"use client";

import type { User } from "firebase/auth";
import type { PropsWithChildren } from "react";
import { MultiFactorAuthAssertionCard } from "@/components/notes-app/multi-factor-auth-assertion-card";
import { Policies } from "@/components/notes-app/policies";
import { RedirectError } from "@/components/notes-app/redirect-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignInCard } from "@/hooks/use-sign-in-card";

export type OAuthCardProps = PropsWithChildren<{
  onSignIn?: (user: User) => void;
}>;

export function OAuthCard({ children, onSignIn }: OAuthCardProps) {
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
          <div className="flex flex-col gap-2">{children}</div>
          <div className="mt-4 flex flex-col gap-4">
            <RedirectError />
            <Policies />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
