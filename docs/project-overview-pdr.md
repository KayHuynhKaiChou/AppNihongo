# Project Overview and PDR

## Overview

AppNihongo is a static flashcard app for learning Japanese and TOEIC vocabulary. The current user-facing flow shows shuffled flashcards with search and flip behavior, and every card can open a sentence-example modal.

## Product Requirements

| Requirement | Current behavior |
|---|---|
| Flashcards | Render vocabulary as interactive cards with front/back text. |
| Search | Filter cards by term without changing the page structure. |
| Sentence examples | Each card has a separate button that opens a modal for that term. |
| Example count | The modal requests exactly 10 example sentences. |
| Languages | Hiragana/Kanji pages generate Japanese example sentences; TOEIC pages generate English example sentences. |
| Translation | Each example includes a Vietnamese translation. |
| Error handling | Loading, retry, empty-result, close, backdrop, and Escape-key states remain available. |
| Caching | Results are cached in memory per term for the current page session only. |
| Persistence | No sentence results are saved to storage or backend. |

## Architecture Notes

- The shared card controller now owns modal creation, sentence loading, and cache state for all vocabulary pages.
- Sentence generation is delegated to a browser-side Gemini request service.
- The modal is display-only and does not interfere with card flip handling or search filtering.
- The feature depends on network access to the Gemini API at runtime.

## Maintenance Notes

- Keep this file in sync with user-visible flashcard behavior.
- Update it when card interactions, modal behavior, example generation, or persistence rules change.
