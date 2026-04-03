import Link from "next/link";
import { Activity } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800/50 bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold">
              Content<span className="text-orange-500">Pulse</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">{children}</main>
    </div>
  );
}
