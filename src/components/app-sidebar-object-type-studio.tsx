"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  AppSidebarCheckIcon,
  AppSidebarPlusIcon,
  AppSidebarXIcon,
} from "@/components/app-sidebar-icons"
import {
  ObjectAreaIcon,
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
        "absolute inset-0 z-20 flex min-h-0 flex-col overflow-hidden bg-background shadow-xl ring-1 ring-foreground/10",
        "sm:inset-y-2 sm:right-2 sm:left-auto sm:w-[22rem] sm:rounded-xl"
      )}
    >
      <div className="flex shrink-0 items-center gap-3 border-b p-4">
        <AppSidebarObjectTypeIcon preset={displayPreset} />

      <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {isCustom
              ? t("createOwn")
              : t(`objectTypes.${preset.id}`)}
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
          <AppSidebarXIcon />
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          {isCustom ? (
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">{t("details.name")}</span>
              <Input
                value={customName}
                placeholder={t("details.namePlaceholder")}
                autoFocus
                onChange={(event) => onCustomNameChange(event.target.value)}
              />
            </label>
          ) : (
            <>
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

      <div className="shrink-0 border-t p-3">
        <Button
          type="button"
          className="w-full"
          disabled={isCustom && customName.trim().length === 0}
          onClick={onConfirm}
        >
          {t("details.confirm")}
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
