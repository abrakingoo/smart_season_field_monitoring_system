# Smart Season Field Monitoring System

A web application that helps track crop progress across multiple fields during a growing season.

## Field Stages

Fields follow a simple lifecycle:

| Stage | Description |
|-------|-------------|
| Planted | Seeds have been sown |
| Growing | Crop is actively growing |
| Ready | Crop is ready for harvest |
| Harvested | Crop has been harvested |

## Field Status Logic

Each field has a computed status derived from its stage, notes, and last update time:

| Status | Condition |
|--------|-----------|
| **Completed** | Stage is `Harvested` |
| **At Risk** | Stage is not `Harvested` AND either: the field has not been updated in over 7 days (stale), or a note contains risk keywords (`pest`, `disease`, `drought`, `flood`, `damage`, `wilt`, `rot`) |
| **Active** | All other fields |

The status is computed client-side in `src/utils/fieldStatus.js` and applied via the `useFields` hook on every render, so it always reflects the latest data.
