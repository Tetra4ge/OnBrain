# 🎬 Phase 10 — Polish & Delivery (Hours 44–48)

**[← Phase 9 — Integration & Testing](./phase-9-integration-testing.md) | [Phases Index](./README.md)**

---

## Objective

Convert a working system into a compelling, low-risk submission. By the start of this phase, no more code changes should be needed beyond genuine emergencies — this is about packaging, evidence, and rehearsal.

## Features Covered

| Feature | Status |
|---|---|
| Benchmark metrics collection | Core |
| Architecture diagram (visual) | Core |
| Presentation deck | Core |
| Demo video (backup for live demo) | Core |
| Rehearsed demo script | Core |

## Folder Structure Changes

```
onbrain/
├── docs/
│   ├── benchmarks.md            # collected metrics from this phase
│   └── demo-script.md           # rehearsed, timed script
└── deliverables/
    ├── architecture-diagram.png (or .svg)
    ├── pitch-deck.pptx
    └── demo-video.mp4
```

## Step-by-Step Instructions

1. **Collect benchmark metrics** (hour 44–45)
   - Entity extraction accuracy: pick 3–5 documents from your sample set, manually note the entities a human would extract, compare against what Phase 3's extraction actually produced. Report as approximate precision/recall — be honest that this is a small manual sample, not a rigorous benchmark, if asked.
   - Copilot answer quality: prepare 8–10 test questions with what you believe the correct answer is, score each response as correct / partially correct / incorrect.
   - Graph linkage completeness: count entities vs. relationships in Neo4j (a simple Cypher count query) to have a concrete number, not just "it's populated."
   - Time-to-answer: time a few real Copilot and RCA queries; compare qualitatively against how long it would take a person to manually search the same documents for the same answer.
   - Write these into `docs/benchmarks.md` as a short results summary — a table of numbers is more credible to judges than a claim without evidence, even if the sample size is small.

2. **Finalize the architecture diagram** (hour 45)
   - Render the architecture from `architecture.md` visually — show all 4 layers, the specific agents, the 3 storage systems and which agent writes/reads each, and the orchestrator/API layer connecting them. Label clearly which components are core vs. stretch, matching what's actually in the final build (don't show a stretch feature as if it shipped if it was cut in Phase 9).

3. **Build the presentation deck** (hour 45–46), covering:
   1. Problem statement (with the framing stats from the original PDF, clearly attributed to the problem statement rather than presented as independently verified)
   2. Solution overview
   3. Architecture diagram
   4. Live demo walkthrough (or a placeholder slide indicating "live demo here")
   5. Impact metrics (from step 1's benchmarks)
   6. Scalability plan (Docker Compose today, managed cloud services as a stated next step)
   7. Team

4. **Record the demo video** (hour 46–47)
   - 2–3 minutes, following this script:

     | # | Action | Shows | Time |
     |---|---|---|---|
     | 1 | Upload 2–3 real documents live | Ingestion pipeline in real time | 30s |
     | 2 | Show the knowledge graph populating in Graph Explorer | OCR + extraction + graph sync | 20s |
     | 3 | Ask the Copilot a cross-document question | RAG + citations + confidence score | 30s |
     | 4 | Trigger RCA on a sample equipment failure | Multi-step reasoning chain + recommendation | 40s |
     | 5 | Show the architecture diagram + benchmark numbers | Technical excellence | 20s |

   - Record this even if you plan to demo live — a backup video protects you against Wi-Fi issues, a crashed container, or any other live-demo risk at the worst possible moment.

5. **Rehearse** (hour 47–48)
   - Run through the live demo (not just the video) at least twice, against the actual venue time limit for your presentation slot.
   - Include at least one unscripted question per team member during rehearsal — judges will ask something you didn't plan for, and the team should have practiced improvising an honest answer, including "we didn't get to that, here's how we'd approach it" where genuinely true.
   - Confirm every team member knows which parts are core vs. stretch/cut, so nobody accidentally overclaims a feature that was cut in Phase 9.

## Manual Verification Checklist

- [ ] `docs/benchmarks.md` contains real numbers from real testing, not placeholder or estimated figures.
- [ ] The architecture diagram accurately reflects what was actually built and shipped, not the original 14-day plan's full scope.
- [ ] The deck covers all 7 sections listed above and fits your actual presentation time slot when read aloud at a normal pace.
- [ ] The demo video is between 2 and 3 minutes and plays back without errors on a different machine than the one it was recorded on.
- [ ] Every team member can, without notes, correctly state which features are core/shipped versus stretch/cut — test this by asking each person cold.
- [ ] A full live-demo dry run completes with zero console errors and zero manual "fix-it" interventions, timed against the actual slot length.

## Dependencies

- Phase 9: the system must have passed its integration checklist before benchmarks or a demo video are recorded against it — recording a demo of a system that still has known blocking bugs wastes this phase's time.

## Notes / Scope Cuts

- Benchmarks here are honest, small-sample manual evaluations, not rigorous statistical studies — present them as such if a judge asks about methodology; overclaiming rigor you don't have is a bigger credibility risk than a small, honestly-labeled sample.
- If any stretch feature (P&ID YOLOv8, contradiction detection, Knowledge Cliff Capture) survived Phase 9's freeze, mention it briefly in the deck's scalability/future-work section even if it's not part of the live demo — this shows ambition without inflating the claimed working scope.
