# How to create Technical Documents from PRDs

## Step 1 — Read the whole PRD before writing a single task

Read description, goal, every requirement, and *out of scope* first. The out-of-scope section is as important as the requirements: it tells you what *not* to accidentally build a task for.

## Step 2 — List every Requirement ID in a column, empty, before filling anything in

Base yourself against [Template - Technical Implementation Plan.](https://gateway.tail9a6ddb.ts.net/bookstack/books/tech-leads/page/template-technical-implementation-plan "Template - Technical Implementation Plan") This is your coverage checklist. If you finish the table and a Requirement ID row is still empty, that's the first thing to fix; not a detail to clean up later.

## Step 3 — For each requirement, ask three questions in order

1. **Who owns this?** Use the container diagram we did on class. Some requirements belong entirely to one team. Others don't; a requirement like *"search results show the venue name"* touches Search's container and reads data EventManagement or VenueManagement owns. When a requirement crosses teams, **each team gets its own task**, not one shared task with two names on it.
2. **What layers does it need?** Most requirements need at least a backend piece (an endpoint, validation, a stored record) and a frontend piece (a form, a results view). Write these as separate tasks. If a requirement is API-only (like PA-01, the invitation endpoint with no screen), say so one task, not two.
3. **What does "done" mean for this task alone?** Not the whole requirement just this task. If you can't finish that sentence, the task is either too big or too vague. Split it or rewrite it.

## Step 4 — Now do the pass nobody enjoys: foundational tasks

Before Step 3's tasks can start, each team needs its own setup work. Ask, per team:  
*what has to exist before anyone can write the first feature line of code?* Typically:

- Repository created, initial commit, branch strategy agreed
- Language/framework chosen and justified
- Project skeleton / boilerplate running locally
- Base project structure for your chosen internal architecture (MVC, Clean, etc.)
- A way to run and see the thing work

These get their own Task IDs, grouped under a placeholder like `SETUP` instead of a Requirement ID they don't come from an acceptance criterion, they come from the fact that code needs somewhere to live.

## Step 5 — Order matters even without a dependency column

The table doesn't have a "depends on" column, so express ordering by **grouping**: put `SETUP` tasks first, then requirement tasks in the order a team would actually tackle them. If one task genuinely blocks another across teams (e.g., Auth's JWT verification approach has to be agreed before VenueManagement can write its own verification task), say so in the **Description** field one sentence: *"Blocked until Auth \[TASK ID\] confirms token verification method."* That's enough for a homework-stage plan; a real dependency graph is a later problem.

## Step 6 — Sanity-check against the PRD's acceptance criteria, not just the requirement titles

An acceptance criterion like VE-05 (*"a show can't be registered on a venue that doesn't exist"*) is easy to miss as its own task because it reads like a side effect of VE-04. It isn't. it's validation logic someone has to write and someone else has to test. If an acceptance criterion describes a rejection, an edge case, or a restriction, check it has a task, even if that task is small.

## Common mistakes to flag when reviewing

- **One task per requirement, full stop.** Usually means the split by team/layer was skipped.
- **No `SETUP` tasks at all.** Means the team plans to start writing feature code with no repo, no framework decision, no boilerplate — which is not actually possible, it's just undocumented.
- **A task assigned to the wrong team** because it was written from "who does this feel like" rather than "which container does this logic live in." When in doubt, trace it back to the C4 diagram.
- **Vague descriptions** ("build the backend for venues") that don't tell you which acceptance criteria the task satisfies.