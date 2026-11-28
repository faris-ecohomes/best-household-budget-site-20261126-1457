// Hearth — hand-in program for the household budget site (Node 22,
// standard library only).
//
// The site itself is plain static files in app/ (index.html, style.css and
// the scripts, no build step, nothing loaded over the network). This
// program hands it in: it copies app/ and screenshots/ from beside this
// file into the output directory and writes dossier.json there, the
// summary the judge reads — the screenshots, the first load's files and
// bytes, and the site's source — built by the kit's vendored library.
//
// vendor/makefun-frontend.ts is the kit's copy, unchanged: the scorer
// rebuilds the dossier with its own copy and compares byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

const shotsDir = join(outputDir, 'screenshots');
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), shotsDir, { recursive: true });
}

// The caps match the sealed scorer's limits: at most 4 screenshots of at
// most 256 KiB, app/ at most 993 files and directories and 16 MiB, and the
// dossier text capped at 160 KiB.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
