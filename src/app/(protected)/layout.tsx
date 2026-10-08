import { AuthProvider } from "@/components/notes-app/auth-provider";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return <AuthProvider>{children}</AuthProvider>;
}
