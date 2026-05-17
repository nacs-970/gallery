# Featured Swipe Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the "Featured" tab to display only one image at a time with horizontal swipe/drag and edge-click navigation.

**Architecture:** Update `FeaturedView.tsx` to include state for the current image index and navigation controls. Use CSS for a clean single-image layout with smooth transitions.

**Tech Stack:** React, Pretext, Vanilla CSS.

---

### Task 1: Update FeaturedView Logic

**Files:**
- Modify: `src/components/FeaturedView.tsx`

- [ ] **Step 1: Add state for current index**
Import `useState` and manage `currentIndex`.

```tsx
const [currentIndex, setCurrentIndex] = useState(0);

const nextImage = () => {
  setCurrentIndex((prev) => (prev + 1) % displayImages.length);
};

const prevImage = () => {
  setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
};
```

- [ ] **Step 2: Update render to show single image**
Modify the JSX to show only the image at `displayImages[currentIndex]`. 

- [ ] **Step 3: Commit logic changes**
```bash
git add src/components/FeaturedView.tsx
git commit -m "feat: refactor featured view logic for single-image display"
```

---

### Task 2: Update FeaturedView Styling

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Style the Carousel container**
Update `.featured-view` to center the single item. Add styles for navigation overlays (invisible clickable zones on the left/right edges).

```css
.featured-view {
  position: relative;
  height: calc(100vh - 100px); /* Account for header */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
}

.featured-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Invisible hitboxes for edge clicks */
.nav-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 15%; /* 15% width on each side */
  z-index: 20;
  cursor: pointer;
}
.nav-edge.prev { left: 0; }
.nav-edge.next { right: 0; }
```

- [ ] **Step 2: Commit styling**
```bash
git add src/App.css
git commit -m "style: update featured view for carousel layout with edge hitboxes"
```

---

### Task 3: Add Interactivity (Swipe, Drag, Keyboard, Edge Clicks)

**Files:**
- Modify: `src/components/FeaturedView.tsx`

- [ ] **Step 1: Implement Edge Clicks**
Add the `.nav-edge` divs to the JSX and link them to `prevImage` and `nextImage`.

- [ ] **Step 2: Implement Keyboard Support**
Add `useEffect` for `keydown` events (ArrowLeft/ArrowRight).

- [ ] **Step 3: Implement Mouse Drag & Touch Swipe**
Add `onMouseDown`, `onMouseUp`, `onTouchStart`, `onTouchEnd` handlers to calculate swipe/drag direction and trigger navigation.

- [ ] **Step 4: Commit interactivity**
```bash
git add src/components/FeaturedView.tsx
git commit -m "feat: add keyboard, swipe, mouse drag, and edge click support"
```
