"use client";

import { useAppHeaderDemo } from "@/components/app-header-demo";
import { AppHeaderCaretDownIcon } from "@/components/app-header-icons";
import {
  AppSidebarArrowDownIcon,
  AppSidebarArrowUpIcon,
  AppSidebarDotsIcon,
  AppSidebarPlusIcon,
  AppSidebarSearchIcon,
} from "@/components/app-sidebar-icons";
import {
  ObjectAreaIcon,
  ObjectAtomicNoteIcon,
  ObjectPageIcon,
  ObjectTableIcon,
  ObjectTweetIcon,
} from "@/components/object-icons";
import { Button } from "@/components/ui/button";

function AtomicNotesWorkspace() {
  const { mainTabs, mainValue } = useAppHeaderDemo();
  const activeTab = mainTabs.find((tab) => tab.id === mainValue);

  if (
    activeTab &&
    activeTab.id !== "atomic-notes" &&
    activeTab.id !== "new-tab-draft"
  ) {
    return <OpenedTabWorkspace label={activeTab.label} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col text-[#282522]">
      <div className="@container flex flex-wrap items-center justify-between px-3 pt-4">
        <div className="flex min-w-0 items-center gap-2.5 @max-[450px]:basis-full">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#e3dfd9] bg-[#fff8e9] text-[#b88425] shadow-sm">
            <ObjectAtomicNoteIcon className="size-[18px]" />
          </span>
          <h1 className="truncate text-[21px] font-semibold tracking-[-0.02em]">
            Notas atômicas
          </h1>
        </div>

        <div className="flex items-center gap-1.5 @max-[450px]:mt-2 @max-[450px]:w-full @max-[450px]:justify-between">
          <div className="flex h-8 items-center rounded-lg border border-transparent bg-white px-1 text-[#6d6964] shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
            <Button variant="ghost" size="icon-sm" aria-label="Buscar">
              <AppSidebarSearchIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Recolher">
              <AppHeaderCaretDownIcon className="size-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Mais opções">
              <AppSidebarDotsIcon className="size-4" />
            </Button>
          </div>
          <div className="flex h-8 overflow-hidden rounded-lg bg-[#4b4947] text-white shadow-sm">
            <Button className="h-8 rounded-none border-r border-white/15 bg-transparent px-3 text-sm font-normal hover:bg-white/10">
              <AppSidebarPlusIcon className="size-4" />
              Novo
            </Button>
            <Button
              className="h-8 w-8 rounded-none bg-transparent px-0 hover:bg-white/10"
              aria-label="Opções de novo objeto"
            >
              <AppHeaderCaretDownIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-3 text-[13px] text-[#77716b]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg px-2 hover:bg-[#f5f3f1]"
          >
            <ObjectAreaIcon className="size-3.5" />
            Visão geral
          </button>
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg bg-[#f5f3f1] px-3 text-[#3b3835]"
          >
            <ObjectTableIcon className="size-3.5" />
            Tudo
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-8 items-center gap-1 rounded-lg px-2 hover:bg-[#f5f3f1]"
          >
            <ObjectAreaIcon className="size-3.5" />0
          </button>
          <Button variant="ghost" size="icon-sm" aria-label="Filtrar">
            <AppSidebarSearchIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Ordenar">
            <AppSidebarArrowDownIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Lista">
            <ObjectAreaIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Grade">
            <ObjectTableIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Mais visualizações"
          >
            <AppHeaderCaretDownIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 -translate-y-24 items-center justify-center pb-16">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="relative mb-3 flex size-40 items-center justify-center text-[#d9d7d4]">
            <ObjectAtomicNoteIcon className="size-32" />
            <AppSidebarPlusIcon className="absolute left-5 top-10 size-4 text-[#9b9894]" />
            <AppSidebarPlusIcon className="absolute bottom-8 right-5 size-4 rotate-12 text-[#77746f]" />
          </div>
          <h2 className="text-[16px] font-semibold">
            Não há nada aqui (por enquanto).
          </h2>
          <p className="mt-1.5 text-sm text-[#918b85]">
            Você pode mudar isso criando um novo objeto.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 rounded-lg border-[#dedbd7] bg-white px-3 font-normal text-[#615c57] shadow-sm"
            >
              <AppSidebarArrowUpIcon className="size-4" />
              Importar arquivo(s)
            </Button>
            <Button className="h-9 rounded-lg bg-[#4b4947] px-3 font-normal text-white hover:bg-[#3f3d3b]">
              <AppSidebarPlusIcon className="size-4" />
              Novo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenedTabWorkspace({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-0 flex-col text-[#282522]">
      <div className="flex items-center gap-2.5 px-4 pt-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f0ff] text-[#4d78bd]">
          <ObjectPageIcon className="size-[18px]" />
        </span>
        <h1 className="truncate text-[21px] font-semibold tracking-[-0.02em]">
          {label}
        </h1>
      </div>
      <div className="mx-auto flex w-full max-w-[42rem] flex-1 flex-col px-8 pt-16">
        <h2 className="text-[30px] font-semibold tracking-[-0.025em]">
          {label}
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Comece a escrever ou adicione conteúdo a este objeto.
        </p>
      </div>
    </div>
  );
}

function ExploreWorkspace() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center px-16 text-[#4b4743]">
      <div className="w-full max-w-[380px]">
        <h2 className="mb-3 text-[13px] text-[#827c76]">Explorar</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex h-[90px] flex-col justify-between rounded-lg border border-[#e4e0dc] p-4 text-left hover:bg-[#faf9f8]"
          >
            <ObjectTweetIcon className="size-5" />
            <span className="text-[13px] text-[#827c76]">Chat de IA</span>
          </button>
          <button
            type="button"
            className="flex h-[90px] flex-col justify-between rounded-lg border border-[#e4e0dc] p-4 text-left hover:bg-[#faf9f8]"
          >
            <AppSidebarSearchIcon className="size-5" />
            <span className="text-[13px] text-[#827c76]">Buscar</span>
          </button>
        </div>

        <div className="mt-10 flex items-center justify-between text-[13px] text-[#827c76]">
          <span>Conteúdo relevante</span>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[#5f5a55]"
          >
            <AppSidebarSearchIcon className="size-3.5" />
            Encontrar mais
          </button>
        </div>
        <div className="mt-5 flex items-center gap-2 text-sm text-[#4d4945]">
          <span className="flex size-5 items-center justify-center rounded bg-[#e8f0ff] text-[#4d78bd]">
            <ObjectAreaIcon className="size-3.5" />
          </span>
          <span>aaaaaaaaaaaaa</span>
        </div>
      </div>
    </div>
  );
}

export { AtomicNotesWorkspace, ExploreWorkspace };
