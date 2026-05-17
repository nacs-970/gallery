# Image Expansion and Featured Layout Refinement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full-screen image expansion to the All tab and refactor the Featured tab to show original image ratios with captions below the image.

**Architecture:** 
- Add local state to `GridView` for the expanded image.
- Refactor `FeaturedView` JSX and CSS to flow captions below the image naturally.
- Update CSS to handle full-screen overlay and responsive image sizing.

**Tech Stack:** React, Vanilla CSS.

---

### Task 1: Add Image Expansion to GridView

**Files:**
- Modify: `src/components/GridView.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Add state for expanded image**
Modify `src/components/GridView.tsx` to add `expandedImage` state (string | null).

- [ ] **Step 2: Add click handlers to thumbnails**
Wrap the `grid-image-container` or the `img` in a clickable div that sets the `expandedImage` to `image.path`.

- [ ] **Step 3: Implement Lightbox Overlay**
Add a conditional rendering block at the end of the `GridView` component to show the full-screen overlay when `expandedImage` is present. Include a close button or click-to-close on the background.

```tsx
{expandedImage && (
  <div className="lightbox-overlay" onClick={() => setExpandedImage(null)}>
    <div className="lightbox-content">
      <img src={expandedImage} alt="Expanded" />
      <button className="lightbox-close">&times;</button>
    </div>
  </div>
)}
```

- [ ] **Step 4: Style the Lightbox**
Add `.lightbox-overlay` and related styles to `src/App.css`.

```css
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: zoom-out;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-content img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: -40px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}
```

- [ ] **Step 5: Commit changes**
`git add src/components/GridView.tsx src/App.css && git commit -m "feat: add full-screen image expansion to grid view"`

---

### Task 2: Refine Featured View Layout

**Files:**
- Modify: `src/components/FeaturedView.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Move Caption below Image**
In `src/components/FeaturedView.tsx`, move the `featured-caption` div after the `img` tag (outside the `featured-image-wrapper` or inside but after the img).

- [ ] **Step 2: Update Featured CSS for Original Ratio**
Modify `src/App.css` to allow the image to define the wrapper size and move the caption to a relative position.

```css
.featured-image-wrapper {
  max-width: 85vw;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.featured-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.featured-caption {
  position: relative; /* Change from absolute */
  bottom: auto;
  margin-top: 24px;
  width: 100%;
  text-align: center;
}
```

- [ ] **Step 3: Remove crop constraints if any**
Ensure no hardcoded `aspect-ratio` or `overflow: hidden` is forcing crops on the featured images.

- [ ] **Step 4: Commit changes**
`git add src/components/FeaturedView.tsx src/App.css && git commit -m "feat: refactor featured view to show original ratio and move caption under image"`
