# Capacities object-page action matrix

| Surface | Action | Observed result | Mutation retained | Evidence |
| --- | --- | --- | --- | --- |
| Object type | Open disclosure | Type selector opens independently of primary navigation | No | Live behavior |
| Collections | Open | Collections surface opens | No | Live behavior |
| Customize | Open | Customization surface opens | No | Live behavior |
| Overflow | Open | Object command menu opens | No | Live behavior |
| Editor | Type `parity-audit` and remove it | Text entry remains editable and the marker is fully removed | No | `interactions.behavior.json` |
| Mentions | Activate heading | Section collapses and expands | No | Image plus live behavior |
| Mention source | Activate source disclosure | Source details expand without opening the object | No | Live behavior |
| Mention source | Open overflow | Row actions open without navigating | No | Live behavior |
| Edge minus | Activate | Compact editor utility opens; object page remains visible | No | `interactions.behavior.json` |
| Utility tabs | Select Structure / Statistics | Selected content changes between outline and local counts | No | `interactions.behavior.json` |
| Utility pin | Pin, unpin, outside click | Pinned state resists incidental dismissal; unpinned outside click closes | No | `interactions.behavior.json` |

No localhost screenshot is stored in this bundle. No destructive or externally visible command was committed.
