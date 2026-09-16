import type { ReactNode } from "react";
import { Archive, Library, Settings2, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface AppFrameProps {
  children: ReactNode;
  active?: "decks" | "backup";
}

export function AppFrame({ children, active }: AppFrameProps) {
  return (
    <div className="app-shell">
      <aside className="side-nav" aria-label="Navegação principal">
        <Link className="brand" href="/" aria-label="Revisa, início"><span className="brand-mark"><Sparkles size={17} /></span><span>Revisa</span></Link>
        <nav className="nav-list">
          <Link className={`nav-item ${active === "decks" ? "nav-item-active" : ""}`} href="/"><Library size={18} /><span>Baralhos</span></Link>
          <Link className={`nav-item ${active === "backup" ? "nav-item-active" : ""}`} href="/backup"><Archive size={18} /><span>Backup</span></Link>
        </nav>
        <div className="nav-footer"><Settings2 size={16} /><span>Dados salvos neste dispositivo</span></div>
      </aside>
      <main className="main-area">
        <header className="mobile-header">
          <Link className="brand" href="/" aria-label="Revisa, início"><span className="brand-mark"><Sparkles size={16} /></span><span>Revisa</span></Link>
          <Button render={<Link href="/backup" />} nativeButton={false} variant="outline" size="icon-lg" aria-label="Abrir backup"><Archive /></Button>
        </header>
        {children}
      </main>
    </div>
  );
}
