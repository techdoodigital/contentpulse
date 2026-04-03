import AppShell from "@/components/app-shell";
import AuthSessionProvider from "@/components/session-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <AppShell>{children}</AppShell>
    </AuthSessionProvider>
  );
}
