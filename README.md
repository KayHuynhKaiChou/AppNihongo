# AppNihongo

## Vercel sentence API

The static GitHub Pages frontend calls `api/generate-sentences.js`, deployed as a Vercel Function. Configure these Vercel project environment variables before deploying:

```text
GEMINI_API_KEY=<your-key>
GEMINI_MODEL=gemini-2.5-flash
```

The frontend expects the production function at `https://app-nihongo.vercel.app/api/generate-sentences`. If Vercel assigns a different project URL, update `VERCEL_PROJECT_ORIGIN` in `js/api-config.js`.
