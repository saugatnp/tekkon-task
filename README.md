# Tekkon task

A simple Angular app that generates a reactive form from JSON and keeps them in sync.

## How to Run

```bash
npm install
npm start
```

Then open http://localhost:4200

## What It Does

**Core features:**
- Dynamically builds a reactive form from the provided JSON schema
- Edit the form and the JSON updates instantly
- Paste new JSON and the form updates automatically
- Add/remove tags and members
- Validation:
  - `name` is required (min 3 chars)
  - `theme` must be "light", "dark", or "system"
  - `refreshInterval` must be positive

**Bonus features I added:**
- TypeScript types for the schema
- Material UI dropdowns for theme/role selection
- Toggle switch for notifications
- LocalStorage persistence (survives page refresh)
- Real-time JSON validation with error messages
- The form builder is generic enough to work with other schemas

## Sample JSON

```json
{
  "name": "Crewmojo Demo",
  "description": "Testing reactive form coding task",
  "tags": ["angular", "forms", "json"],
  "settings": {
    "notifications": true,
    "theme": "dark",
    "refreshInterval": 30
  },
  "members": [
    { "id": 1, "name": "Alice", "role": "Admin" },
    { "id": 2, "name": "Bob", "role": "User" }
  ]
}
```

## Design Decisions

I went with Angular 20's new signals API for state management - it's cleaner than observables for this use case. All components are standalone following current best practices.

For the bi-directional sync:
- Form to JSON: Used an `effect()` that watches form changes
- JSON to Form: Parse the JSON and rebuild the form when valid

I created custom validators (`positiveNumber`, `allowedValues`) that can be reused. The form builder service is separate so it could handle different schemas if needed.

## What I'd Improve

With more time I'd add:
- Support for truly dynamic schemas (not just the hardcoded one)
- Unit tests for the validators and form service
- Better error messages
- Import/export JSON files
- Maybe an undo/redo feature
- Detailed Comments
