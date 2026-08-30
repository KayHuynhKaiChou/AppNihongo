---
title: Card sentence modal
status: completed
priority: P1
effort: small
branch: master
tags: [flashcards, gemini, modal]
created: 2026-08-30
---

# Card sentence modal

Status: complete

Progress: 5/5 acceptance groups verified

## Scope

Add a display-only Gemini sentence modal to every vocabulary card rendered by the shared card controller.

## Requirements

- Every rendered card has a circular icon button positioned at its top-right corner that does not trigger the card flip action.
- Clicking the button immediately opens a modal for that card and requests exactly 10 example sentences.
- Each result shows a sentence in the vocabulary page's language, the matched vocabulary word, and a Vietnamese translation.
- Loading, retryable error, empty-result, close-button, backdrop, and Escape-key states work.
- Generated sentences are cached in memory per vocabulary term for the current page session.
- Search, randomized initial rendering, responsive card layout, and card flipping keep working.
- Results are display-only: no selection, persistence, or save API.

## Implementation

1. Add a Vercel Function that keeps the QuizCard Gemini API key server-side and exposes a restricted sentence endpoint.
2. Add a focused browser service that calls the Vercel endpoint and validates the normalized 10-item response.
3. Extend the shared card renderer with the sentence button, one reusable accessible modal, loading/error/result rendering, and per-term in-memory caching.
4. Add responsive modal/button styles matching the existing pink vocabulary-card theme.
5. Validate JavaScript syntax and manually exercise rendering, flip isolation, modal state transitions, caching, search re-rendering, and mobile layout.

## Files

- Modify: `js/handleShowCards.js`
- Modify: `styles.css`
- Create: `api/generate-sentences.js`
- Create: `js/api-config.js`
- Create: `js/gemini-sentence-service.js`

## Public contracts

- Vocabulary modules remain arrays of `{ tv, mean }`.
- Existing HTML entry points and `flipCard(card, previousCard)` behavior remain unchanged.
- The Gemini key is read only from the Vercel `GEMINI_API_KEY` environment variable and is not shipped to the browser.

## Acceptance

Done when every vocabulary page can open a card-specific modal, successfully render 10 Gemini results without saving them, recover from API errors, and retain all existing card/search behavior.

Verified on 2026-08-30 with JavaScript syntax checks, `git diff --check`, browser click/modal diagnostics, Gemini CORS preflight, and a live Gemini request returning 10 complete results.
