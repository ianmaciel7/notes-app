export type NavigationIcon =
  | "add"
  | "search"
  | "calendar"
  | "tasks"
  | "audit"
  | "ai"
  | "image"
  | "file"
  | "audio"
  | "pdf"
  | "query"
  | "tag"
  | "tweet"
  | "weblink"
  | "table"
  | "page"
  | "trash"
  | "help"
  | "question"
  | "docs"
  | "news"
  | "feedback";

export type NavigationItem = {
  href: string;
  icon: NavigationIcon;
  label: string;
  count?: number;
  tone?:
    | "blue"
    | "violet"
    | "red"
    | "orange"
    | "green"
    | "cyan"
    | "indigo"
    | "sky";
};

export type NavigationGroup = {
  label?: string;
  count?: number;
  emptyText?: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    items: [
      { href: "/novo", icon: "add", label: "Novo" },
      { href: "/buscar", icon: "search", label: "Buscar" },
      { href: "/hoje", icon: "calendar", label: "Calendário" },
      { href: "/tarefas", icon: "tasks", label: "Tarefas" },
    ],
  },
  {
    count: 0,
    emptyText: "Nenhum conteúdo fixado",
    label: "Fixados",
    items: [],
  },
  {
    count: 13,
    label: "Tipos de objeto",
    items: [
      {
        count: 0,
        href: "/tipos/notas-diarias",
        icon: "page",
        label: "Notas Diárias",
        tone: "blue",
      },
      {
        count: 1,
        href: "/tipos/audit-entities",
        icon: "audit",
        label: "AUDIT Entities",
        tone: "blue",
      },
      {
        count: 1,
        href: "/tipos/chats-de-ia",
        icon: "ai",
        label: "Chats de IA",
        tone: "violet",
      },
      {
        count: 1,
        href: "/tipos/imagens",
        icon: "image",
        label: "Imagens",
        tone: "red",
      },
      {
        count: 0,
        href: "/tipos/arquivos",
        icon: "file",
        label: "Arquivos",
        tone: "red",
      },
      {
        count: 1,
        href: "/tipos/audios",
        icon: "audio",
        label: "Áudios",
        tone: "red",
      },
      {
        count: 1,
        href: "/tipos/pdfs",
        icon: "pdf",
        label: "PDFs",
        tone: "red",
      },
      {
        count: 1,
        href: "/tipos/queries",
        icon: "query",
        label: "Queries",
        tone: "green",
      },
      {
        count: 1,
        href: "/tipos/etiquetas",
        icon: "tag",
        label: "Etiquetas",
        tone: "orange",
      },
      {
        count: 1,
        href: "/tipos/tweets",
        icon: "tweet",
        label: "Tweets",
        tone: "blue",
      },
      {
        count: 2,
        href: "/tipos/weblinks",
        icon: "weblink",
        label: "Weblinks",
        tone: "blue",
      },
      {
        count: 1,
        href: "/tipos/tabelas",
        icon: "table",
        label: "Tabelas",
        tone: "blue",
      },
      {
        count: 1,
        href: "/tipos/paginas",
        icon: "page",
        label: "Páginas",
        tone: "blue",
      },
    ],
  },
  {
    items: [{ href: "/lixeira", icon: "trash", label: "Lixeira" }],
  },
  {
    label: "Ajuda e recursos",
    items: [
      {
        href: "/ajuda/primeiros-passos",
        icon: "help",
        label: "Primeiros passos",
      },
      {
        href: "/ajuda/perguntas",
        icon: "question",
        label: "Fazer uma pergunta",
      },
      { href: "/ajuda/documentacao", icon: "docs", label: "Documentação" },
      { href: "/ajuda/novidades", icon: "news", label: "Novidades" },
      { href: "/ajuda/feedback", icon: "feedback", label: "Feedback" },
    ],
  },
];

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
