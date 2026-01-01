# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AppNihongo is a static flashcard web application for learning Japanese and TOEIC vocabulary. It displays vocabulary words as interactive flip cards that show the term on the front and meaning on the back.

## Tech Stack

- Vanilla HTML/CSS/JavaScript (ES6 modules)
- Bootstrap 5.0.2 (CDN)
- No build system or package manager

## Running the Application

Open any HTML file directly in a browser, or use a local HTTP server (required for ES6 module imports):
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Architecture

**Entry Points**: Each vocabulary category has its own HTML page (toeic.html, toeicv1.html, hiragana.html, kanji.html, etc.) that all share the same structure.

**Core JavaScript Flow**:
1. `handleShowCards.js` - Main controller that determines which vocabulary list to load based on the current URL, then renders randomized flashcards
2. `flipCard.js` - Handles card flip animation when clicked
3. Vocabulary data files (`toeic.js`, `toeicv1.js`, `hiragana.js`, etc.) - Export arrays of `{tv, mean}` objects where `tv` is the term and `mean` is the meaning

**Data Format**: All vocabulary files export arrays in this format:
```javascript
export default [
    {tv: "word/phrase", mean: "definition"},
    // ...
]
```

**Styling**: `styles.css` contains all styles including the flashcard layout (grid-based), flip states, and pink/cherry blossom theme.
