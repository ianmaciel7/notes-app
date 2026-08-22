# Atomic Notes listing control matrix

Captured 2026-08-22 from the authenticated Capacities Atomic Notes object-type page at a 1294 x 912 CSS-pixel viewport. This artifact records observed UI contracts only; no proprietary bundles, authentication material, or application source is included.

## Measured desktop geometry

| Surface | Authenticated target |
| --- | --- |
| Type badge | x=314, y=66, 26 x 26 px |
| Heading | x=353, y=69, 20 px Inter, weight 700, line-height 20 px |
| Search / collapse / options | three contiguous 32 x 32 px controls |
| Split New | 102.3 x 32 px total; 73.3 px action and 30 px disclosure |
| Overview tab | x=311, y=112, 109.9 x 32 px |
| All tab | x=420.9, y=112, 74.8 x 32 px |
| Add-view control | x=495.7, y=112, 32 x 32 px |
| Overview settings | right-aligned 30 x 28 px control |
| Section headings | x=319 at y=160, 330, and 500; 170 px cadence |

## Observed state transitions

| Control | Authenticated Capacities behavior | Local parity contract |
| --- | --- | --- |
| Search | Replaces the search icon with a focused title field; Escape restores the control | Focused title filter with Escape reset |
| Collapse | Hides the view/actions row while retaining the type header and content | Same |
| Options | Opens template, query, collection, pin, settings, export, and import commands | Every enabled command changes local state; export/import remain browser-local |
| Split New | Offers current type, import files, and global New object | Same; global New opens the existing sidebar palette |
| Overview / All | Switches between section overview and complete-list state | Same |
| Add view | Opens a searchable menu with New Query, New collection, and derived views | Local menu exposes the same stateful entry families |
| Settings | Opens visible/hidden section lists with checkbox controls | Checkbox-driven visibility; hidden sections can be restored |
| Section title | Collapses or expands its section | Same |
| Recent expand | Opens the dedicated complete-list state | Same |
| Collection | Immediately creates an untitled collection and opens its editor | Creates a sequential untitled local entry and focuses its editable title |
| Query | Immediately creates an untitled query and opens its editor | Creates a sequential untitled local entry and focuses its editable title |
| Filter | Adds a filter row that affects the object result set | All/untitled filter affects visible entities |
| Sort | Adds a sort row and changes result order | Recent/title sort affects visible entities |
| List / Grid / More views | Changes presentation or opens the view menu | Same |

## Reference cleanup

Opening the authenticated Collection command created one temporary `Sem título` collection immediately. The temporary collection was deleted through its object menu and the deletion confirmation, leaving the reference workspace without the audit-created collection.
