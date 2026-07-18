# Customer Onboarding Refresh - Meeting Notes

*Sample data only. Do not treat these names, companies, or notes as real.*

## Meeting 1: Project Kickoff And Problem Framing

**Date:** April 14, 2026  
**Attendees:** Dana Kim (VP Customer Experience), Anika Reyes (Product Marketing), Marcus Lee (Customer Success Ops), Priya Nair (Product), Eli Santos (Support), Jordan Avery (Design), Sam Patel (Data and Analytics)

### Purpose

Align on why the onboarding refresh matters and what the first project brief should cover.

### Discussion Notes

- Dana opened by saying the current onboarding experience "works if a CSM is holding the customer's hand, but feels scattered when a customer is trying to move on their own."
- The team agreed that the first 30 days after signup should be the focus of the refresh. Anything after expansion, renewal, or advanced enterprise implementation is probably out of scope for the first pass.
- Sam shared an initial readout from recent account data:
  - Median time to first value appears to be around 14 days for new self-serve and mid-market customers.
  - Only about 61 percent of new accounts complete the current setup checklist.
  - Roughly one-third of new customers contact Support during the first 14 days.
- Priya cautioned that the "time to first value" metric is not consistently instrumented across all signup paths. The baseline should be treated as directional until Analytics validates it.
- Anika suggested the brief should explain the customer problem in plain language, not only operational metrics.
- Marcus said CSMs need a clearer handoff from Sales and a repeatable kickoff structure, especially for mid-market accounts.
- Eli noted that Support sees the same early questions every week: where to start, how to import data, who should be invited first, and how admin permissions work.

### Decisions Or Working Agreements

- The project brief should focus on improving the first 30 days of onboarding for new self-serve and mid-market customers.
- The first draft should include summary, goals, scope, stakeholders, risks, open questions, decisions, and next steps.
- The project should avoid promising a full enterprise implementation redesign in this first phase.

### Open Questions

- Who is the final accountable owner for the brief: Anika, Marcus, or a shared Product Marketing and CS Ops pairing?
- What exact metric should define "first value"?
- Should the first pilot include self-serve customers only, or both self-serve and mid-market customers?
- What date should be used for the steering review? Dana mentioned early June, but no calendar hold was created in the meeting.

## Meeting 2: Customer Success And Support Pain Points

**Date:** April 21, 2026  
**Attendees:** Marcus Lee (Customer Success Ops), Eli Santos (Support), Anika Reyes (Product Marketing), Priya Nair (Product), Nora Blake (Sales Enablement), Sam Patel (Data and Analytics)

### Purpose

Collect recurring customer-facing issues from CSMs, Support, and Sales handoffs.

### Discussion Notes

- Marcus said the current kickoff process depends too heavily on individual CSM style. Some customers get a crisp checklist, while others get a long meeting recap with no clear next action.
- CSMs often repeat information already covered by Sales because the handoff notes are incomplete or too generic.
- Nora said Sales wants the refreshed onboarding to preserve momentum from the buying process. Customers are excited after signing, but there is a drop-off when the next step is unclear.
- Eli summarized the most common first-month Support topics:
  - Data import and file formatting
  - Admin permissions and role setup
  - Integration authentication
  - "Where do I start?" questions after account creation
  - Confusion about whether to invite teammates before or after setup
- Support believes several tickets could be prevented if the product linked directly to the right help article at the moment of setup.
- Priya said the Product team can consider a light in-app checklist, but a full setup wizard would require more design and engineering time than this project likely has.
- Anika asked whether the project should refresh email copy, in-product guidance, kickoff materials, or all three. The group leaned toward a coordinated but limited refresh.

### Decisions Or Working Agreements

- The brief should include both customer-facing improvements and internal handoff improvements.
- The first phase should include a standardized kickoff recap template for CSMs.
- The project should identify the top onboarding friction points rather than trying to rewrite every onboarding touchpoint.

### Open Questions

- Should "first value" mean completing core setup, importing data, inviting teammates, or completing a first workflow?
- Who will update the Support articles if the project changes the onboarding flow?
- Is Support capacity available for article review before the pilot?

## Meeting 3: Product And Design Scope Review

**Date:** April 29, 2026  
**Attendees:** Priya Nair (Product), Jordan Avery (Design), Sam Patel (Data and Analytics), Anika Reyes (Product Marketing), Marcus Lee (Customer Success Ops), Theo Grant (Engineering)

### Purpose

Identify what can realistically be included in the first version of the refresh.

### Discussion Notes

- Priya proposed a narrow product scope: use the existing empty-state component, add a checklist panel for the first account setup tasks, and link to targeted help content.
- Jordan said design can support a lightweight checklist and revised empty states, but not a complete onboarding redesign before the pilot.
- Theo said engineering can likely instrument a few new events, but the team needs the metric definition before committing to work.
- Sam noted that the current analytics setup captures account creation and teammate invitation, but not all setup checklist steps.
- Marcus asked for a visible status indicator so CSMs can see whether a customer is progressing. Priya said a CSM-facing dashboard is useful but likely out of scope for the first phase.
- Anika recommended using simpler language in the product and email copy. Customers should see a concrete next step, not a list of product concepts.

### Decisions Or Working Agreements

- In scope for the first phase:
  - Refreshed welcome email sequence
  - Role-based first-week checklist for admins and champions
  - Lightweight in-app checklist panel using existing components
  - Updated kickoff recap template for CSMs
  - Targeted links to revised help center articles
  - Basic analytics for first-value milestones, if feasible
- Out of scope for the first phase:
  - Full setup wizard rebuild
  - Billing, pricing, packaging, or contract changes
  - Enterprise implementation methodology
  - Certification or academy-style customer training portal
  - CSM-facing dashboard
  - Migration center redesign

### Open Questions

- Which setup events can Engineering instrument before the pilot?
- Can the team ship the checklist without a new dashboard?
- Does the refresh apply only to new accounts, or should existing accounts see any of the new guidance?

## Meeting 4: Content, Messaging, And Enablement Session

**Date:** May 7, 2026  
**Attendees:** Anika Reyes (Product Marketing), Nora Blake (Sales Enablement), Marcus Lee (Customer Success Ops), Eli Santos (Support), Jordan Avery (Design), Dana Kim (VP Customer Experience)

### Purpose

Define the communication approach and decide what language should change in onboarding materials.

### Discussion Notes

- Anika proposed two customer paths:
  - Admin path: set up the workspace, connect data, configure permissions, invite teammates.
  - Champion path: understand the first workflow, invite the right collaborators, complete a useful first task.
- Nora asked for Sales to describe the experience as "concierge onboarding for every customer." Marcus and Dana pushed back because the team cannot staff that level of human support for all accounts.
- Dana said the refresh should feel guided, but the brief must not create a support promise the team cannot meet.
- Eli asked for the help center articles to be updated before any email or in-product copy points customers to them.
- Jordan recommended consistent labels across email, product UI, and help center articles. Right now, the same action is described as "connect data," "import data," and "sync source."
- Marcus wants the CSM kickoff template to include a short "what happens next" section and a customer-owned checklist.

### Decisions Or Working Agreements

- Avoid language that promises white-glove or concierge service for every customer.
- Use consistent labels for the core setup actions across emails, product UI, CSM templates, and help center content.
- The brief should include enablement as part of scope, but not a full Sales messaging overhaul.

### Conflicts Or Items Needing Confirmation

- Nora referenced a target pilot date of June 24, 2026.
- Marcus referenced July 8, 2026 as the earliest realistic pilot date because CSM training and help center review may not be ready by late June.
- No final pilot date was confirmed in the meeting.
- Legal review may be needed if the team wants to use customer quotes in training or launch materials.

## Meeting 5: Pilot Planning And Risk Review

**Date:** May 20, 2026  
**Attendees:** Dana Kim (VP Customer Experience), Anika Reyes (Product Marketing), Marcus Lee (Customer Success Ops), Priya Nair (Product), Eli Santos (Support), Sam Patel (Data and Analytics), Theo Grant (Engineering), Jordan Avery (Design)

### Purpose

Review readiness for a limited pilot and identify risks the project brief should make visible.

### Discussion Notes

- Dana wants a draft project brief before the next steering discussion so the team can align on goals, scope, and unresolved decisions.
- Priya said the product work is feasible only if the first version stays lightweight and uses existing components.
- Theo said engineering capacity is limited during June because of an integration reliability project. Instrumentation should be scoped tightly.
- Sam recommended tracking at least these pilot measures:
  - Time to first value
  - Setup checklist completion
  - First-14-day Support contact rate
  - Customer-reported clarity after kickoff or first login
- Eli said Support can review three to five help center articles, but cannot refresh the entire onboarding library before pilot.
- Marcus wants the pilot cohort to include both self-serve and mid-market customers, but Priya suggested starting with self-serve only to reduce variables.
- Anika said the project brief should mark the pilot cohort as an open decision until Dana confirms.

### Decisions Or Working Agreements

- The first project brief should be a draft for review, not a final plan.
- The pilot should be limited to a defined cohort and should not be rolled out to all new customers at once.
- The team should not publish, send, or announce the refreshed onboarding until Support content, product copy, and instrumentation are reviewed.

### Risks

- The team may over-scope the refresh if it tries to fix every onboarding issue at once.
- Analytics gaps could make it hard to prove whether the refresh improved activation.
- Help center content may lag behind email and product copy.
- Sales may continue to set expectations that the new process is more hands-on than the team can support.
- Customers with complex data imports may still need human support even after self-serve guidance improves.
- Conflicting pilot dates and unclear ownership could slow decision-making.

### Open Questions

- Who is the final accountable project owner?
- What is the confirmed pilot cohort?
- What is the confirmed pilot start date?
- Which first-value metric will the team use for success reporting?
- Who approves customer-facing copy before launch?
- Which help center articles are must-update before pilot?

## Cross-Meeting Themes To Carry Into The Brief

- The refresh is meant to make the first 30 days clearer, faster, and easier to review.
- The team has enough context to draft goals and scope, but not enough to finalize owners, dates, pilot cohort, or exact success metrics.
- The strongest scope is a coordinated refresh across email, in-product checklist guidance, CSM kickoff materials, and a small set of help articles.
- The brief should preserve human-review checkpoints for unsupported owners, conflicting dates, customer-facing claims, and any external action such as sending, publishing, scheduling, or announcing.
