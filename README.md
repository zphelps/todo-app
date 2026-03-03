# ✅ Todo App

A clean, modern, and fully-featured Todo List web application built with React, TypeScript, Vite, and Tailwind CSS. Todos persist across page refreshes via localStorage — no backend required.

---

## Features

- ➕ **Add todos** — type and press Enter
- ✅ **Complete todos** — click the circular checkbox to toggle
- ✏️ **Edit todos** — double-click any todo to edit inline; press Enter or blur to save, Escape to cancel
- 🗑️ **Delete todos** — hover to reveal the ✕ button
- 🔍 **Filter** — All / Active / Completed tabs
- 🧮 **Item counter** — shows how many active items remain
- 🧹 **Clear completed** — one-click bulk removal of done items
- 💾 **Persistent** — all data saved to localStorage
- 📱 **Responsive** — works on mobile and desktop

---

## Screenshot

> _Add a screenshot here after running the app_

---

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Framework | React 18 + TypeScript             |
| Build     | Vite 5                            |
| Styling   | Tailwind CSS 3                    |
| Storage   | Browser localStorage              |

---

## Project Structure

```
src/
├── App.tsx              # Root component, holds filter state
├── main.tsx             # Entry point
├── index.css            # Tailwind directives + global styles
├── components/
│   ├── TodoInput.tsx    # Input bar for adding new todos
│   ├── TodoItem.tsx     # Individual todo row with edit/delete
│   ├── TodoList.tsx     # Filtered list renderer + empty state
│   └── TodoFilter.tsx   # Footer: count, filter tabs, clear button
├── hooks/
│   └── useTodos.ts      # All todo logic + localStorage sync
└── types/
    └── todo.ts          # TypeScript interfaces
```
