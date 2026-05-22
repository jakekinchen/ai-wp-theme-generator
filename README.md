# AI WordPress Theme Generator

Live: **https://ai-wp-theme-generator.vercel.app**

This app turns a user brief into a constrained `ThemePlan`, compiles that plan into a WordPress block theme, validates the generated files, previews the structure, and downloads an installable zip.

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

The AI never writes WordPress files directly. It returns a constrained `ThemePlan`. The deterministic compiler owns the block markup, `theme.json`, paths, PHP pattern headers, and packaging. Validation runs before zip creation and rejects unsafe or unsupported output.

Pipeline:

1. Normalize and validate user input.
2. Generate a `ThemePlan` with the mock or OpenAI provider.
3. Validate the `ThemePlan` schema and design quality.
4. Compile deterministic WordPress block-theme files.
5. Validate file paths, block markup, pattern references, theme JSON, and security rules.
6. Package the validated files as a zip.
7. Render a structural preview from the same `ThemePlan`.

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
- Design recipes are intentionally small.
- The OpenAI JSON schema is deliberately broad at the API boundary; the local Zod schema is the authority.
- The app returns base64 zip data for MVP simplicity.
