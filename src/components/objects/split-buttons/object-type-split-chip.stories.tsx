import type { Story, StoryDefault } from "@ladle/react";
import { ObjectTypeSplitChip } from "./object-type-split-chip";

export default {
  title: "Objects / Split Buttons / ObjectTypeSplitChip",
} satisfies StoryDefault;

export const DefaultPageChip: Story = () => (
  <div className="p-6 flex items-center gap-4">
    <ObjectTypeSplitChip
      iconType="page"
      label="Página"
      tone="blue"
      onLabelClick={() => alert("Label clicked: Página")}
      options={[
        { id: "struct-1", label: "Mudar para Tarefa", icon: "task" },
        { id: "struct-2", label: "Mudar para Livro", icon: "book" },
        { id: "struct-3", label: "Mudar para Nota Atômica", icon: "atomic-note" },
      ]}
    />
  </div>
);

export const AllColorTones: Story = () => (
  <div className="p-6 flex flex-wrap items-center gap-4">
    <ObjectTypeSplitChip
      iconType="page"
      label="Página"
      tone="blue"
      options={[{ id: "1", label: "Opção 1" }]}
    />
    <ObjectTypeSplitChip
      iconType="book"
      label="Livro"
      tone="amber"
      options={[{ id: "1", label: "Opção 1" }]}
    />
    <ObjectTypeSplitChip
      iconType="task"
      label="Tarefa"
      tone="emerald"
      options={[{ id: "1", label: "Opção 1" }]}
    />
    <ObjectTypeSplitChip
      iconType="flashcard"
      label="Flashcard"
      tone="purple"
      options={[{ id: "1", label: "Opção 1" }]}
    />
    <ObjectTypeSplitChip
      iconType="study-goal"
      label="Meta de Estudo"
      tone="red"
      options={[{ id: "1", label: "Opção 1" }]}
    />
    <ObjectTypeSplitChip
      iconType="collection"
      label="Coleção"
      tone="neutral"
      options={[{ id: "1", label: "Opção 1" }]}
    />
    <ObjectTypeSplitChip
      iconType="knowledge"
      label="Conhecimento"
      tone="indigo"
      options={[{ id: "1", label: "Opção 1" }]}
    />
    <ObjectTypeSplitChip
      iconType="daily-note"
      label="Nota Diária"
      tone="violet"
      options={[{ id: "1", label: "Opção 1" }]}
    />
  </div>
);

export const Sizes: Story = () => (
  <div className="p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-muted-foreground">Small:</span>
      <ObjectTypeSplitChip
        iconType="page"
        label="Página"
        size="sm"
        options={[{ id: "1", label: "Opção 1" }]}
      />
    </div>
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-muted-foreground">Medium:</span>
      <ObjectTypeSplitChip
        iconType="page"
        label="Página"
        size="md"
        options={[{ id: "1", label: "Opção 1" }]}
      />
    </div>
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-muted-foreground">Large:</span>
      <ObjectTypeSplitChip
        iconType="page"
        label="Página"
        size="lg"
        options={[{ id: "1", label: "Opção 1" }]}
      />
    </div>
  </div>
);

export const SingleActionChevron: Story = () => (
  <div className="p-6 flex items-center gap-4">
    <ObjectTypeSplitChip
      iconType="weblink"
      label="Weblink"
      tone="cyan"
      onLabelClick={() => alert("Weblink clicked")}
      onChevronClick={() => alert("Chevron clicked directly")}
    />
  </div>
);

export const ReadOnlyLabel: Story = () => (
  <div className="p-6 flex items-center gap-4">
    <ObjectTypeSplitChip
      iconType="archive"
      label="Arquivo"
      tone="gray"
      options={[
        { id: "unarchive", label: "Desarquivar" },
        { id: "delete", label: "Excluir permanentemente" },
      ]}
    />
  </div>
);
