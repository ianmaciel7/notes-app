# Prefer Batch Operations Rule

Whenever performing operations that can be parallelized (such as modifying multiple distinct files with `replace_file_content`, dispatching parallel subagent workflows with `invoke_subagent`, or querying multiple resources), AI agents **MUST** batch tool calls into a single invocation turn rather than executing them sequentially across multiple back-and-forth turns.
