# Agents

## Documentation Integration Workflow

### Scope Authority

The user's request is the authority for what the run is allowed to accomplish.

Repository context may be read to understand the request. Reading a file does not make that file part of the task.

Do not convert discovered repository problems into work unless fixing that exact problem is directly required for the requested outcome.

### Configuration

Don't forget to update the version and specification (if applicable) in any configuration file or within a document that includes a configuration section. Do this only if that file has been modified (or, in the case of a specific document, if the file or files referenced by that configuration have been modified).

About version jumps: Evaluate if the changes made represent a major, minor, or patch version change. Basically avoid big jumps unless they are logical and valid, and it makes sense to jump more than one version.

### Antigravity agent

When this workflow is run in Antigravity, use the project agents declared in `.agents/agents/`:

- `analyst`: read-only scope analysis and `IntegrationPlan` production;
- `editor`: one invocation per approved writable target;
- `auditor`: read-only candidate and scope audit.

### Codex agent mapping

When this workflow is run in Codex, use the project agents declared in `.codex/agents/`:

- `analyst`: read-only scope analysis and `IntegrationPlan` production;
- `editor`: one invocation per approved writable target;
- `auditor`: read-only candidate and scope audit.

## UI Specification Architecture

The UI Specification Architecture is a set of principles and practices for producing a UI specification. Follow the principles and practices described in [ui-spec-arch.md](docs/ui-spec-arch.md) to produce a UI specification that is consistent, complete, and maintainable.

## Rules

- Don't create branches with prefixes like 'claude/' 'codex/' 'antigravity/' 'cursor/' or similar. The branch name should be descriptive of the changes made and should follow the format 'feature/descriptive-name' or 'fix/descriptive-name'.
- Don't create PRs or issues with titles like 'feat:' or 'fix:' or similar. The title should be descriptive of the changes made and should follow the format 'Feature: descriptive-name' or 'Fix: descriptive-name'.
- If you are working on a issue, don't forget to link it to the PR.
