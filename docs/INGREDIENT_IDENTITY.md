# Ingredient identities · 2026-10-24

Scope: fix duplicate ingredients and repeated regional/solar-term pages. This release does not add a shop, checkout, payment, stock, or delivery promises. The supplied product proposal's deduplication section is applied to randomCLB/seasonal-flavors-atlas; Toonflow is unrelated and untouched.

## Model

`window.FOODS` retains original source observations and their original recipe/date/safety evidence. `IngredientIdentity` explicitly maps reviewed source IDs to stable ingredient IDs. A single canonical ingredient has multiple names, places and seasonal observations. Reuse of one vague common name does not automatically imply biological identity. Registry entries marked `market-name` consolidate the reader-facing market-name page only; source descriptions remain visible. Distinct named cultivars and different edible parts remain separate.

All browsing entries use canonical IDs: homepage cards, the full directory, search, map popups, flavor list, detail links and local tasting records. A legacy food URL resolves to the same canonical detail and is normalized with replaceState without adding a history entry. Existing saved records merge by latest timestamp; ties preserve tried. Original localStorage is not rewritten merely by loading the page.

A second editorial-family layer controls one representative per tasting family in each solar term. It is broader than identity: multiple named cultivars remain separate in the catalog, but do not fill a single seasonal list. Family decisions do not depend on the four UI categories. This fixes lotus pods versus lotus seeds, summer water-bamboo and fish aliases. All bamboo shoots share a tasting family while their ingredient records remain distinct.

Adjacent-term repetition is compared by family, not by regional source IDs. No unverified source is made recommendation-eligible merely because it shares an ingredient ID. Source dates, sourceYears, peakTerms and safety fields are unchanged.

## Reviewed merges

See the explicit `groups` in dist/ingredient-identity.js. They include the duplicate Sha­zikou shrimp observations, Hejiang late lychee, Emei Wenchun tea, multiple regional observations of true seabream, red-eye fish, white-belly seerfish, black marlin, unspecified billfish, frigate tuna, cuttlefish, white hairtail, child mustard, water shield, June-yellow crab, fresh fava beans, toon shoots, ma bamboo shoots, green plums, golden pomelo, fresh longan and Aralia shoots.

New taxonomic reference checks are limited to alias verification:
- Pagrus major: https://fishdb.sinica.edu.tw/taxon/382642-fishdb/specimen
- Dentex hypselosomus: https://fishdb.sinica.edu.tw/taxon/395481-fishdb
- Dentex abei: https://fishdb.sinica.edu.tw/taxon/395231-fishdb
- Auxis thazard thazard: https://fishdb.sinica.edu.tw/taxon/382486-fishdb

The two Dentex references demonstrate why a market-name merge must not be presented as a definitive species identification. Previously held observations remain held in recommendation selection.

## Verification

Run `node scripts/prepare-reader-release.cjs` before tests or publishing. The existing catalog preparation invokes the identity integration. Run all tests and the existing 2027 draw snapshot comparison. The additional identity workflow audits registry membership, legacy redirects, distinct edible parts, family-level repetition, all 24 seasonal lists, search aliases, map entries and migration of saved intentions. Browser checks use desktop and narrow viewports. Post-publication checks must fetch the official Pages URL and match the identity module, CSS, app and build commit before reporting deployment complete.
