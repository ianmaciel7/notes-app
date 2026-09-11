"use client";

import { ChevronDown, Layers, SlidersHorizontal, Sparkles, Tag as TagIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ObjectActions } from "@/app/_components/objects/detail/object-actions";
import { getObjectTypeName } from "@/app/_components/objects/detail/object-detail-model";
import { ObjectTypeLabelChip } from "@/app/_components/objects/object-icons";
import { useObjectMutation } from "@/app/_components/objects/use-object-mutation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ObjectIconName, ObjectIconTone } from "@/lib/space-object-types";
import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

export type ObjectTypeDetailProps = {
  entity: SpaceEntityRecord;
  objectType?: SpaceObjectTypeRecord | { id: string; label?: string; iconName?: ObjectIconName; tone?: ObjectIconTone };
  tabName?: string;
};

const tagToneList = [
  "fuchsia",
  "violet",
  "cyan",
  "amber",
  "emerald",
  "indigo",
  "orange",
  "rose",
  "sky",
  "teal",
  "purple",
  "blue",
] as const;

function getTagTone(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  return tagToneList[Math.abs(hash) % tagToneList.length];
}

function PageViewTopBar({ entity, objectType }: ObjectTypeDetailProps) {
  const mutation = useObjectMutation(entity);
  const [collectionsValue, setCollectionsValue] = useState(
    (entity.properties?.collections as string) || (entity.properties?.colecoes as string) || "",
  );

  const handleCollectionsBlur = () => {
    const trimmed = collectionsValue.trim();
    if (trimmed !== (entity.properties?.collections || "")) {
      void mutation.save({
        properties: { ...entity.properties, collections: trimmed },
      });
    }
  };

  return (
    <div className="group/page-view-header relative flex min-w-0 items-center gap-x-1.5 min-h-[32px] overflow-hidden">
      <div className="flex min-w-0 shrink items-center overflow-hidden text-sm font-normal">
        <div className="flex min-w-0 flex-col">
          <div className="flex min-w-0 text-base desktop:text-sm sm:text-sm items-center gap-x-1.5">
            <span className="flex shrink-0">
              <div className="shrink-0">
                <ObjectTypeLabelChip
                  id={objectType?.id ?? entity.objectTypeId}
                  iconName={objectType?.iconName}
                  label={getObjectTypeName(entity, objectType)}
                  tone={objectType?.tone ?? "cyan"}
                  splitMenuIndicator={true}
                  interactive={true}
                />
              </div>
            </span>

            <div
              id={`property-cell_${entity.id}_collections`}
              className="relative text-sm flex flex-row items-center focus:outline-none focus-within:outline-none"
              tabIndex={-1}
            >
              <span className="text-[1em] cursor-pointer">
                <span className="select-none border-[0.0625em] box-border group/text-label relative cursor-pointer flex flex-row items-center inline-flex py-[0.2em] whitespace-nowrap px-[0.49em] rounded-[0.475em] border-base hover:bg-[var(--app-bg-front-hover)]">
                  <span className="justify-center items-center inline-flex min-h-[1em] min-w-[1em] mr-1 shrink-0 rounded-[0.33em]">
                    <Layers className="size-3.5 text-[var(--app-text-secondary)]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Coleções"
                    className="outline-none appearance-none bg-transparent min-w-0 text-sm text-[var(--app-text-secondary)] placeholder:text-[var(--app-text-subtle)] cursor-pointer w-[62px] focus:w-[120px] transition-all"
                    value={collectionsValue}
                    onChange={(e) => setCollectionsValue(e.target.value)}
                    onBlur={handleCollectionsBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCollectionsBlur();
                    }}
                  />
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 grow pointer-events-none group-hover/page-view-header:pointer-events-auto flex min-w-0 min-h-0 items-center overflow-hidden">
        <div className="min-h-[26px] min-w-0 flex flex-1 items-center justify-end gap-x-0 overflow-hidden">
          <Popover>
            <PopoverTrigger
              tabIndex={0}
              className="bg-transparent hover:bg-[var(--app-bg-front-hover)] border border-transparent text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] rounded-base px-2 h-[26px] text-sm justify-center ring-state-active box-border cursor-pointer gap-x-1.5 max-w-full truncate relative flex shrink-0 items-center transition-opacity duration-200 pointer-events-auto"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Personalizar</span>
              <ChevronDown className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2 text-sm">
              <div className="font-medium text-[var(--app-text-primary)] mb-2 px-2 py-1">
                Personalizar visualização
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[var(--app-bg-front-hover)] text-[var(--app-text-secondary)] text-xs flex items-center justify-between"
                >
                  <span>Propriedades do objeto</span>
                  <span className="text-[var(--app-text-subtle)]">Exibir</span>
                </button>
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[var(--app-bg-front-hover)] text-[var(--app-text-secondary)] text-xs flex items-center justify-between"
                >
                  <span>Etiquetas</span>
                  <span className="text-[var(--app-text-subtle)]">Exibir</span>
                </button>
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[var(--app-bg-front-hover)] text-[var(--app-text-secondary)] text-xs flex items-center justify-between"
                >
                  <span>Layout da página</span>
                  <span className="text-[var(--app-text-subtle)]">Padrão</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="shrink-0 ml-auto flex min-h-0 items-center gap-x-1.5 pl-2">
        <ObjectActions entity={entity} />
      </div>
    </div>
  );
}

function PageViewTitleInput({ entity }: { entity: SpaceEntityRecord }) {
  const mutation = useObjectMutation(entity);
  const [title, setTitle] = useState(entity.title || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(entity.title || "");
  }, [entity.title]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(39, el.scrollHeight)}px`;
    }
  }, [title]);

  const handleTitleBlur = () => {
    const trimmed = title.trim();
    if (trimmed !== entity.title) {
      void mutation.save({ title: trimmed });
    }
  };

  return (
    <h1 className="main-heading mt-3.5 mb-1 flex relative items-start">
      <div className="relative min-w-0 grow">
        <div className="relative flex w-full">
          <textarea
            ref={textareaRef}
            rows={1}
            id={`editorWindow=main-container-${entity.id}-title`}
            className="w-full pb-1 box-border appearance-none bg-transparent placeholder:text-[var(--app-text-subtle)] focus:outline-none relative text-3xl font-semibold text-[var(--app-text-primary)] resize-none transition-all leading-tight"
            placeholder="Título"
            spellCheck={false}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleTitleBlur();
              }
            }}
          />
        </div>
      </div>
    </h1>
  );
}

function PageViewTagsRow({ entity }: { entity: SpaceEntityRecord }) {
  const mutation = useObjectMutation(entity);
  const [newTagInput, setNewTagInput] = useState("");

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = entity.tags.filter((t) => t !== tagToRemove);
    void mutation.save({ tags: updatedTags });
  };

  const handleAddTag = () => {
    const tagToAdd = newTagInput.trim().toLowerCase();
    if (tagToAdd && !entity.tags.includes(tagToAdd)) {
      const updatedTags = [...entity.tags, tagToAdd];
      void mutation.save({ tags: updatedTags });
      setNewTagInput("");
    }
  };

  const handleGenerateAiTags = () => {
    const sampleTags = (entity.title || "").toLowerCase().includes("memcached")
      ? ["in-memory database", "unstructured storage"]
      : ["conhecimento", "estudo"];
    const merged = Array.from(new Set([...entity.tags, ...sampleTags]));
    void mutation.save({ tags: merged });
  };

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-start gap-1.5 text-sm py-0.5 mt-1">
      <div className="flex w-fit min-w-0 max-w-full flex-wrap items-center gap-1.5">
        {entity.tags.map((tag) => {
          const tone = getTagTone(tag);
          return (
            <span
              key={tag}
              className="inline-flex max-w-full min-w-0 text-sm inline relative shrink break-normal"
            >
              <span
                className="select-none border-[0.0625em] box-border group/text-label relative cursor-pointer flex flex-row items-center inline-flex leading-[1.3] py-[0.2em] whitespace-nowrap px-[0.49em] rounded-[0.475em] border-base"
                style={{
                  backgroundColor: `var(--type-label-bg-${tone})`,
                  borderColor: `var(--type-label-border-${tone})`,
                  color: `var(--type-label-text-${tone})`,
                }}
              >
                <span className="min-w-0 truncate block text-left pointer-events-auto whitespace-nowrap text-[1em]">
                  {tag}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="flex top-0 transition duration-200 ease-out opacity-0 group-hover/text-label:opacity-100 right-0 text-[1em] bottom-0 pl-[0.25em] cursor-pointer absolute shrink-0 grow-0 items-center justify-center"
                  title="Remover etiqueta"
                >
                  <span className="h-full w-[0.7em] from-transparent to-current bg-linear-to-r opacity-20" />
                  <span className="rounded-r-[0.475em] h-full pl-[0.15em] pr-[0.3em] flex items-center justify-center text-[0.9em]">
                    <X className="size-3 stroke-[2.5]" />
                  </span>
                </button>
              </span>
            </span>
          );
        })}
      </div>

      <div className="relative text-sm flex flex-row items-center focus:outline-none" tabIndex={-1}>
        <span className="select-none border-[0.0625em] box-border group/text-label relative cursor-pointer flex flex-row items-center inline-flex py-[0.2em] whitespace-nowrap px-[0.49em] rounded-[0.475em] border-base hover:bg-[var(--app-bg-front-hover)]">
          <span className="justify-center items-center inline-flex mr-1 shrink-0">
            <TagIcon className="size-3.5 text-[var(--app-text-secondary)]" />
          </span>
          <input
            type="text"
            placeholder="Etiquetas"
            className="outline-none appearance-none bg-transparent min-w-0 text-sm text-[var(--app-text-secondary)] placeholder:text-[var(--app-text-subtle)] cursor-pointer w-[62px] focus:w-[100px] transition-all"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            onBlur={handleAddTag}
          />
          <button
            type="button"
            onClick={handleGenerateAiTags}
            className="ml-1.5 opacity-0 group-hover/text-label:opacity-100 transition-opacity p-0.5 text-violet-500 hover:text-violet-600 rounded"
            title="Gerar etiquetas com IA"
          >
            <Sparkles className="size-3.5" />
          </button>
        </span>
      </div>
    </div>
  );
}

export function ObjectHeading({ entity, objectType }: ObjectTypeDetailProps) {
  return (
    <div className="flex w-full flex-col">
      <div className="group flex w-full flex-col">
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-col justify-end">
            <PageViewTopBar entity={entity} objectType={objectType} />
          </div>
        </div>
        <PageViewTitleInput entity={entity} />
      </div>
      <PageViewTagsRow entity={entity} />
    </div>
  );
}
