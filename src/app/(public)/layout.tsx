import { AuthProvider } from "@/app/_components/auth-provider";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthProvider>
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
    </AuthProvider>
  );
}
