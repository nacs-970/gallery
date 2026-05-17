# High-Res Local Gallery Design Spec

**Date:** 2026-05-17
**Status:** Approved

## Goal
Build a minimal, clean, and elegant local gallery website to showcase high-resolution images. The focus is on editorial-quality presentation with a "showcase-first" mindset (no login, no complex UI).

## Core Principles
- **Minimalism:** Use whitespace and typography to create an elegant, high-end feel inspired by julianoni.com.
- **Precision:** Utilize `pretext` for pixel-perfect text layout and editorial captions.
- **Performance:** Pre-calculate layouts to avoid jumps (layout shift) when loading high-res assets.

## Tech Stack
- **Frontend:** React (Vite)
- **Layout/Typography:** Pretext
- **Styling:** Vanilla CSS
- **Discovery:** Node.js (Static Manifest script)

## Architecture
### 1. Image Discovery (Static Manifest)
A script `scripts/sync-images.js` will:
- Scan the `images/` directory.
- Extract file names and paths.
- Generate `src/data/gallery.json`.
- (Future-proofing) Allow manual editing of `gallery.json` to add specific captions or mark images as "featured".

### 2. Typography
- **Serif (Headings/Editorial):** `Times New Roman`, serif.
- **Sans-Serif (Labels/Metadata):** `Arial`, sans-serif.
- **Implementation:** Pretext will handle the rendering of key labels and captions to ensure specific `letterSpacing` and `lineHeight` that matches the design inspiration.

## UI & Features
### Navigation
- A minimal fixed header with two primary tabs: **Featured** and **All**.

### Tab 1: Featured
- **Layout:** Sparse, editorial flow. Large images presented with generous whitespace.
- **Captions:** Text positioned precisely relative to images (e.g., small Arial labels near the bottom-right of a Times New Roman heading).
- **Behavior:** Vertical scroll or single-image focus.

### Tab 2: All Images
- **Layout:** Clean grid.
- **Constraint:** All thumbnails must maintain the same aspect ratio (e.g., 4:5) to ensure a uniform and "quiet" visual rhythm.
- **Interaction:** Clicking an image opens a focused view (can reuse the "Featured" style or a simple lightbox).

### Styling Details
- Background: Pure white or slightly off-white (#f9f9f9).
- Text Color: High-contrast black or very dark grey.
- Hover states: Minimal (e.g., slight opacity change or zero change to keep it "static" and elegant).

## Data Flow
1. `npm run sync` scans `images/`.
2. `gallery.json` is updated.
3. React app imports `gallery.json`.
4. `Gallery` component maps through the data.
5. `Pretext` components render the typographic elements.

## Success Criteria
- [ ] Website loads and displays images from `images/` folder automatically after sync.
- [ ] Grid thumbnails are perfectly uniform in size/ratio.
- [ ] Typography matches the "Times New Roman + Arial" requirement.
- [ ] Zero layout shifting during image load.
