import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ObjectListView } from "@/app/_components/objects/list/use-object-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ObjectListSearch({ view }: { view: ObjectListView }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (view.searchOpen) inputRef.current?.focus();
  }, [view.searchOpen]);

  if (view.searchOpen) {
    return (
      <Input
        ref={inputRef}
        value={view.preferences.query}
        aria-label={`Buscar em ${view.listName}`}
        placeholder={`Buscar em ${view.listName}`}
        className="h-8 w-40 border-0 bg-transparent px-2 text-sm shadow-none"
        onChange={(event) => view.updatePreferences({ query: event.target.value })}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          view.setSearchOpen(false);
          view.updatePreferences({ query: "" });
          requestAnimationFrame(() => view.searchTriggerRef.current?.focus());
        }}
      />
    );
  }
  return (
    <Button
      type="button"
      ref={view.searchTriggerRef}
      variant="ghost"
      size="icon-sm"
      tooltip="Buscar nesta visualização"
      aria-label={`Buscar em ${view.listName}`}
      aria-pressed={view.searchOpen}
      className="size-8 rounded-none"
      onClick={() => view.setSearchOpen(true)}
    >
      <Search className="size-3.5" aria-hidden="true" />
    </Button>
  );
}
