import { AuthProvider } from "@/app/_components/auth-provider";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return <AuthProvider>{children}</AuthProvider>;
}
