# 🔗 Phase 9 — Integration & Testing (Hours 38–44)

**[← Phase 8 — Frontend Advanced](./phase-8-frontend-advanced.md) | [Phases Index](./README.md) | Next: [Phase 10 — Polish & Delivery →](./phase-10-polish-delivery.md)**

---

## Objective

Everything built independently in Phases 1–8 now has to work together, reliably, without a developer in the room to explain away rough edges. This phase has one job: find out what breaks when real users touch the real system end-to-end, and fix it — or cut it. No new features start here.

## Features Covered

| Feature | Status |
|---|---|
| Full end-to-end flow test (upload → ingest → graph/vector → Copilot/RCA → UI) | Core |
| Cross-team integration bug fixing | Core |
| Hard feature freeze | Core process gate |

## Folder Structure Changes

No new folders. This phase may touch files across the entire `backend/app/` and `frontend/src/` trees as integration bugs are fixed — keep changes small and targeted, resist the urge to refactor.

## Step-by-Step Instructions

1. **Run the full demo flow end-to-end, as a user would, not as a developer** (hour 38–40)
   - Upload each of your real sample document types (work order, inspection report, manual, and P&ID if in scope) through the actual UI, not via direct API calls.
   - Watch the knowledge graph populate in the Graph Explorer.
   - Ask the Copilot 3–5 real cross-document questions you haven't tested before, including at least one you expect might fail.
   - Run the RCA Workbench against a real equipment/failure scenario from your sample set.
   - Log every rough edge, error, or confusing moment — don't fix as you go yet, just log first, so you can prioritize.

2. **Triage the log** (hour 40)
   - Sort issues into: blocks the demo (must fix), makes the demo look unpolished (fix if time allows), cosmetic only (defer).
   - Assign blocking issues to whoever owns that part of the stack.

3. **Fix blocking issues only** (hour 40–42)
   - Common integration failure points to check specifically:
     - Frontend mocked-response shapes from Phase 7/8 not matching what the real backend actually returns (the most common source of "works alone, breaks together" bugs).
     - CORS configuration between frontend and backend containers.
     - JWT verification failing silently (confirm the backend is actually validating the Firebase token, not just checking for its presence).
     - Timeouts — Copilot and RCA calls that were fine in isolated testing but time out when the graph/vector stores have your full sample document set loaded.
     - Race conditions in the document status polling — confirm a document that fails ingestion shows a clear failed state, not an infinite "processing" spinner.

4. **Feature freeze at hour 42**
   - No new features, no "quick" additions, no refactors past this point — every hour from here should go toward making what exists more reliable, not toward adding scope.
   - If a stretch feature (P&ID YOLOv8, contradiction detection, Knowledge Cliff Capture) isn't fully working by this point, cut it from the demo plan rather than risk it live. It's fine to mention it as future work in the deck.

5. **Run the full flow twice more, back to back** (hour 42–44)
   - The system should complete the entire demo flow twice in a row with no manual intervention (no restarting containers, no manually fixing data between runs). If it can't, that's still a blocking issue — go back to step 3.

## Manual Verification Checklist

- [ ] The full demo flow (upload → graph populates → Copilot answers a cross-document question → RCA analysis returns a result) runs start to finish through the actual UI, twice in a row, with no manual intervention between runs.
- [ ] At least one deliberately "hard" Copilot question (spanning 3+ documents, or asking something the corpus doesn't fully cover) is tested, and the system's response is honest about its confidence rather than fabricating a confident-sounding answer.
- [ ] A fresh browser session (or incognito window) can log in, upload a document, and get a Copilot answer without any developer intervention or undocumented manual step.
- [ ] Every stretch feature still in scope after the freeze (if any) has been tested at least twice with different inputs, not just the one input it happened to work on during development.
- [ ] Every stretch feature cut at the freeze is explicitly marked as cut in your working notes, so nobody on the team accidentally demos something that was removed.
- [ ] Check browser DevTools console during a full run-through — zero uncaught JS errors and no failed network requests that aren't handled gracefully in the UI.

## Dependencies

- All of Phases 1–8 must have their own manual verification checklists passed before this phase starts — Phase 9 is for integration bugs, not for finishing incomplete phases. If a phase isn't actually done, go back and finish it rather than trying to integration-test around a gap.

## Notes / Scope Cuts

- This phase does not add automated test suites or CI — for a 48-hour build, manual end-to-end verification by real usage is a better time investment than writing test infrastructure you won't reuse.
- Anything cut here should be cut permanently for this build, not "fixed later" — there is no later before judging.
