"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  AppSidebarCheckIcon,
  AppSidebarPlusIcon,
} from "@/components/app-sidebar-icons"
import {
  ObjectAreaIcon,
  ObjectIdeaIcon,
  ObjectIconBadge,
  objectTypeDefinitions,
  type ObjectIconProps,
  type ObjectIconTone,
} from "@/components/object-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type AppSidebarObjectTypeTone = ObjectIconTone

type AppSidebarObjectTypePreset = {
  id: string
  label: string
  icon: React.ElementType<ObjectIconProps>
  tone: AppSidebarObjectTypeTone
}

type AppSidebarObjectTypeStudioProps = {
  onSelect?: (preset: AppSidebarObjectTypePreset) => void
  trigger?: React.ReactElement
  className?: string
}

const objectTypeDetailsIconPaths = {
  arrowRight:
    "m224.49 136.49l-72 72a12 12 0 0 1-17-17L187 140H40a12 12 0 0 1 0-24h147l-51.49-51.52a12 12 0 0 1 17-17l72 72a12 12 0 0 1-.02 17.01",
  edit:
    "m229.66 58.34l-32-32a8 8 0 0 0-11.32 0l-96 96A8 8 0 0 0 88 128v32a8 8 0 0 0 8 8h32a8 8 0 0 0 5.66-2.34l96-96a8 8 0 0 0 0-11.32M124.69 152H104v-20.69l64-64L188.69 88ZM200 76.69L179.31 56L192 43.31L212.69 64ZM224 128v80a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h80a8 8 0 0 1 0 16H48v160h160v-80a8 8 0 0 1 16 0",
  info:
    "M144 176a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m88-48A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88m-92-32a12 12 0 1 0-12-12a12 12 0 0 0 12 12",
  palette:
    "M200.77 53.89A103.27 103.27 0 0 0 128 24h-1.07A104 104 0 0 0 24 128c0 43 26.58 79.06 69.36 94.17A32 32 0 0 0 136 192a16 16 0 0 1 16-16h46.21a31.81 31.81 0 0 0 31.2-24.88a104.4 104.4 0 0 0 2.59-24a103.28 103.28 0 0 0-31.23-73.23m13 93.71a15.89 15.89 0 0 1-15.56 12.4H152a32 32 0 0 0-32 32a16 16 0 0 1-21.31 15.07C62.49 194.3 40 164 40 128a88 88 0 0 1 87.09-88h.9a88.35 88.35 0 0 1 88 87.25a89 89 0 0 1-2.18 20.35ZM140 76a12 12 0 1 1-12-12a12 12 0 0 1 12 12m-44 24a12 12 0 1 1-12-12a12 12 0 0 1 12 12m0 56a12 12 0 1 1-12-12a12 12 0 0 1 12 12m88-56a12 12 0 1 1-12-12a12 12 0 0 1 12 12",
} as const

function ObjectTypeDetailsIcon({
  name,
  className,
}: {
  name: keyof typeof objectTypeDetailsIconPaths
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-[1em]", className)}
    >
      {name === "info" && (
        <path
          d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96"
          opacity=".2"
        />
      )}
      <path d={objectTypeDetailsIconPaths[name]} />
    </svg>
  )
}

const suggestedObjectTypeIds = new Set([
  "book",
  "person",
  "area",
  "meeting",
  "quote",
  "definition",
  "idea",
  "place",
  "project",
  "organization",
  "atomic-note",
  "media",
  "travel",
])

const suggestedObjectTypes: AppSidebarObjectTypePreset[] =
  objectTypeDefinitions.filter((definition) =>
    suggestedObjectTypeIds.has(definition.id),
  )

const basicObjectTypes: AppSidebarObjectTypePreset[] =
  objectTypeDefinitions.filter(
    (definition) =>
      !suggestedObjectTypeIds.has(definition.id) &&
      definition.id !== "archive",
  )

function AppSidebarObjectTypeIcon({
  preset,
  className,
}: {
  preset: AppSidebarObjectTypePreset
  className?: string
}) {
  const Icon = preset.icon

  return (
    <ObjectIconBadge
      icon={Icon}
      tone={preset.tone}
      className={cn("size-8 rounded-[8px]", className)}
      iconClassName="size-[18px]"
    />
  )
}

function AppSidebarObjectTypeCard({
  preset,
  selected,
  onSelect,
  label,
}: {
  preset: AppSidebarObjectTypePreset
  selected: boolean
  onSelect: (preset: AppSidebarObjectTypePreset) => void
  label: string
}) {
  return (
    <button
      type="button"
      data-slot="app-sidebar-object-type-card"
      data-selected={selected || undefined}
      className={cn(
        "flex h-[54px] w-full items-center gap-3 rounded-[8px] border border-[#dedbd7] bg-white px-2.5 text-left",
        "text-[14px] font-semibold text-[#2f2c29] shadow-[0_1px_2px_rgb(0_0_0/0.02)]",
        "transition-[background-color,border-color,box-shadow,filter] duration-150",
        "hover:border-[#cbc7c1] hover:bg-[#faf9f8] hover:shadow-[0_2px_8px_rgb(0_0_0/0.04)]",
        "active:brightness-[0.98] data-[selected=true]:border-[#bdb8b0] data-[selected=true]:bg-[#f7f5f3]"
      )}
      onClick={() => onSelect(preset)}
    >
      <AppSidebarObjectTypeIcon preset={preset} />
      <span className="min-w-0 truncate">{label}</span>
      {selected && (
        <span
          aria-hidden="true"
          className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-[#34302c] text-white"
        >
          <AppSidebarCheckIcon className="size-3" />
        </span>
      )}
    </button>
  )
}

function AppSidebarCustomObjectTypeCard({
  selected,
  onSelect,
  label,
}: {
  selected: boolean
  onSelect: () => void
  label: string
}) {
  return (
    <button
      type="button"
      data-slot="app-sidebar-object-type-card"
      data-selected={selected || undefined}
      className={cn(
        "flex h-[54px] w-full items-center gap-3 rounded-[8px] border border-[#dedbd7] bg-white px-2.5 text-left",
        "text-[14px] font-semibold text-[#2f2c29] shadow-[0_1px_2px_rgb(0_0_0/0.02)]",
        "transition-[background-color,border-color,box-shadow,filter] duration-150",
        "hover:border-[#cbc7c1] hover:bg-[#faf9f8] hover:shadow-[0_2px_8px_rgb(0_0_0/0.04)]",
        "active:brightness-[0.98] data-[selected=true]:border-[#bdb8b0] data-[selected=true]:bg-[#f7f5f3]"
      )}
      onClick={onSelect}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-[#cfcac4] bg-white text-[#5f5a55]">
        <AppSidebarPlusIcon className="size-[18px]" />
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </button>
  )
}

function AppSidebarObjectTypeDetails({
  preset,
  customName,
  onCustomNameChange,
  onClose,
  onConfirm,
}: {
  preset: AppSidebarObjectTypePreset | null
  customName: string
  onCustomNameChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useTranslations("workspace.objectTypeStudio")
  const isCustom = preset === null
  const [pluralName, setPluralName] = React.useState("")
  const customNameInputId = React.useId()
  const pluralNameInputId = React.useId()
  const displayPreset: AppSidebarObjectTypePreset =
    preset ?? {
      id: "custom",
      label: customName || "Custom object type",
      icon: ObjectAreaIcon,
      tone: "gray",
    }

  return (
    <aside
      data-slot="app-sidebar-object-type-details"
      className={cn(
        "pointer-events-auto absolute bottom-0 right-0 top-0 z-20 -mb-1 -mr-1 -mt-1",
        "flex min-h-0 w-full origin-center scale-100 transform flex-col overflow-hidden",
        "border border-border bg-background shadow-xl transition duration-150 ease-out",
        "sm:w-[28rem] sm:rounded-lg",
      )}
    >
      <div className="relative min-h-0 grow">
        <ScrollArea className="h-full">
          <div className="flex min-h-full flex-col px-5 py-4 pb-8">
            {isCustom ? (
              <>
                <div className="flex flex-col gap-y-1.5">
                  <div className="flex items-center gap-x-2">
                    <div className="text-lg font-semibold text-foreground">
                      Crie seu tipo de objeto
                    </div>
                    <button
                      type="button"
                      className={cn(
                        "relative flex h-7 max-w-min shrink-0 items-center justify-center gap-x-1.5 truncate rounded-lg",
                        "border border-transparent bg-transparent px-3 pr-2 pl-2.5 text-xs text-muted-foreground",
                        "transition duration-200 ease-out hover:bg-muted hover:text-foreground active:brightness-[0.97]",
                      )}
                    >
                      <ObjectIdeaIcon className="-mr-px size-[1em] text-amber-500 dark:text-amber-400" />
                      <span className="mr-1 whitespace-nowrap">Saiba mais</span>
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tipos de objeto são categorias para o seu conteúdo, como
                    livros, projetos ou notas de reuniões.
                  </p>
                </div>

                <div className="mt-5 flex w-full gap-x-3">
                  <div className="flex shrink-0 flex-col">
                    <div className="flex select-none items-baseline pb-1.5 text-xs text-muted-foreground">
                      <span>Ícone</span>
                    </div>
                    <div className="relative flex size-6 shrink-0 items-center justify-center rounded-lg border text-lg leading-none text-[oklch(0.4289_0.0021_324.71)] [border-color:oklch(0.8643_0.0017_67.13)] [border-width:0.5px] [background-color:oklch(0.9766_0.0016_67.01)]">
                      <button
                        type="button"
                        className="relative flex h-full w-full shrink-0 grow-0 cursor-pointer appearance-none items-center justify-center rounded-[0.445rem] bg-transparent text-[18px] leading-none hover:brightness-95 focus:outline-none"
                      >
                        <ObjectTypeDetailsIcon
                          name="edit"
                          className="text-[1em] opacity-90"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-y-1">
                    <label
                      htmlFor={customNameInputId}
                      className="select-none text-xs text-muted-foreground"
                    >
                      Nome
                    </label>
                    <div className="flex h-6 w-full min-w-44 flex-row items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2 text-sm text-foreground hover:border-muted-foreground/40">
                      <Input
                        id={customNameInputId}
                        value={customName}
                        placeholder="Nome"
                        autoFocus
                        autoComplete="off"
                        onChange={(event) =>
                          onCustomNameChange(event.target.value)
                        }
                        className="h-full w-full appearance-none border-0 bg-transparent p-0 shadow-none outline-none placeholder:text-muted-foreground placeholder:opacity-60 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex w-full gap-x-3">
                  <div className="flex shrink-0 flex-col">
                    <div className="flex select-none items-baseline pb-1.5 text-xs text-muted-foreground">
                      <span>Cor</span>
                    </div>
                    <div className="relative flex size-6 shrink-0 items-center justify-center rounded-lg">
                      <button
                        type="button"
                        className={cn(
                          "relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg",
                          "border border-border bg-muted text-base text-muted-foreground",
                          "transition duration-200 ease-out hover:border-muted-foreground/40 active:brightness-[0.97] focus:outline-none",
                        )}
                      >
                        <span className="rounded-lg p-[3px]">
                          <ObjectTypeDetailsIcon name="palette" />
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-y-1">
                    <label
                      htmlFor={pluralNameInputId}
                      className="select-none text-xs text-muted-foreground"
                    >
                      Plural do nome
                    </label>
                    <div className="flex h-6 w-full min-w-44 flex-row items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2 text-sm text-foreground hover:border-muted-foreground/40">
                      <Input
                        id={pluralNameInputId}
                        value={pluralName}
                        placeholder="Plural do nome"
                        autoComplete="off"
                        onChange={(event) => setPluralName(event.target.value)}
                        className="h-full w-full appearance-none border-0 bg-transparent p-0 shadow-none outline-none placeholder:text-muted-foreground placeholder:opacity-60 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex w-full grow flex-col">
                  <div className="mt-3 flex w-full rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <div className="w-6 shrink-0 grow-0">
                      <div className="-mt-0.5 -mb-1 -ml-1.5 flex size-6 shrink-0 grow-0 items-center justify-center rounded-lg leading-none text-blue-600 dark:text-blue-300">
                        <ObjectTypeDetailsIcon name="info" />
                      </div>
                    </div>
                    <div className="flex w-20 grow flex-col gap-y-2 text-sm font-normal">
                      <div>
                        Você pode personalizar as propriedades depois de criar o
                        tipo de objeto nas configurações do tipo de objeto.
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
            <>
              <div className="flex shrink-0 items-center gap-3 border-b pb-4">
                <AppSidebarObjectTypeIcon preset={displayPreset} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {t(`objectTypes.${preset.id}`)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t("details.description")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("details.close")}
                  onClick={onClose}
                >
                  ×
                </Button>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-sm font-medium">
                  {t(`objectTypes.${preset.id}`)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t("details.review")}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("details.preset")}
                </p>
                <p className="mt-1 text-sm">{preset.id}</p>
              </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="sticky bottom-0 flex w-full shrink-0 justify-center bg-background px-4 py-4 shadow-md">
        <Button
          type="button"
          className="h-6 w-full justify-center rounded-lg px-3 text-sm"
          disabled={isCustom && customName.trim().length === 0}
          onClick={onConfirm}
        >
          <span className="mr-1">
            {isCustom ? "Criar tipo de objeto" : t("details.confirm")}
          </span>
          {isCustom && <ObjectTypeDetailsIcon name="arrowRight" />}
        </Button>
      </div>
    </aside>
  )
}

function AppSidebarObjectTypeStudio({
  onSelect,
  trigger,
  className,
}: AppSidebarObjectTypeStudioProps) {
  const t = useTranslations("workspace.objectTypeStudio")
  const [open, setOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] =
    React.useState<AppSidebarObjectTypePreset | null>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [customName, setCustomName] = React.useState("")

  function resetSelection() {
    setSelectedPreset(null)
    setDetailsOpen(false)
    setCustomName("")
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) resetSelection()
  }

  function selectPreset(preset: AppSidebarObjectTypePreset) {
    setSelectedPreset(preset)
    setCustomName("")
    setDetailsOpen(true)
  }

  function selectCustom() {
    setSelectedPreset(null)
    setCustomName("")
    setDetailsOpen(true)
  }

  function confirmSelection() {
    if (selectedPreset) {
      onSelect?.(selectedPreset)
      setOpen(false)
      resetSelection()
      return
    }

    const name = customName.trim()
    if (!name) return

    onSelect?.({
      id: `custom-${crypto.randomUUID()}`,
      label: name,
      icon: ObjectAreaIcon,
      tone: "gray",
    })
    setOpen(false)
    resetSelection()
  }

  return (
    <div
      data-slot="app-sidebar-object-type-studio"
      className={cn(trigger ? "inline-flex" : "px-2", className)}
    >
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            trigger ?? (
              <Button
                type="button"
                variant="ghost"
                size="default"
                className="w-full justify-start px-2 font-normal text-muted-foreground"
              >
                <AppSidebarPlusIcon data-icon="inline-start" />
                <span className="min-w-0 truncate">{t("trigger")}</span>
              </Button>
            )
          }
        />

        <DialogContent
          showCloseButton={false}
          className={cn(
            "flex h-[min(784px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-[8px] bg-white p-0 text-[#1f1c19] sm:w-[min(1152px,calc(100vw-4rem))] sm:max-w-[min(1152px,calc(100vw-4rem))]",
            "shadow-[0_18px_60px_rgb(0_0_0/0.22)] ring-1 ring-black/10"
          )}
        >
          <DialogHeader className="flex h-[56px] shrink-0 justify-center gap-0 border-b border-[#e7e2dc] px-5 py-0">
            <DialogTitle className="text-[18px] font-semibold leading-none tracking-[-0.01em]">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t("description")}
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex min-h-0 flex-1 overflow-hidden bg-white">
            <ScrollArea
              className={cn(
                "min-h-0 flex-1",
                "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:w-1.5",
                "[&_[data-slot=scroll-area-scrollbar]]:p-0",
                "[&_[data-slot=scroll-area-thumb]]:rounded-full"
              )}
            >
              <div className="flex min-h-full flex-col px-5 pb-6 pt-6">
                <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {suggestedObjectTypes.map((preset) => (
                    <AppSidebarObjectTypeCard
                      key={preset.id}
                      preset={preset}
                      selected={detailsOpen && selectedPreset?.id === preset.id}
                      onSelect={selectPreset}
                      label={t(`objectTypes.${preset.id}`)}
                    />
                  ))}

                  <AppSidebarCustomObjectTypeCard
                    selected={detailsOpen && selectedPreset === null}
                    onSelect={selectCustom}
                    label={t("createOwn")}
                  />
                </div>

                <section className="mt-9 flex flex-col pb-4">
                  <h2 className="text-[18px] font-medium leading-none tracking-[-0.01em]">
                    {t("basicTypes")}
                  </h2>
                  <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {basicObjectTypes.map((preset) => (
                      <AppSidebarObjectTypeCard
                        key={preset.id}
                        preset={preset}
                        selected={detailsOpen && selectedPreset?.id === preset.id}
                        onSelect={selectPreset}
                        label={t(`objectTypes.${preset.id}`)}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>

            {detailsOpen && (
              <AppSidebarObjectTypeDetails
                preset={selectedPreset}
                customName={customName}
                onCustomNameChange={setCustomName}
                onClose={resetSelection}
                onConfirm={confirmSelection}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export {
  AppSidebarObjectTypeIcon,
  AppSidebarObjectTypeStudio,
  basicObjectTypes,
  suggestedObjectTypes,
  type AppSidebarObjectTypePreset,
  type AppSidebarObjectTypeStudioProps,
  type AppSidebarObjectTypeTone,
}
