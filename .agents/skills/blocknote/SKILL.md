---
name: blocknote
description: Best practices, schema configuration, custom blocks, styling with Tailwind CSS v4 and @blocknote/shadcn, and conversion to/from Markdown and Dexie ContentBlock structures for BlockNote in React 19 / Next.js.
---

# BlockNote Editor Skill (`@blocknote/react` & `@blocknote/shadcn`)

BlockNote is a block-based, Notion-style rich text editor built on top of TipTap and ProseMirror, fully compatible with React 19 and Tailwind CSS v4.

## 1. Installation & Dependencies

The repository uses:
- `@blocknote/core`: Core block-based document model and ProseMirror bindings.
- `@blocknote/react`: React 19 hooks (`useCreateBlockNote`) and context.
- `@blocknote/shadcn`: Native shadcn/ui integration using `@base-ui/react` primitives and Tailwind CSS styling.

## 2. Essential Component Setup (Next.js App Router)

BlockNote requires DOM APIs and **MUST run inside Client Components (`'use client'`)**. When embedding in server-rendered pages, use dynamic imports with SSR disabled to prevent hydration mismatch:

```tsx
'use client';

import dynamic from 'next/dynamic';

export const Editor = dynamic(() => import('./blocknote-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-md bg-muted/20" />
  ),
});
```

### Basic Editor Component (`blocknote-editor.tsx`)

```tsx
'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';

interface EditorProps {
  initialContent?: any[];
  onChange?: (blocks: any[]) => void;
  editable?: boolean;
}

export default function BlockNoteEditor({
  initialContent,
  onChange,
  editable = true,
}: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent && initialContent.length > 0 ? initialContent : undefined,
  });

  return (
    <div className="w-full">
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={() => {
          if (onChange) {
            onChange(editor.document);
          }
        }}
      />
    </div>
  );
}
```

## 3. Tailwind CSS v4 Integration

`@blocknote/shadcn` relies on Tailwind utility classes without bundling CSS variables directly.
In `src/app/globals.css`, ensure `@source` includes the package:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@source "../../node_modules/@blocknote/shadcn";
```

## 4. Performance & Persistence Contract (Input Performance Rule)

Never dispatch database updates (e.g. Dexie.js `KnowledgeOS_DB`) on every keystroke in `onChange`. Follow `input-performance.md`:

1. **Buffered Debounce**:
   ```typescript
   // Debounce saving editor content to Dexie by 400ms
   const debouncedSave = useDebouncedCallback((blocks: Block[]) => {
     db.entities.update(entityId, {
       blocks: serializeToContentBlocks(blocks),
       updatedAt: Date.now(),
       _syncStatus: 'pending',
     });
   }, 400);
   ```
2. **Immediate Flush**:
   Flush pending changes immediately on `onBlur`, component unmount, or page navigation.
3. **IME & Composition**:
   Do not commit changes while composition (`isComposing`) is active.

## 5. Schema Mapping: BlockNote to `SPEC.md` `ContentBlock`

`SPEC.md` defines `ContentBlock`:
```typescript
export interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' | 'bullet_list' | 'numbered_list' | 'code' | 'callout' | 'quote' | 'divider';
  content: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    color?: string;
  };
  metadata?: Record<string, any>;
}
```

### Conversion Utility Pattern

```typescript
import type { Block } from '@blocknote/core';
import type { ContentBlock } from '@/types/schema';

export function blockNoteToContentBlocks(blocks: Block[]): ContentBlock[] {
  return blocks.map((b) => {
    let type: ContentBlock['type'] = 'paragraph';
    if (b.type === 'heading') {
      const level = (b.props as any)?.level || 1;
      type = level === 1 ? 'heading_1' : level === 2 ? 'heading_2' : 'heading_3';
    } else if (b.type === 'bulletListItem') {
      type = 'bullet_list';
    } else if (b.type === 'numberedListItem') {
      type = 'numbered_list';
    } else if (b.type === 'codeBlock') {
      type = 'code';
    }

    const textContent = Array.isArray(b.content)
      ? b.content.map((c: any) => c.text || '').join('')
      : '';

    return {
      id: b.id,
      type,
      content: textContent,
      metadata: { blockProps: b.props },
    };
  });
}
```

## 6. Document & Flashcard Anchor Linking

When extracting flashcards from BlockNote content:
- Preserve block `id` as anchor references.
- Link `Flashcard.sourceHighlightId` or `Flashcard.metadata.blockId` to the specific BlockNote block `id` for instant navigation and bi-directional backlink traversal.
