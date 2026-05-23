# AI WordPress Theme Generator

Live: **https://ai-wp-theme-generator.vercel.app**

This app turns a user brief into constrained `ThemePlan` candidates, scores them with a local design critic, compiles the selected plan into a WordPress block theme, validates the generated files, previews the structure, and downloads an installable zip.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, keep the default prompt, and click **Generate theme**.

## Environment

```bash
OPENAI_API_KEY=optional
OPENAI_MODEL=optional
```

Without `OPENAI_API_KEY`, the deterministic mock provider is used. With `OPENAI_API_KEY`, the app uses the OpenAI provider through the same `ThemePlannerProvider` interface.

## Tests

```bash
npm run lint
npm test
npm run build
```

Optional WordPress smoke:

```bash
npm run test:wp
```

The normal test suite does not require Docker. The optional smoke script is intentionally lightweight in this MVP.
It writes a generated fixture theme into `.wp-env/themes/obsidian-lens`, starts `wp-env`, activates the theme through WP-CLI, and verifies the active theme name. It requires Docker and `wp-env` support on the reviewer machine.

## Generated Theme

The zip root is the validated slug, for example `obsidian-lens/`. It includes:

- `style.css`
- `theme.json`
- `templates/index.html`
- `templates/home.html`
- `templates/single.html`
- `templates/page.html`
- `templates/archive.html`
- `templates/search.html`
- `templates/404.html`
- `parts/header.html`
- `parts/footer.html`
- `patterns/hero.php`
- `patterns/split-intro.php`
- `patterns/featured-query.php`
- `patterns/archive-query.php`
- `patterns/post-header.php`
- `patterns/cta-band.php`

Install the downloaded zip in WordPress as a block theme.

## Architecture

The AI never writes WordPress files directly. It returns a constrained `ThemePlan`. The app enriches that with local recipe candidates, scores the candidates for design fit, and compiles the selected plan. The deterministic compiler owns the block markup, `theme.json`, paths, PHP pattern headers, and packaging. Validation runs before zip creation and rejects unsafe or unsupported output.

Pipeline:

1. Normalize and validate user input.
2. Generate a provider-authored `ThemePlan`.
3. Add local brief-match, expressive-alt, and safe-baseline recipe candidates.
4. Score candidates for prompt fit, accessible contrast, section rhythm, content density, recipe alignment, and specificity.
5. Validate the selected `ThemePlan` schema and design quality.
6. Compile deterministic WordPress block-theme files.
7. Validate file paths, block markup, pattern references, theme JSON, and security rules.
8. Package the validated files as a zip.
9. Render a structural preview from the same `ThemePlan`.

## Design Intelligence

Each `ThemePlan` carries explicit `design.intent`: audience, personality, hierarchy, content density, image treatment, rhythm, navigation style, surface language, and a signature move. Local recipes map supported design directions to hero variants, card treatments, spacing, typography, and compiler classes. The API returns a `designSelection` report so reviewers can see which candidate won and why.

## Validation

The validator checks required files, a single safe root folder, valid `style.css` header, valid `theme.json`, allowed core blocks, parseable block markup, no Custom HTML block, no Classic/freeform block, resolved pattern references, no remote scripts or styles, no unsafe paths, and no executable PHP outside controlled pattern headers.

## Deployment

Production runs on Vercel. Git auto-deploys are intentionally disabled in `vercel.json` because Vercel's hosted Next.js 16.2 adapter currently crashes during `modifyConfig`. Deploys instead use the prebuilt artifact path that the local Vercel CLI produces.

GitHub Actions (`.github/workflows/deploy.yml`) runs on every push to `main`:

1. `npm ci && npm run lint && npm test`
2. `vercel pull`
3. `vercel build --prod`
4. `vercel deploy --prebuilt --prod`

Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

To deploy from a workstation:

```bash
npm run deploy:prod
```

## Known Limitations

- The preview is structural React rendering, not a live WordPress instance.
- The optional `wp-env` smoke test requires Docker and was kept out of the normal test path.
- Design recipes are stronger than the first MVP, but still small compared with a mature pattern library.
- The OpenAI JSON schema is generated from the local Zod schema, then transformed for strict Responses API compatibility.
- The app returns base64 zip data for MVP simplicity.
