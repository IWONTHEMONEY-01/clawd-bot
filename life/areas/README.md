# Knowledge Graph - Layer 1

This is the entity-based knowledge graph. Each entity (person, company, project) gets its own folder with:

- `summary.md` - Living summary, rewritten weekly from active facts
- `items.json` - Atomic facts with timestamps and status

## Structure

```
/life/areas/
├── people/           # Person entities
│   └── {name}/
│       ├── summary.md
│       └── items.json
├── companies/        # Company entities
│   └── {name}/
│       ├── summary.md
│       └── items.json
└── projects/         # Project entities
    └── {name}/
        ├── summary.md
        └── items.json
```

## Fact Schema (items.json)

```json
{
  "facts": [
    {
      "id": "entity-001",
      "fact": "The actual fact",
      "category": "relationship|milestone|status|preference",
      "timestamp": "YYYY-MM-DD",
      "source": "conversation",
      "status": "active|superseded",
      "supersededBy": null
    }
  ],
  "lastUpdated": "2026-01-27T00:00:00Z"
}
```

## Rules

1. **Save facts immediately** - Don't wait, add to items.json as discovered
2. **Never delete** - Mark as `superseded` instead, link to new fact
3. **Weekly synthesis** - Rewrite summary.md from active facts every Sunday
4. **Tiered retrieval** - Load summary.md first, items.json only if needed
