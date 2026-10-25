# Plant-to-plate image standard · 2026-10-24

## 2026-10-25 correction: identity and edible part come first

This amendment takes precedence over the placement rules below. Keep an accepted ingredient cover unless the replacement improves identity, edible-part visibility and composition. A flowering relative, bare vine or distant pond is not an upgrade to a clear bulb, tuber or rhizome photograph. A raw whole ingredient with a small identification cross-section is eligible; a plate of prepared slices alone is not.

The detail overview retains the recognizable ingredient. Place the reviewed cooked dish or fruit interior once inside “家常做法 / 怎么吃”, with its recipe. Source and generated-image captions appear on hover or keyboard focus; alt text remains explicit.

Review actual pixels alongside the named food and source before assigning an image. Species-level evidence does not establish a named edible cultivar: the ordinary Lilium davidii flower was not evidence for Lanzhou Lilium davidii var. unicolor. Reject the cover even when its file is labeled “plant”.

This correction restores five existing covers: fresh spiral stachys tubers, edible lily bulb/scales, Heshui fresh kudzu root, Hanshou lotus root and Huadu lotus root. The new plain steamed-lily recipe image is generated from a real cooking reference and is labeled as an illustration. The reference uses Jiangxi lily and supports cooked-scale shape only; it is not a Lanzhou cultivar photograph and is not redistributed. See EDIBLE_IMAGE_REVIEW_20261025.json for the decisions after viewing all 76 explicit home assignments.

User request: the homepage shows the growing plant or whole identifiable ingredient; the opened detail leads with the prepared dish or fruit cut. Xiaozhou head mustard and Fuling Yuzao 100 must not reuse chopped generic mustard imagery.

## Role and identity

- Separate plant / whole ingredient, dish / fruit-cut, and preparation images. No role may be inferred solely from a filename or from the presence of a nonempty URL.
- A homepage plant image must preserve the identifying edible part, leaves and growth habit. Seafood uses the intact animal or an accurate whole-ingredient view.
- A detail image must match the named food and preparation. Raw slices are preparation images, not cooked dishes. Fruit interiors may lead fruit details.
- Different cultivars may share a reference only after an explicit recorded identity review. Reusing one generic photograph to disguise distinct ingredients is not acceptable. Duplicate crops of the same image are still duplicates.
- Retain raw source evidence and image credits. Explicit reviewed presentation overrides take precedence over generic matching rules.

## Art direction

Natural side light; restrained ingredient greens and warm neutral whites; uncluttered muted green, earth or warm stone backgrounds; comfortable subject margins and a coherent 4:3 detail frame. No saturated props, heavy vignette, fabricated textures, unrelated garnish, text or watermarks.

Start from a reliable photograph of the correct subject. Background and lighting treatments must preserve its shape, edible part and material detail. Any AI-assisted reconstruction must be identified as an edited illustration and traced to its reference. Do not synthesize an unknown plant from its name.

## Acceptance

Review actual pixels for all changed assignments. Report duplicated source images across public entries, suspicious cut/cooked homepage images, detail images and missing role pairs separately. Check desktop and narrow screens; preserve existing admission, identity, season selection, safety, sources, saved records and sharing. Publishing is complete only after live image-role checks and screenshots of the target foods.

## Implemented review in this release

Baseline: ad08d184. New presentation version: 2026.10.24-visual.1. This change does not alter source food observations, recipes, seasonal dates, access policy or saved records.

- Explicitly replace the five formerly conflated mustard pictures. Xiaozhou uses its local harvest scene and a clearly labeled preserved-head-mustard plate; Yuzao100 uses the distinct swollen-stem plant and a documented tasting-event plate. The Xiaozhou plate is an alternative local preparation, not an assertion that the photograph shows the fresh garlic recipe below it.
- Correct walnut/hickory pictures that were assigned through the character 桃. Replace the misleading red-lychee-like generated hongguoshen image with a source photograph of the actual dark berries on the plant.
- Review 44 new photographic files and apply the same gentle treatment (94% saturation, 98% contrast), proportional resizing and WebP encoding. No food anatomy is redrawn. Crops and original source hashes are recorded. Exact local-food reportage is identified as an attributed source reference where no open license was established; it must never be relabeled as CC or public domain. Those rights limitations remain explicit in the credits and manifest.
- Home and detail roles are separate. A prepared dish or cut fruit leads the detail when reviewed imagery exists; the plant/whole-ingredient photograph moves to the separate “认食材” section. The interface uses the same neutral frame, 4:3 detail ratio, restrained role labels and visible source caption. Existing recipe illustrations keep their illustration label.
- The resolver rejects known cooked, sliced and unreviewed images as plant covers. It does not infer the subject from a filename ending in plant, raw or ingredient. A shared image retains its source identity; a second crop does not establish a distinct cultivar photograph.

## Honest scope and remaining work

The public catalog remains 291 entries. This release updates home imagery for 68 entries. There are 272 eligible home covers, 95 reviewed dish/fruit-cut detail images and 92 complete home/detail pairs. The initial image-generation attempt did not start; no newly synthesized image is included in these numbers.

19 public entries lack an eligible home image: the previous 16 gaps plus three formerly counted cut/prepared images (soft kiwi, winter lamb and duoyi). These entries remain in the full directory and all-in-season view, outside curated recommendations. They are not deleted to improve a coverage percentage. The complete missing-home and missing-detail lists are in VISUAL_COVERAGE_20261024.json. Remaining same-food/variety reference sharing is reported by the visual audit, not represented as unique source photography.

This is a first visual-standard pass, not a claim that all 291 entries now have a finished plant-to-plate pair or that every plant reference depicts the exact named cultivar. A photograph of a related species must not be used as an exact cultivar photo; use an explicit shape-reference caption only after identity review.

## Next asset admission

Each new assignment must have an explicit scene, food identity, source, original-image hash, derivative hash, crop/focus and reference/illustration status. Plant/whole scenes go to discovery surfaces; dish/cut scenes go to the detail lead. AI-assisted edits, when used, must start with a verified target reference and preserve leaves, edible organs, fruit interior, proportions and cooked texture. Background, lighting and plate styling may be adjusted; the result must be visually checked against the reference and labeled as edited illustration.

Run `node scripts/prepare-reader-release.cjs` twice and compare hashes, run the full regression suite and unchanged 2027 draw snapshot, then run the visual/access/identity/reader browser checks. New image roles are verified on the actual DOM in two widths and new files are decoded in Chromium. Publishing is complete only after the live revision and served bytes match.
