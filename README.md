# PDFForge - Advanced PDF Text Editor

## Overview

**Live Demo:** [https://pdfeditor-three-beta.vercel.app/](https://pdfeditor-three-beta.vercel.app/) *(Note: Backend processing is disabled in the public demo to prevent unauthorized server load, but the full React/Next.js interactive UI is live.)*

PDFForge is a highly performant, browser-based PDF text editing application. It bridges the gap between lightweight web UI and heavy-duty PDF vector manipulation by decoupling the visual editing experience (Next.js) from the actual document mutation engine (FastAPI + PyMuPDF). 

The platform allows users to click, edit, and restyle existing PDF text with pixel-perfect visual fidelity, preserving original font weights and precise optical alignments that rival desktop-class applications like Adobe Acrobat.

## Architecture Stack

### Frontend (Next.js 14 / React 19)
- **Framework:** Next.js (App Router) + Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **PDF Rendering Engine:** `pdfjs-dist` & `react-pdf`
- **Client-State:** Custom React Hooks for Global Undo/Redo History Stacks

### Backend (Python / FastAPI)
- **Framework:** FastAPI
- **PDF Mutation Engine:** PyMuPDF (`fitz`)
- **API:** RESTful endpoints handling heavy binary payloads

## Key Technical Achievements

1. **Intelligent Typography & Style Preservation**
   - Implemented a custom PDF text extractor (`pdfTextExtractor.ts`) that deeply traverses the PDF.js internal style dictionaries.
   - Detects hidden font weights, italic flags, and specific glyph mappings to dynamically recreate the text's exact appearance in a live HTML overlay.
   - Preserves original formatting (e.g., `helvB` vs `helv`) natively in the backend during text replacement.

2. **True Vector Redaction (No Ghosting)**
   - Abandoned naive text-overlay methods. The FastAPI backend employs strict geometrical bounding-box redaction to completely erase underlying text streams and embedded fonts from the PDF structure before inserting new text, preventing visual ghosting and rendering artifacts.

3. **Pixel-Perfect Optical Alignment**
   - Developed a custom layout engine for HTML overlays to ensure that user-typed text perfectly aligns with the exact baselines of the PDF vectors.
   - Features custom "Fake Bold" double-drawing techniques on the backend to ensure visual thickness consistency across different PDF viewers (Apple Preview, Chrome, Acrobat).

4. **Robust Global History Engine**
   - Engineered a custom `useRef`-based multi-step Undo/Redo stack that tracks complex state mutations (text edits, font changes, positional shifts).
   - Hooked into native `Ctrl+Z` / `Cmd+Z` keyboard listeners, carefully isolated to prevent interference with native browser input fields.

## Project Structure Overview

```text
|-- backend/
|   \-- main.py                 # FastAPI server & PyMuPDF engine
|-- src/
|   |-- app/
|   |   |-- page.tsx            # Main Application Route
|   |   \-- layout.tsx          # Next.js Root Layout
|   |-- components/
|   |   |-- PDFViewer.tsx       # Core PDF.js Rendering Container
|   |   |-- TextEditLayer.tsx   # Live HTML Input Overlay Engine
|   |   |-- ThumbnailSidebar.tsx# Page Navigation & Ordering
|   |   \-- ...
|   |-- hooks/
|   |   \-- usePDFEditor.ts     # Core State & History Manager
|   \-- lib/
|       |-- pdfTextExtractor.ts # PDF.js Internal Styling Traverser
|       \-- pdfModifier.ts      # Client-side helpers for Backend API
|-- package.json                # Frontend Dependencies
\-- tsconfig.json               # TypeScript Configuration
```

## Security
This platform handles sensitive document uploads. The architecture is designed to stream binary data entirely in memory. The backend processes the PDF buffer and immediately streams it back to the client, ensuring zero physical disk persistence of user documents on the server.
