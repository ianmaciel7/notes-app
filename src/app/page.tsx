"use client";

import { FolderOpen, Notebook, Pin, Plus, Search, Sparkles, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Note {
  id: string;
  title: string;
  content: string;
  category: "work" | "personal" | "ideas";
  pinned: boolean;
  date: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "Project Parity Architecture",
    content:
      "Review baseline Capacities ingestion pipelines and sync protocols. Align React 19 server components with Next.js 16.",
    category: "work",
    pinned: true,
    date: "Sep 11, 2026",
  },
  {
    id: "2",
    title: "Weekly Grocery List",
    content: "Organic milk, sourdough bread, avocados, Greek yogurt, coffee beans, dark chocolate.",
    category: "personal",
    pinned: false,
    date: "Sep 10, 2026",
  },
  {
    id: "3",
    title: "AI Knowledge Graph Feature Idea",
    content:
      "Integrate graphify AST indexing directly with real-time vector search for instant semantic note referencing.",
    category: "ideas",
    pinned: true,
    date: "Sep 09, 2026",
  },
];

function CreateNoteDialog({
  isOpen,
  onOpenChange,
  onSave,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (note: {
    title: string;
    content: string;
    category: "work" | "personal" | "ideas";
  }) => void;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"work" | "personal" | "ideas">("work");

  const handleSubmit = () => {
    if (!newTitle.trim()) return;
    onSave({ title: newTitle, content: newContent, category: newCategory });
    setNewTitle("");
    setNewContent("");
    setNewCategory("work");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Note
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Capture your thoughts, ideas, or task lists cleanly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <div className="flex gap-2">
              {(["work", "personal", "ideas"] as const).map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={newCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              placeholder="Write your note content here..."
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NoteCard({
  note,
  onTogglePin,
  onDelete,
}: {
  note: Note;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card
      className={`relative flex flex-col justify-between transition-all hover:shadow-md ${
        note.pinned ? "border-primary/40 bg-accent/30" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">{note.title}</CardTitle>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 ${
                    note.pinned ? "text-primary fill-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => onTogglePin(note.id)}
                >
                  <Pin className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>{note.pinned ? "Unpin Note" : "Pin Note"}</TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <span>{note.date}</span>
          <span>•</span>
          <Badge variant="secondary" className="capitalize text-[10px] px-1.5 py-0">
            <Tag className="h-2.5 w-2.5 mr-1" />
            {note.category}
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
          {note.content}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex justify-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(note.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent>Delete Note</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveNote = ({
    title,
    content,
    category,
  }: {
    title: string;
    content: string;
    category: "work" | "personal" | "ideas";
  }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      category,
      pinned: false,
      date: "Just now",
    };
    setNotes([newNote, ...notes]);
  };

  const togglePin = (id: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || note.category === activeTab;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <Notebook className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Notes App</h1>
            <p className="text-xs text-muted-foreground">Powered by shadcn/ui</p>
          </div>
        </div>
        <CreateNoteDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveNote}
        />
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-4 sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="ideas">Ideas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} onTogglePin={togglePin} onDelete={deleteNote} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-card/50">
            <div className="p-4 rounded-full bg-muted mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
              {searchQuery
                ? "No notes matched your search query. Try typing something else."
                : "Get started by creating your first note."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Sparkles className="h-4 w-4" /> Create Note
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
