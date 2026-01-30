---
name: ralph-loop
description: Start an autonomous Ralph Wiggum loop that iterates until completion. Use when starting autonomous builds or when asked to "run ralph" or "start the loop".
---

# Ralph Loop - Autonomous Build Iteration

Start an autonomous loop that continues working until a task is complete or max iterations is reached.

## Starting a Ralph Loop

To start a loop, create a state file and work iteratively:

### 1. Create Ralph State File

Create `.claude/ralph-loop.local.md` with this format:

```markdown
---
iteration: 0
max_iterations: 50
completion_promise: "COMPLETE"
---

[Your task/prompt here - this gets fed back each iteration]

Work through the prd.json stories. For each story:
1. Read the story requirements
2. Implement the changes
3. Run typecheck and tests
4. If passing, mark story as passes: true in prd.json
5. Commit changes
6. Move to next story

When ALL stories in prd.json have passes: true, output:
<promise>COMPLETE</promise>
```

### 2. Loop Behavior

The Stop hook will:
- Check for `.claude/ralph-loop.local.md`
- If found, block exit and feed the prompt back
- Increment iteration counter
- Continue until completion promise or max iterations

### 3. Monitoring Progress

Watch the loop progress:
```powershell
# Windows PowerShell - watch iteration count
Get-Content ".claude\ralph-loop.local.md" | Select-String "iteration:"

# Check prd.json progress
Get-Content prd.json | ConvertFrom-Json | Select-Object -ExpandProperty userStories |
  Group-Object passes | Select-Object Name, Count
```

### 4. Canceling the Loop

To stop the loop early:
```bash
rm .claude/ralph-loop.local.md
```

Or just delete the state file manually.

## Completion Promise

Output `<promise>COMPLETE</promise>` ONLY when:
- All tasks are genuinely finished
- All tests pass
- All stories marked as complete

**Never lie to exit** - the loop exists to ensure thorough completion.

## Example: Building from prd.json

```markdown
---
iteration: 0
max_iterations: 100
completion_promise: "ALL_STORIES_DONE"
---

Build the project according to prd.json.

For each story with passes: false:
1. Read the story and acceptance criteria
2. Implement the required changes
3. Run: npm run typecheck && npm test
4. If all pass, update prd.json: set passes: true for this story
5. Git commit with story ID in message
6. Move to next story

Security: Run semgrep and gitleaks before each commit.

When every story has passes: true, output:
<promise>ALL_STORIES_DONE</promise>
```
