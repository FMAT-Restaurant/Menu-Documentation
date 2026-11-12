# Claude Code

Project rules live in [AGENTS.md](AGENTS.md); they apply here in full. This file only adds the Claude Code mapping of the Documentation Integration Workflow.

## Claude Code agent mapping

When this workflow is run in Claude Code, use the project subagents declared in `.claude/agents/`:

- `analyst`: read-only scope analysis and `IntegrationPlan` production;
- `editor`: one invocation per approved writable target;
- `auditor`: read-only candidate and scope audit.

They share the workflow state and schemas under `.agents/agents/<agent>/current/` and `.agents/agents/<agent>/resources/`.

## Orchestration (main session)

The main session is the orchestrator; it does not edit target files itself.

1. Record pre-existing uncommitted changes (`git status --short`) so the audit can ignore them.
2. Invoke `analyst` with the user's request verbatim. Clear `.agents/agents/editor/current/editor-feedback.md` at the start of a new request.
3. If the plan has `blockers`, stop and ask the user to decide. Do not resolve semantic decisions on your own.
4. Invoke `editor` once per CREATE/MODIFY/DELETE entry of `plan.json`, naming that single target; tell it whether it is the first target of the round. Independent targets may run in parallel; if any editor returns BLOCKED, go back to step 2 (re-analysis) with the feedback.
5. Invoke `auditor`, passing the list of pre-existing changes from step 1.
6. On FAIL (`REANALYZE`), invoke `analyst` again (it reads the audit report and editor feedback) and repeat from step 3. Stop after 3 failed rounds and report to the user.
7. On PASS, report to the user the changed files and the audit verdict. Commit only if the user asks.
