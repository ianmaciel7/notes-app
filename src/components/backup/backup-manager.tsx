"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Download, FileCheck2, ShieldCheck, Sparkles, Upload } from "lucide-react";

import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { SpaceLayout } from "@/components/space/space-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseBackup } from "@/data/backup";
import { createBackup, db, replaceDatabase } from "@/data/db";
import { resetAndSeedDatabase } from "@/data/seed";
import type { BackupEnvelope } from "@/data/types";

export interface BackupManagerProps extends Omit<React.ComponentProps<typeof SpaceLayout>, "children"> {
  children?: React.ReactNode;
}

export function BackupManager({
  className,
  active = "backup",
  ...props
}: BackupManagerProps = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pendingBackup, setPendingBackup] = useState<BackupEnvelope | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
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

  async function confirmResetSeed() {
    try {
      const seed = await resetAndSeedDatabase(db);
      setMessage(
        `Banco de dados reiniciado com sucesso! ${seed.decks.length} baralhos, ${seed.cards.length} cartões e histórico de estudos carregados.`,
      );
      setConfirmResetOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível reiniciar o banco de dados.");
    }
  }

  return (
    <SpaceLayout active={active} className={className} {...props}>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
        {/* Page Heading */}
        <section className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Segurança & Dados</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Backup e Gerenciamento</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Leve seus baralhos com você, restaure uma cópia anterior ou inicialize com dados de demonstração.
          </p>
        </section>

        {/* Local Storage Notice Banner */}
        <section className="py-5 border-y border-border flex items-center gap-4">
          <span className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
            <ShieldCheck size={27} />
          </span>
          <div className="grid gap-1">
            <strong className="text-sm font-semibold text-foreground">
              Seus dados permanecem neste dispositivo
            </strong>
            <p className="text-xs text-muted-foreground m-0">
              {counts
                ? `${counts.decks} baralhos e ${counts.cards} cartões armazenados agora.`
                : "Calculando sua biblioteca..."}
            </p>
          </div>
        </section>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col justify-between p-6">
            <CardHeader className="p-0 gap-3">
              <span className="w-11 h-11 rounded-lg bg-secondary text-primary flex items-center justify-center">
                <Download size={22} />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Exportar biblioteca</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Baixe um arquivo JSON com baralhos, cartões, agendamentos e histórico completo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="p-0 pt-6 bg-transparent">
              <Button type="button" onClick={handleExport} className="w-full sm:w-auto gap-2">
                <Download size={16} />
                <span>Exportar backup</span>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <CardHeader className="p-0 gap-3">
              <span className="w-11 h-11 rounded-lg bg-secondary text-primary flex items-center justify-center">
                <Upload size={22} />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Restaurar backup</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Escolha um arquivo JSON do Revisa. A restauração substitui a biblioteca atual deste dispositivo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="p-0 pt-6 bg-transparent">
              <Button
                variant="secondary"
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full sm:w-auto gap-2"
              >
                <Upload size={16} />
                <span>Escolher arquivo</span>
              </Button>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept="application/json,.json"
                tabIndex={-1}
                aria-label="Arquivo de backup"
                onChange={handleImport}
              />
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-between p-6 border-primary/30 bg-primary/5">
            <CardHeader className="p-0 gap-3">
              <span className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles size={22} />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Dados de Exemplo</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Limpa o banco e insere 4 baralhos reais com cartões, agendamentos FSRS e métricas completas.
                </CardDescription>
              </div>
            </CardHeader>
            <CardFooter className="p-0 pt-6 bg-transparent">
              <Button
                variant="outline"
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="w-full sm:w-auto gap-2"
              >
                <Sparkles size={16} />
                <span>Resetar com dados reais</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Alerts */}
        {message ? (
          <Alert className="border-primary/20 bg-secondary text-secondary-foreground" role="status">
            <FileCheck2 className="text-primary" />
            <AlertDescription className="text-xs font-medium">{message}</AlertDescription>
          </Alert>
        ) : null}
        {error ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
          </Alert>
        ) : null}
      </div>

      <ConfirmAlertDialog
        open={pendingBackup !== null}
        title="Restaurar backup?"
        description={
          pendingBackup
            ? `Os dados atuais serão substituídos por ${pendingBackup.decks.length} baralhos e ${pendingBackup.cards.length} cartões.`
            : ""
        }
        confirmLabel="Restaurar backup"
        onOpenChange={(open) => !open && setPendingBackup(null)}
        onConfirm={confirmImport}
      />

      <ConfirmAlertDialog
        open={confirmResetOpen}
        title="Resetar e carregar dados reais de exemplo?"
        description="Esta ação apagará todos os baralhos, cartões e histórico atuais e inserirá 4 baralhos completos (24 cartões, revisões FSRS, ofensiva de estudo e análise de erros)."
        confirmLabel="Sim, resetar e popular"
        onOpenChange={(open) => setConfirmResetOpen(open)}
        onConfirm={confirmResetSeed}
      />
    </SpaceLayout>
  );
}
