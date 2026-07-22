# 🕸️ Phase 8 — Frontend Advanced (Hours 30–38)

**[← Phase 7 — Frontend Core](./phase-7-frontend-core.md) | [Phases Index](./README.md) | Next: [Phase 9 — Integration & Testing →](./phase-9-integration-testing.md)**

---

## Objective

Build the two highest-impact-for-judges views — the Graph Explorer and RCA Workbench — plus the mobile-responsive layout for the field-technician persona. These are your strongest Innovation and User Experience scoring opportunities, so don't compress this phase to save time elsewhere; if something has to give, it should come out of Phase 3's stretch items, not here.

This phase requires Phase 5 (Copilot) and Phase 6 (RCA) to be returning real data, at least in a rough form — start it once those backend phases are functionally working, even before they're fully polished.

## Features Covered

| Feature | Status |
|---|---|
| Knowledge Graph Explorer (force-directed visualization) | Core differentiator |
| Node-click detail panel (folded-in Equipment Profile) | Core |
| RCA Workbench (trigger + results display) | Core differentiator |
| Mobile-responsive layout | Core |

## Folder Structure Changes

```
onbrain/frontend/src/
├── views/
│   ├── GraphExplorer.jsx
│   └── RcaWorkbench.jsx
├── components/
│   ├── GraphCanvas.jsx           # force-directed graph rendering
│   ├── NodeDetailPanel.jsx       # click-to-explore detail (Equipment Profile, folded in)
│   ├── RcaForm.jsx               # equipment tag + failure description input
│   ├── RcaResultCard.jsx         # hypothesis + evidence + recommendation display
│   └── MobileNav.jsx             # simplified nav for small viewports
```

## Step-by-Step Instructions

1. **Choose a graph visualization approach** (`components/GraphCanvas.jsx`)
   - Use a force-directed graph library appropriate for your frontend stack (e.g. a React-friendly force-graph library). Verify the current package name and API against its docs/npm page before installing — don't assume a remembered import path, several similarly-named packages exist.
   - Fetch graph data from `GET /api/graph/equipment` (or a scoped equivalent) and render nodes colored/shaped by entity type (`Equipment`, `WorkOrder`, `Failure`, `Procedure`, `Regulation`).
   - Keep the initial render scoped — don't try to render your entire graph at once if it's large; start from a specific equipment node and expand outward, or filter by entity type, so the visualization stays legible in a demo.

2. **Node detail panel** (`components/NodeDetailPanel.jsx`)
   - Clicking a node opens a side panel showing that node's properties and its direct relationships — this is the "Equipment Profile" from the original plan, folded into Graph Explorer instead of a separate page (see architecture notes).
   - For an `Equipment` node specifically, show a simple timeline: linked failures, work orders, and inspections, sorted by date if that data is available in the graph.

3. **RCA Workbench** (`views/RcaWorkbench.jsx`, `components/RcaForm.jsx`, `components/RcaResultCard.jsx`)
   - Form: equipment tag (ideally a dropdown populated from known equipment nodes, not free text, to avoid typos causing empty results) + failure description text area.
   - On submit, call `POST /api/rca/analyze` (Phase 6) and display a loading state — RCA calls may take several seconds, don't let the UI look frozen or broken during that wait.
   - Results display: pattern summary, ranked hypotheses with their supporting/weakening evidence, and the top recommendation with its linked procedure/regulation (or an explicit "no matching procedure found" message — never hide this case).
   - Link each piece of cited evidence back to its source document, reusing the citation component pattern from Phase 7's Copilot Chat if possible, for visual consistency.

4. **Mobile-responsive layout** (`components/MobileNav.jsx`, responsive CSS pass across existing views)
   - Add responsive breakpoints so Copilot Chat becomes the default/primary view on small viewports — this is the technician persona's main use case, not the Graph Explorer or RCA Workbench, which are desk-engineer-oriented.
   - Simplify navigation to a bottom tab bar or hamburger menu for one-handed use.
   - The Graph Explorer and RCA Workbench don't need to be fully mobile-optimized if time is tight — Copilot Chat and Upload Center are the mobile priority; say so explicitly to judges rather than pretending full mobile parity if it isn't there.

## Manual Verification Checklist

- [ ] Load the Graph Explorer against real ingested data (from your actual Phase 2 sample documents) and confirm nodes and relationships render correctly — cross-check one equipment node's connections against what you know is actually in the source documents.
- [ ] Click through several nodes and confirm the detail panel shows accurate, non-fabricated information pulled from the graph.
- [ ] Run the RCA Workbench against 2 different equipment/failure combinations and confirm the results match what Phase 6's manual checklist already validated — the UI should not distort or drop information the backend correctly returned.
- [ ] Resize the browser (or use device emulation) to a phone-width viewport and confirm Copilot Chat and Upload Center are fully usable one-handed; note plainly which views are not mobile-optimized if any aren't.
- [ ] Have someone who did not build these views try to use them cold, without instructions — note anywhere they get stuck; fix the most confusing one if time allows.

## Dependencies

- Phase 5: Copilot agent returning real answers.
- Phase 6: RCA agent returning real analysis results.
- Phase 4: Neo4j graph populated with real data to visualize.
- Phase 7: shared components (citation display pattern, layout shell) this phase builds on top of.

## Notes / Scope Cuts

- Equipment Profile is not a separate page — folded into the Graph Explorer's node detail panel, per the architecture doc's scope-cut list. This saves a full page build with no real loss of functionality.
- Full mobile parity across every view is not a goal — Copilot Chat and Upload Center are the mobile priority since those map to the technician persona's actual use case named in the problem statement.
