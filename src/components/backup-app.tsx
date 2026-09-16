"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Download, FileCheck2, ShieldCheck, Upload } from "lucide-react";

import { AppFrame } from "@/components/app-frame";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseBackup } from "@/lib/backup";
import { createBackup, db, replaceDatabase } from "@/lib/db";
import type { BackupEnvelope } from "@/lib/types";

export function BackupApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pendingBackup, setPendingBackup] = useState<BackupEnvelope | null>(null);
  const counts = useLiveQuery(async () => ({ decks: await db.decks.count(), cards: await db.cards.count() }), []);

  async function handleExport() {
    const backup = await createBackup(db);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `revisa-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setError("");
    setMessage("Backup exportado com sucesso.");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setMessage("");
    setError("");
    try {
      const backup = parseBackup(await file.text());
      setPendingBackup(backup);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível importar o backup.");
    }
  }

  async function confirmImport() {
    if (!pendingBackup) return;
    try {
      await replaceDatabase(db, pendingBackup);
      setMessage("Backup restaurado com sucesso.");
      setPendingBackup(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível restaurar o backup.");
    }
  }

  return (
    <AppFrame active="backup">
      <div className="content-wrap backup-page">
        <section className="page-heading">
          <div><p className="eyebrow">Segurança</p><h1>Backup local</h1><p className="page-subtitle">Leve seus baralhos com você ou restaure uma cópia anterior.</p></div>
        </section>

        <section className="backup-overview">
          <span className="summary-icon"><ShieldCheck size={27} /></span>
          <div><strong>Seus dados permanecem neste dispositivo</strong><p>{counts ? `${counts.decks} baralhos e ${counts.cards} cartões armazenados agora.` : "Calculando sua biblioteca..."}</p></div>
        </section>

        <div className="backup-actions-grid">
          <Card className="backup-action">
            <span className="backup-action-icon"><Download size={22} /></span>
            <div><h2>Exportar biblioteca</h2><p>Baixe um arquivo JSON com baralhos, cartões, agendamentos e histórico.</p></div>
            <Button type="button" onClick={handleExport}><Download />Exportar backup</Button>
          </Card>
          <Card className="backup-action">
            <span className="backup-action-icon"><Upload size={22} /></span>
            <div><h2>Restaurar backup</h2><p>Escolha um arquivo do Revisa. A restauração substitui a biblioteca atual.</p></div>
            <Button variant="secondary" type="button" onClick={() => inputRef.current?.click()}><Upload />Escolher arquivo</Button>
            <input ref={inputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={handleImport} />
          </Card>
        </div>

        {message ? <Alert className="notice notice-success" role="status"><FileCheck2 /><AlertDescription>{message}</AlertDescription></Alert> : null}
        {error ? <Alert className="notice notice-error" variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
      </div>
      <ConfirmDialog
        open={pendingBackup !== null}
        title="Restaurar backup?"
        description={pendingBackup ? `Os dados atuais serão substituídos por ${pendingBackup.decks.length} baralhos e ${pendingBackup.cards.length} cartões.` : ""}
        confirmLabel="Restaurar backup"
        onOpenChange={(open) => !open && setPendingBackup(null)}
        onConfirm={confirmImport}
      />
    </AppFrame>
  );
}
