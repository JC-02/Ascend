# Components Directory

This directory contains all React components for the Ascend AI frontend application.

## Structure

```
components/
├── ui/              # shadcn/ui base components (Button, Card, Input, etc.)
├── features/        # Feature-specific components organized by domain
│   ├── upload/      # Resume upload components
│   ├── session/     # Interview session components
│   └── recording/   # Recording interface components
└── layout/          # Layout components (Header, Footer, Sidebar)
```

## Guidelines

1. **Always use shadcn/ui components** from `/ui` directory for base UI elements
2. **Feature components** should be composed from shadcn/ui components
3. **Follow naming convention**: `ComponentName.tsx` (PascalCase)
4. **Export from index.ts** in each feature directory
5. **Include tests** for all components (`ComponentName.test.tsx`)

## Adding shadcn/ui Components

To add a new shadcn/ui component:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
# etc.
```

Components will be automatically added to `/components/ui/`.
