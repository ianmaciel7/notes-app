import { multiFactor, type User } from "firebase/auth";

type SecondFactor = { name: string; uid: string };

export type SecondFactorSnapshot = {
  email: string | null;
  emailVerified: boolean;
  factors: SecondFactor[];
};

/** Plain copy of the account state that second-factor settings depend on. */
export function readSecondFactorSnapshot(user: User): SecondFactorSnapshot {
  return {
    email: user.email,
    emailVerified: user.emailVerified,
    factors: multiFactor(user).enrolledFactors.map((factor) => ({
      name:
        factor.displayName ??
        ("phoneNumber" in factor
          ? String(factor.phoneNumber)
          : factor.factorId),
      uid: factor.uid,
    })),
  };
}
