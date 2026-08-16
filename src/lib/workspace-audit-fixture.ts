export type CreatedObjectFixture = {
  id: string;
  type: string;
  title: string;
  preview: string;
  url?: string;
  metadata?: string;
  tableRows?: readonly (readonly [string, string])[];
  tone: "blue" | "cyan" | "green" | "orange" | "red" | "sky" | "violet";
};

export const workspaceAuditFixture = {
  activeDate: "2026-08-11",
  locale: "pt-BR",
  timezone: "America/Sao_Paulo",
  activeView: "Dia",
  weekdayLabel: "Terça-Feira",
  formattedDate: "11 De Agosto De 2026",
  weekNumber: 33,
  taskCount: 0,
  tasks: [],
  dailyNote: {
    available: true,
    title: "Nota Diária",
  },
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
      preview:
        "AUDIT-CODEX: conteúdo sintético para validar persistência.\n\nEditor rico do Capacities\nItem de lista\n/",
      tone: "blue",
    },
    {
      id: "audit-table",
      type: "Tabela",
      title: "AUDIT - Tabela persistida",
      preview: "Nome\tStatus\nItem Alfa\tEm revisão\nItem Beta\tConcluído",
      tableRows: [
        ["Nome", "Status"],
        ["Item Alfa", "Em revisão"],
        ["Item Beta", "Concluído"],
      ],
      tone: "blue",
    },
    {
      id: "audit-weblink-example",
      type: "Weblink",
      title: "Example Domain",
      preview: "example.com/?utm_source=capacities-audit",
      url: "https://example.com/?utm_source=capacities-audit",
      tone: "cyan",
    },
    {
      id: "audit-image",
      type: "Imagem",
      title: "Sem título",
      preview: "0",
      metadata: "Imagem persistida",
      tone: "red",
    },
    {
      id: "audit-file",
      type: "Arquivo",
      title: "Sem título",
      preview: "0",
      metadata: "Arquivo persistido",
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
      url: "https://www.w3.org/TR/PNG/iso_8859-1.txt",
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
      preview: "Sem definição\n0 entradas",
      tone: "green",
    },
    {
      id: "audit-entity",
      type: "AUDIT Entity",
      title: "AUDIT - Custom entity",
      preview: "Entidade personalizada persistida",
      tone: "violet",
    },
    {
      id: "audit-audio",
      type: "Áudio",
      title: "Sem título",
      preview: "Arquivo de áudio",
      tone: "orange",
    },
  ] satisfies CreatedObjectFixture[],
} as const;
