# Simon Kane Portfolio

A complete portfolio website built as a playful retro Windows-style desktop. It starts in a nostalgic Windows 95/98/XP-inspired OS, includes clickable desktop icons, reusable windows, taskbar/start menu behavior, a command terminal, and two alternate presentation modes: a polished modern 3D portfolio and an intentionally ugly/funny portfolio.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Global CSS
- Optional Vercel Analytics and Microsoft Clarity tracking

## Run locally

```bash
npm install
npm run dev
npm run build
```

Open `http://localhost:3000` after `npm run dev`.

## Analytics

Vercel Analytics is enabled globally through the app layout.

Microsoft Clarity is also wired globally, but only loads when this environment variable is set:

```bash
NEXT_PUBLIC_CLARITY_PROJECT_ID=your-clarity-project-id
```

Add it in Vercel under Project Settings -> Environment Variables, or copy `.env.example` to `.env.local` for local testing.

## Editing portfolio content

All placeholder content lives in `src/data/portfolio.ts`.

Update this file to replace:

- Name and title
- Short bio
- Contact links
- CV metadata and experience
- Projects
- Project descriptions
- Screenshot paths
- Deployed URLs
- Source code URLs
- Skills/tools

## Adding projects

Add a new object to the `projects` array in `src/data/portfolio.ts` with:

- `id`
- `name`
- `tagline`
- `description`
- `stack`
- `screenshots`
- `liveUrl`
- `sourceUrl`

The retro Projects window automatically renders each project as a folder. Opening a project folder shows README-style text, screenshot references, a live project shortcut, and source shortcut.

## Adding screenshots

Place image files in `public/screenshots` and update each project's `screenshots` array in `src/data/portfolio.ts` with paths such as:

```ts
screenshots: ["/screenshots/my-project.png"]
```

The current version uses placeholder screenshot paths so the data is easy to replace later.

## Replacing the CV

Place the real CV file in `public/cv`, then update the `cv` object in `src/data/portfolio.ts` with the real file name, updated date, and summary. Until then, the CV window intentionally displays lorem ipsum/mock metadata.

## Terminal commands

Open the Terminal icon and type:

- `help` — lists commands
- `dir` — lists folders/files
- `open projects` — opens Projects
- `open cv` — opens CV
- `open about` — opens About
- `3d:ify` — switches to the modern premium 3D portfolio
- `uglify` — switches to the chaotic ugly portfolio
- `retro` — returns to retro desktop mode
- `clear` — clears terminal output

## UI/UX skill note

The requested `nextlevelbuilder/ui-ux-pro-max-skill` workflow was installed with `npx uipro-cli init --ai codex` into `.codex/skills/ui-ux-pro-max/`. The refactor followed the installed `SKILL.md` workflow by generating a portfolio design-system recommendation, checking detailed style/UX/web/React guidance, and applying motion-driven Vista/Aero dimensional layering with visible focus states, semantic controls, responsive layouts, reduced-motion handling, and non-emoji SVG interface icons.

## Assumptions

- This is a first complete portfolio shell with placeholder data.
- Real project screenshots and CV files will be added later by replacing central data and files in `public`.
- Window dragging is approximated with movable-looking, focusable windows and z-index behavior; full drag physics can be a future improvement.
