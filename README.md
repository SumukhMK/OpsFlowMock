# Opsflow (Mock)

A JSON-driven mock UI using React + Vite and the HPE Design System (Grommet). All UI content is configured via JSON under `public/json/` and fetched at runtime.

## Routes
- `/projects` — Create a project (form) and view a table of entries (in-memory).
- `/analyze` — Upload `.txt` or `.vtt` (mock), click Analyze to load `example-results.json`, compare As Is vs To Be, bulk Confirm.
- `/architectures` — Pick one pair among 3 architecture variants (As-Is + To-Be). Assets are placeholders under `public/assets/architectures/`.
- `/staffing` — Team vs Skills, Employees mapped to Team, and Rate card + Final bill summary.

## JSON locations
- `public/json/projects/form.json` — Form schema (labels, required, button label).
- `public/json/projects/table.json` — Table columns.
- `public/json/projects/projects.json` — Seed project rows.
- `public/json/analyze/upload.json` — Upload constraints and labels.
- `public/json/analyze/tables.json` — Table configs and bulk confirm.
- `public/json/analyze/example-results.json` — Static analysis output.
- `public/json/architectures/architectures.json` — Three selectable pairs with image placeholders.
- `public/json/staffing/` — `team_requirements.json`, `mapping.json`, `final_team.json`.

## Develop
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open the printed localhost URL. Navigate via the top nav.

## Assets
Place architecture images under:
```
public/assets/architectures/as-is/{v1,v2,v3}.png
public/assets/architectures/to-be/{v1,v2,v3}.png
```
Update paths in `public/json/architectures/architectures.json` if needed.

## Notes
- All state is in-memory. Refreshing the page clears entries and selections.
- You can expand table schemas or forms by editing the JSONs; components render dynamically.
