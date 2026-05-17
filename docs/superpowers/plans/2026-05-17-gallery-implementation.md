# High-Res Local Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal, elegant, high-res local gallery using React, Pretext, and a static JSON manifest.

**Architecture:** A Vite-based React app that displays images from an `images/` folder via a generated `gallery.json` manifest. Features include Featured/All tabs, uniform thumbnail ratios, metadata editing, and a Dark/Light mode toggle.

**Tech Stack:** React (Vite), Pretext, Vanilla CSS, Node.js (for sync script and local API).

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.css`, `src/index.css`

- [ ] **Step 1: Initialize Vite React project**
Run: `npm create vite@latest . -- --template react-ts`
Follow prompts to install dependencies: `npm install pretext react-router-dom`

- [ ] **Step 2: Basic CSS Reset and Theme Variables**
Set up the CSS variables for Dark (default) and Light modes in `src/index.css`.

```css
:root {
  --bg-color: #000000;
  --text-color: #e0e0e0;
  --font-serif: "Times New Roman", serif;
  --font-sans: "Arial", sans-serif;
}

[data-theme='light'] {
  --bg-color: #ffffff;
  --text-color: #000000;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-sans);
  margin: 0;
  transition: background-color 0.3s, color 0.3s;
}
```

- [ ] **Step 3: Commit scaffolding**
```bash
git add .
git commit -m "chore: initial project scaffolding with vite and theme variables"
```

---

### Task 2: Image Sync Script

**Files:**
- Create: `scripts/sync-images.js`
- Create: `src/data/gallery.json` (placeholder)

- [ ] **Step 1: Create sync script**
Write a Node script that reads the `images/` directory and creates a JSON array of image objects.

```javascript
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../images');
const output = path.join(__dirname, '../src/data/gallery.json');

const files = fs.readdirSync(imagesDir)
  .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

const gallery = files.map(file => ({
  id: file,
  filename: file,
  displayName: file.replace(/\.[^/.]+$/, ""),
  isFeatured: false,
  path: `/images/${file}`
}));

fs.writeFileSync(output, JSON.stringify(gallery, null, 2));
console.log(`Synced ${files.length} images to ${output}`);
```

- [ ] **Step 2: Add sync command to package.json**
Add `"sync": "node scripts/sync-images.js"` to scripts.

- [ ] **Step 3: Run sync and commit**
Run: `npm run sync`
Expected: `src/data/gallery.json` created with image list.
```bash
git add scripts/sync-images.js src/data/gallery.json package.json
git commit -m "feat: add image sync script and manifest"
```

---

### Task 3: Core Layout & Navigation

**Files:**
- Modify: `src/App.tsx`, `src/App.css`

- [ ] **Step 1: Implement Navigation & Theme Toggle**
Create a fixed header with Tabs and a Theme toggle.

```tsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tab, setTab] = useState<'featured' | 'all'>('featured');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <header>
        <nav>
          <button onClick={() => setTab('featured')} className={tab === 'featured' ? 'active' : ''}>Featured</button>
          <button onClick={() => setTab('all')} className={tab === 'all' ? 'active' : ''}>All</button>
        </nav>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>
      <main>
        {/* Gallery Content */}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit layout**
```bash
git add src/App.tsx src/App.css
git commit -m "feat: add navigation and theme toggle"
```

---

### Task 4: All Images Grid

**Files:**
- Create: `src/components/GridView.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Implement Grid View**
Ensure thumbnails have a fixed 4:5 aspect ratio using `aspect-ratio` and `object-fit: cover`.

```tsx
// src/components/GridView.tsx
import galleryData from '../data/gallery.json';

export function GridView() {
  return (
    <div className="grid-container">
      {galleryData.map(img => (
        <div key={img.id} className="grid-item">
          <div className="aspect-ratio-box">
            <img src={img.path} alt={img.displayName} />
          </div>
          <span className="image-label">{img.displayName}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Style the Grid**
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 40px;
}
.aspect-ratio-box {
  aspect-ratio: 4/5;
  overflow: hidden;
  background: #222;
}
.aspect-ratio-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- [ ] **Step 3: Commit grid view**
```bash
git add src/components/GridView.tsx src/App.tsx src/App.css
git commit -m "feat: add grid view with uniform aspect ratios"
```

---

### Task 5: Featured View with Pretext

**Files:**
- Create: `src/components/FeaturedView.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Integrate Pretext**
Use `pretext` for the high-res image labels in the featured view.

- [ ] **Step 2: Implement Featured Layout**
Sparse vertical flow with large images.

- [ ] **Step 3: Commit featured view**
```bash
git add src/components/FeaturedView.tsx
git commit -m "feat: add featured view with pretext typography"
```

---

### Task 6: Metadata Editing (Local API)

**Files:**
- Create: `vite-plugin-gallery-api.ts` (Vite middleware)
- Modify: `vite.config.ts`, `src/components/GridView.tsx`

- [ ] **Step 1: Create Vite API Middleware**
A simple middleware to handle `POST /api/save-name`.

- [ ] **Step 2: Add Inline Editing to UI**
Allow users to click a name and update it, calling the local API.

- [ ] **Step 3: Commit editing feature**
```bash
git add vite-plugin-gallery-api.ts vite.config.ts src/components/GridView.tsx
git commit -m "feat: add metadata editing and persistence API"
```

---

### Task 7: Final Polishing & Verification

- [ ] **Step 1: Check High-Res loading**
Verify images load correctly without jumps.
- [ ] **Step 2: Verify Theme Switcher**
Ensure all colors update correctly in light/dark modes.
- [ ] **Step 3: Final Commit & Cleanup**
```bash
git add .
git commit -m "chore: final polishing and cleanup"
```
