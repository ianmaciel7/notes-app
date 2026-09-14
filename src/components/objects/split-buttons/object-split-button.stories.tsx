import type { Story, StoryDefault } from "@ladle/react";
import { ObjectSplitButton } from "./object-split-button";

export default {
  title: "Objects / Split Buttons / ObjectSplitButton",
} satisfies StoryDefault;

export const DefaultCreateButton: Story = () => (
  <div className="p-6 flex items-center gap-4">
    <ObjectSplitButton label="Novo" onPrimaryClick={() => alert("Primary action clicked: Novo")} />
  </div>
);

export const SecondaryVariant: Story = () => (
  <div className="p-6 flex items-center gap-4">
    <ObjectSplitButton
      label="Nova Página"
      icon="page"
      variant="secondary"
      onPrimaryClick={() => alert("Nova página criada")}
      options={[
        { id: "import", label: "Importar arquivo Markdown", icon: "file" },
        { id: "template", label: "Usar modelo de Nota", icon: "idea" },
      ]}
    />
  </div>
);

export const OutlineVariant: Story = () => (
  <div className="p-6 flex items-center gap-4">
    <ObjectSplitButton
      label="Adicionar Meta"
      icon="study-goal"
      variant="outline"
      onPrimaryClick={() => alert("Adicionar meta")}
      options={[
        { id: "daily", label: "Meta Diária", icon: "daily-note" },
        { id: "flashcard", label: "Sessão Flashcard", icon: "flashcard" },
      ]}
    />
  </div>
);

export const Sizes: Story = () => (
  <div className="p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-muted-foreground">Small:</span>
      <ObjectSplitButton size="sm" label="Novo" />
    </div>
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-muted-foreground">Medium:</span>
      <ObjectSplitButton size="md" label="Novo" />
    </div>
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-muted-foreground">Large:</span>
      <ObjectSplitButton size="lg" label="Novo" />
    </div>
  </div>
);
