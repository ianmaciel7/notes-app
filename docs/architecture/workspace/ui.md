# Workspace User Interface Guide

This document describes the visual elements, user experience (UX) flows, and interface layout of the Notes App main workspace.

## Interface Layout Overview

The Workspace interface is organized into five primary visual zones:

1. **Header & Navigation Bar**: Top sticky bar containing branding logo, status indicator, and the primary "+ New Note" action trigger.
2. **Search & Filter Control Bar**: Controls for real-time text searching and category tab filtering (`All`, `Work`, `Personal`, `Ideas`).
3. **Note Cards Grid**: Responsive grid layout displaying note cards sorted with pinned notes at the top.
4. **Create Note Modal Dialog**: Popover modal for capturing new note titles, selecting category tags, and entering note content.
5. **Empty State Component**: Visual placeholder fallback with quick action trigger when no notes match active filters or when the workspace is empty.

## Visual Components & Layout Details

### 1. Header Bar
- **App Branding**: Icon badge with app title ("Notes App") and technology tagline ("Powered by shadcn/ui").
- **Primary CTA Button**: High-visibility button with a plus icon to trigger the note creation modal dialog.

### 2. Search & Toolbar
- **Search Input Field**: Left-aligned search bar with a magnifying glass icon for dynamic client-side title and content filtering.
- **Category Tabs Navigation**: Filter tabs allowing quick switching between categories:
  - `All`: Display all notes.
  - `Work`: Filter notes tagged for work.
  - `Personal`: Filter personal items and lists.
  - `Ideas`: Filter creative or architectural thoughts.

### 3. Note Card Component
Each note card displays the following visual elements and controls:
- **Header**:
  - **Title**: Semibold, single-line text preview.
  - **Pin Toggle**: Quick action button to pin/unpin notes. Pinned cards feature a distinct accent border and subtle background highlight.
- **Metadata Badge**: Creation date and category tag pill (`Work`, `Personal`, or `Ideas`).
- **Body Content**: Multi-line snippet displaying note body text with text truncation (up to 4 lines).
- **Footer Controls**: Destructive action button (trash icon) to remove the note from the workspace.

### 4. Create Note Modal Dialog
- **Dialog Header**: Clear title ("Create New Note") and contextual instructions.
- **Form Inputs**:
  - Title text input.
  - Category selector button group to toggle between `work`, `personal`, and `ideas`.
  - Multi-line textarea for note content entry.
- **Footer Actions**: Standard `Cancel` (dismiss) and `Save Note` (submit) buttons.

### 5. Empty State View
- Displayed when no notes match search queries or when the collection is empty.
- Features a folder icon, helpful feedback message, and a direct "Create Note" button trigger.

## Theme & Responsive Behavior

- **Responsive Grid**:
  - **Mobile (< 768px)**: Single-column full-width card layout.
  - **Tablet (768px – 1024px)**: 2-column grid layout.
  - **Desktop (> 1024px)**: 3-column grid layout.
- **Dark Mode Support**: Seamless adaptation across dark and light themes using CSS variables and tailwind color tokens.
