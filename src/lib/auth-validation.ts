import { z } from "zod";

/**
 * Validates and sanitizes a redirection URL to prevent Open Redirect attacks.
 * Only relative URLs starting with a single '/' are permitted.
 */
export function getSafeRedirectUrl(target: string | null | undefined, fallback = "/"): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();
  // Ensure it starts with a single '/' and not '//' (protocol-relative) and has no protocol scheme
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\") &&
    !trimmed.includes("://") &&
    !trimmed.includes("\n") &&
    !trimmed.includes("\r")
  ) {
    return trimmed;
  }

  return fallback;
}

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe o endereço de e-mail.")
  .email("Formato de e-mail inválido.");

export const passwordSchema = z
  .string()
  .min(6, "A senha deve conter no mínimo 6 caracteres.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe a senha."),
});

export const registerSchema = z
  .object({
    displayName: z.string().trim().max(60, "Nome muito longo.").optional(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
