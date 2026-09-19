# Subagent Task Decomposition & Parallelization Rule

- **Divide Large Work**: Whenever a task spans large surface areas—such as investigating multiple repositories/worktrees, auditing dozens of files, reviewing multiple packages, or running extensive exploratory research—the Lead Orchestrator must divide the work across specialized subagents using `invoke_subagent`.
- **Parallel Fan-Out**: Dispatch independent subagents concurrently (e.g., partitioning N items into parallel batches) to maximize throughput and minimize latency.
- **Synthesize & Persist**:
  - The Lead Orchestrator aggregates findings across all subagent reports.
  - Resolved discrepancies and synthesized results must be persisted into repository documentation (`docs/...`) adhering to the Knowledge Retention rule.
