---
name: qmd
description: Local semantic search engine for markdown notes, knowledge bases, and memory files using hybrid BM25 + vector search.
homepage: https://github.com/tobi/qmd
metadata: {"clawdbot":{"emoji":"🔍","requires":{"bins":["qmd"]},"install":[{"id":"bun","kind":"node","package":"qmd","bins":["qmd"],"label":"Install qmd (bun)","packageManager":"bun"}]}}
---

# QMD - Quick Markdown Search

Local, on-device search engine for markdown documents with hybrid semantic + keyword search.

## What It Does

- **BM25 full-text search** via SQLite FTS5
- **Vector semantic search** for meaning-based queries
- **Hybrid mode** combines both with LLM re-ranking
- **MCP server** for AI agent integration

## Quick Start

```bash
# Create a collection for your workspace memories
qmd collection add memories ~/clawd/agents/main/memory "**/*.md"

# Index the collection
qmd index memories

# Search (keyword)
qmd search memories "API design discussion"

# Search (semantic - requires embedding model)
qmd search memories "what decisions did we make about authentication" --mode hybrid
```

## Collections

Manage multiple document collections:

```bash
# Add collection with glob pattern
qmd collection add <name> <path> "<glob>"

# List collections
qmd collection list

# Remove collection
qmd collection remove <name>

# Re-index after changes
qmd index <name>
```

## Search Modes

```bash
# Keyword only (fast, exact matches)
qmd search <collection> "query" --mode keyword

# Semantic only (meaning-based)
qmd search <collection> "query" --mode semantic

# Hybrid (best quality, uses LLM re-ranking)
qmd search <collection> "query" --mode hybrid
```

## Output Formats

```bash
qmd search memories "query" --format json    # JSON output
qmd search memories "query" --format csv     # CSV output
qmd search memories "query" --format md      # Markdown
qmd search memories "query" --format xml     # XML (for agents)
```

## MCP Server

Start as MCP server for AI agent integration:

```bash
qmd mcp
```

Configure in Claude Code or other MCP clients.

## Suggested Collections for Clawd

```bash
# Session memories (from session-memory hook)
qmd collection add memories ~/clawd/agents/main/memory "**/*.md"

# Obsidian vault
qmd collection add obsidian ~/Documents/Obsidian "**/*.md"

# Meeting notes
qmd collection add meetings ~/Documents/meetings "**/*.md"

# All markdown docs
qmd collection add docs ~/Documents "**/*.md"
```

## Requirements

- **Runtime**: Bun (installs automatically with package)
- **Embedding model**: Optional, for semantic search. QMD downloads a default GGUF model on first semantic query.

## Tips

- Use `--threshold 0.5` to filter low-confidence results
- Use `--limit 10` to cap result count
- Re-index collections after adding new documents
- Hybrid mode is slower but highest quality for complex queries
