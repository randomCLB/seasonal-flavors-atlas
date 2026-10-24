# Catalog quality · 2026-10-24

Base: 060d9315d343dfae6acb420b647397078121ab0e. Scope: seasonal duplication, homepage visibility, ingredient photographs and useful detail density.

## Browsing

- Keep all 354 source records and their original IDs, dates, sources, safety fields and draw fingerprints.
- Group related Taiwan billfish, seerfish and sea bream as browsing families. This is editorial grouping, not a claim that the fish are one biological species.
- Show one representative per family in a solar term. Link the other regional records and their dates in the detail page. The map popup also groups related entries and expands their individual records.
- Keep roe separate from whole fish and flowers separate from nuts. Existing unresolved-identity holds remain excluded from recommendations.
- Missing photographs no longer exclude a sourced food from the homepage. Text covers open the same complete detail view. Add All in season and Full-year directory beside Curated picks.

## Photographs

Baseline: 136 entries had no usable cover. New local licensed photographs and reviewed existing assets reduce the gap to 33; 103 previously unpictured entries gain covers. Some existing pictures are also corrected, including Xiantao lychee that was matched as peach.

47 repository-local WebP files are declared in CATALOG_PHOTOS_20261024.json, with original page, author, license and exact SHA-256. Reviewed originals were checked against the pinned hashes before conversion. Original and derivative hashes are both retained. The build verifies repository-local files and never downloads photos. Visitors load the images from the site itself. Generic species/family photographs remain labeled as references. Unidentified plants or fish are left without photographs rather than borrowing misleading images.

## Detail density

reader-depth.js explicitly rewrites 58 records and restores an allow-list of existing informative fields. This includes earlier practical examples and the latest 20 catalog additions. Preserve useful selection checks, edible parts, preparation order, doneness and storage. Keep empty fields hidden and avoid repeating research narration. Buying and cooking sections are open initially. Safety and canonical sources remain intact.

## Build and checks

Run `node scripts/prepare-reader-release.cjs` before preview, tests or publishing. It invokes the idempotent catalog integration and repository-local photo verifier. Do not publish unprepared dist files.

Run `node --test tests/*.test.cjs`, `node scripts/audit-tarot-pool.cjs 2027`, and compare docs/TAROT_POOL_COVERAGE_2027.json. catalog-quality.test.cjs checks families, no-photo visibility, canonical data preservation, credits and practical reader detail. The reader browser workflow checks desktop and narrow screens, the complete directory, all-season mode and real served resources after publishing.

Version: 2026.10.24-depth.1. Remaining photo gaps are listed by scripts/audit-catalog-quality.cjs and retained in the review artifact. Do not report all photographs as filled.
