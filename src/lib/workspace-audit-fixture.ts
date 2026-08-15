export type CreatedObjectFixture = {
  id: string;
  type: string;
  title: string;
  preview: string;
  tone: "blue" | "cyan" | "green" | "orange" | "red" | "sky" | "violet";
};

export const workspaceAuditFixture = {
  activeDate: "2026-08-11",
  activeView: "Dia",
  weekdayLabel: "Terça-Feira",
  formattedDate: "11 De Agosto De 2026",
  weekNumber: 33,
  taskCount: 0,
  selectedModel: "Gemini 3.1 Flash Lite",
  chat: {
    type: "Chat de IA",
    title: "System Audit Response Test",
    messages: [
      {
        id: "audit-user-message",
        role: "user" as const,
        text: "Responda apenas AUDIT-OK. Este e um teste sintetico.",
      },
      {
        id: "audit-assistant-message",
        role: "assistant" as const,
        text: "AUDIT-OK",
      },
    ],
  },
  createdObjects: [
    {
      id: "audit-page",
      type: "Página",
      title: "AUDIT - Página completa",
      preview: "AUDIT-CODEX:\nconteúdo sintético",
      tone: "blue",
    },
    {
      id: "audit-table",
      type: "Tabela",
      title: "AUDIT - Tabela persistida",
      preview:
        "Nome        Status\nItem Alfa   Em revisão\nItem Beta   Concluído",
      tone: "blue",
    },
    {
      id: "audit-list-item",
      type: "Item de lista",
      title: "/",
      preview: "Item persistido para auditoria",
      tone: "violet",
    },
    {
      id: "audit-weblink-example",
      type: "Weblink",
      title: "Example Domain",
      preview: "example.com/?utm_source=capacities-audit",
      tone: "cyan",
    },
    {
      id: "audit-image",
      type: "Imagem",
      title: "Sem título",
      preview: "Imagem de auditoria",
      tone: "red",
    },
    {
      id: "audit-pdf",
      type: "PDF",
      title: "Sem título",
      preview: "Documento PDF",
      tone: "red",
    },
    {
      id: "audit-weblink-w3",
      type: "Weblink",
      title: "Sem título",
      preview: "www.w3.org/TR/PNG/iso_8859-1.txt",
      tone: "cyan",
    },
    {
      id: "audit-chat",
      type: "Chat de IA",
      title: "System Audit Response Test",
      preview: "AUDIT-OK",
      tone: "violet",
    },
    {
      id: "audit-tweet",
      type: "Tweet",
      title: "Default",
      preview: "twitter.com/jack/status/20",
      tone: "sky",
    },
    {
      id: "audit-query",
      type: "Query",
      title: "Sem título",
      preview: "Sem definição · 0 entradas",
      tone: "green",
    },
    {
      id: "audit-audio",
      type: "Áudio",
      title: "Sem título",
      preview: "Arquivo de áudio",
      tone: "orange",
    },
    {
      id: "audit-entity",
      type: "AUDIT Entity",
      title: "AUDIT - Custom entity",
      preview: "Entidade personalizada persistida",
      tone: "violet",
    },
  ] satisfies CreatedObjectFixture[],
} as const;
