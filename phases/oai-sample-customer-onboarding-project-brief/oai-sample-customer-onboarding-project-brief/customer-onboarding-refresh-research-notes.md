# Customer Onboarding Refresh - Research Notes

*Sample data only. Do not treat these companies, competitors, or notes as real.*

## Research Purpose

The Customer Onboarding Refresh team wants to understand practical onboarding patterns used by comparable B2B SaaS products. The goal is not to copy a competitor. The goal is to identify approaches that could make the first 30 days clearer, reduce early support friction, and help customers reach first value faster.

## Current Working Hypothesis

The strongest onboarding refresh will combine:

- A clear first-week checklist
- Role-based guidance for admins and champions
- In-product cues at the moment customers need help
- A small set of refreshed help center articles
- A standardized CSM kickoff recap for accounts with human support
- Light analytics that show whether customers reach first value sooner

## Competitive Patterns Reviewed

### Competitor A: LaunchLane

**Observed approach:** Milestone-based onboarding with a visible completion meter.

LaunchLane uses a short setup path organized around milestones such as "Invite your team," "Connect your first data source," and "Publish your first workspace." The account home page shows progress and highlights the next recommended action.

**What appears to work well:**

- Customers always know the next step.
- Progress is visible without needing a CSM to explain it.
- The checklist uses customer-friendly language rather than internal product terminology.

**Potential drawbacks:**

- The approach can feel too generic for customers with complex setup needs.
- A progress meter only helps if the underlying milestones are meaningful and accurately tracked.

**Implication for our brief:**

Consider a lightweight checklist that identifies the next best action. Avoid a complex dashboard in the first phase unless analytics coverage is ready.

### Competitor B: NorthstarHQ

**Observed approach:** Role-based paths for admins, team champions, and end users.

NorthstarHQ separates onboarding into paths based on the user's role. Admins see setup, security, and invite tasks. Champions see workflow examples and collaboration tips. End users see a short "how to participate" path after being invited.

**What appears to work well:**

- Customers do not have to sort through irrelevant setup steps.
- Admins and champions get different guidance without requiring a full training portal.
- The product can reuse the same core content with small variations.

**Potential drawbacks:**

- Role detection must be accurate, or customers may see the wrong path.
- More paths mean more content to maintain.

**Implication for our brief:**

Role-based guidance is worth exploring for admins and champions, but the first phase should keep the number of paths small.

### Competitor C: BeaconKit

**Observed approach:** Email sequence paired with an onboarding hub.

BeaconKit sends a short first-week email sequence. Each email points to one onboarding hub with setup steps, quick videos, and answers to common questions. The emails reinforce the same language customers see in the product.

**What appears to work well:**

- Customers receive guidance even if they do not log in immediately.
- The hub gives CSMs and Support one canonical place to send customers.
- Repeated labels reduce confusion across channels.

**Potential drawbacks:**

- Email can become noise if every message asks customers to do too much.
- The hub must stay current when product flows change.

**Implication for our brief:**

Refresh the welcome email sequence and help center entry points together. Make sure email, in-product copy, and help articles use the same terms.

### Competitor D: FlowDesk

**Observed approach:** Contextual in-product help instead of a long setup guide.

FlowDesk provides short tooltips, empty-state examples, and help links inside the setup flow. Customers do not need to leave the product to answer every question.

**What appears to work well:**

- Customers get support at the moment of confusion.
- Common support questions can be deflected before a ticket is created.
- The approach scales better than high-touch onboarding for every account.

**Potential drawbacks:**

- Too many tips can clutter the interface.
- Contextual help depends on strong information architecture and product copy.

**Implication for our brief:**

Use targeted in-product guidance for the highest-friction setup steps. Do not attempt to annotate every screen in the first phase.

### Competitor E: AtlasCRM

**Observed approach:** High-touch implementation for larger accounts, self-serve path for smaller accounts.

AtlasCRM separates onboarding by account complexity. Smaller customers get a guided self-serve path. Larger accounts receive an implementation plan, named specialist, and scheduled milestones.

**What appears to work well:**

- Complex customers receive human support where it matters.
- Self-serve customers are not forced into an enterprise process.
- Internal teams can allocate onboarding resources based on need.

**Potential drawbacks:**

- The line between self-serve and high-touch can become politically sensitive.
- Sales may oversell the high-touch experience if messaging is not clear.

**Implication for our brief:**

The Customer Onboarding Refresh should avoid promising concierge onboarding for every customer. The brief should clearly define which customer segments are in scope for the first phase.

## Cross-Competitor Themes

| Theme | Research Signal | Possible Application |
| --- | --- | --- |
| Make the next step obvious | Milestones, checklists, and progress indicators reduce uncertainty | Add a first-week checklist with one clear next action |
| Personalize only where useful | Role-based paths work when they stay simple | Start with admin and champion paths, not many personas |
| Keep language consistent | Email, product, and help center labels should match | Standardize terms like "connect data" across channels |
| Pair self-serve with selective human support | High-touch help should match customer complexity | Keep CSM kickoff templates in scope, but avoid universal concierge claims |
| Instrument the journey | Progress indicators and success reporting depend on reliable events | Confirm analytics coverage before treating metrics as final |

## Recommended Principles For The Project Brief

1. Treat the first 30 days as the main experience boundary.
2. Define first value before writing success metrics as commitments.
3. Build one coordinated journey across email, product guidance, kickoff recap, and help content.
4. Use a small number of role-based paths, likely admin and champion, before expanding.
5. Make customer-facing promises match actual support capacity.
6. Keep the pilot limited until content QA and instrumentation are ready.

## Ideas That Should Stay Out Of First-Phase Scope

- Full enterprise implementation redesign
- New customer academy or certification program
- CSM-facing analytics dashboard
- Billing, pricing, packaging, or contract language changes
- Large-scale migration center redesign
- Personalized concierge support for every customer

## Risks And Open Questions From Research

- A checklist could create false confidence if the milestones do not map to real first value.
- Role-based paths could add maintenance burden if the team creates too many content variations.
- Email updates will not help customers who are already confused inside the product unless in-product guidance also changes.
- Support article links could make the experience worse if the linked articles are stale.
- Sales messaging must not imply a level of human support that Customer Success cannot deliver.
- The team still needs to confirm the pilot cohort, pilot date, project owner, and success metric definition before the brief can be treated as final.
