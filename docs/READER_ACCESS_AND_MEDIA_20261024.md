# Reader access and shared photography · 2026-10-24

Release label: `2026.10.24-access.1`. Base production commit: `8884b95cf6a7cb920852529ee9d963ed09812d82`.

## Admission and evidence

Taiwan seafood must have a verified, relevant Bilibili introduction/cooking video or a concrete mainland food-supply reference. A generated search URL, an undifferentiated fishery bulletin and an unresolved dialect name do not meet this rule. Unverified entries are withheld from public browsing; this is not a claim that the food is unavailable everywhere.

The reviewed registry is `dist/reader-access.js`. Eleven retained ingredient identities have actual video URLs, mainland search terms, and review dates. Supplier/market references appear where verified. A producer or wholesale listing establishes a route for inquiry, not guaranteed stock, retail quantity or nationwide delivery. Specific species and edible-part boundaries remain unchanged.

Public browsing now has 291 ingredient identities from 315 observations. The 31 withheld identity entries correspond to 39 original observations. All 354 original source observations remain in the evidence data; food safety, sources and original draw signatures are not rewritten. Homepage, search, map, flavor browsing and both new draw flows use the admission gate. Old withdrawn URLs show a short withdrawal message. Saved records are hidden rather than deleted; changing an admitted favorite preserves the other saved data.

## Why pictures still appeared missing

The previous photo-coverage count only covered the homepage resolver. After identity consolidation the baseline was 322 reader entries, including 30 without a cover. Another 84 entries had their usable photograph in the review registry while their raw image fields were empty. Favorites and draw interfaces still read those older fields. Search was a text-only list. These were separate presentation omissions, not proof of a network/CDN failure.

`dist/food-media.js` now resolves the approved ingredient image without mutating evidence records. Homepage, detail, search, favorites and both draw interfaces share it. Raw ingredient pictures and dish pictures have separate roles. Tarot uses a real dish image when available and otherwise labels the actual ingredient image correctly.

Eight ingredient covers and one cooked-pea example were visually reviewed and added as local WebP assets. The pea cover shows harvested shoots, not germinated sprouts. The older reviewed Malan photo includes leaves and stems; a later search result containing only flowers was rejected. Every new file retains source, author, license, original SHA-256 and derivative SHA-256 in `docs/READER_MEDIA_20261024.json`. The build only verifies local files and never fetches external photographs.

The public directory has 275 covers among 291 entries, with 16 still unpictured. Those entries remain reachable in the full directory and all-in-season browsing, but are excluded from curated homepage recommendations. All 24 curated term lists and their featured entries must have ingredient images. A cover does not imply a dish photograph is complete; this release does not claim every entry has a real recipe photo.

## Remaining ingredient photograph gaps

- 合川青草坝红皮萝卜 (`hechuan-qingshicao-winter-red-radish`)
- 虎林柳蒿芽 (`hulin-liuhao-shoot`)
- 恩平簕菜·清明嫩芽 (`enping-qingming-lecai-tender-shoots`)
- 苏州菜花塘鳢鱼 (`suzhou-rainwater-caihua-tangli`)
- 都江堰春分棉花草嫩苗 (`dujiangyan-spring-equinox-cotton-grass`)
- 施甸谷雨鲜蕨芽 (`shidian-guyu-fiddleheads`)
- 曲靖沙松尖 (`qujing-shasong-tip`)
- 温州瓯江子鲚 (`wenzhou-oujiang-ziji`)
- 溧水晶桥清明螺蛳 (`nanjing-lishui-qingming-river-snail`)
- 珠江口清明凤尾鱼 (`guangdong-qingming-fengwei-anchovy`)
- 广东十八涌清明黄眉头 (`guangdong-eighteen-streams-qingming-yellow-brow-fish`)
- 北江春季奶鱼 (`beijiang-spring-milk-fish`)
- 台东知本杭菊 (`taitung-daxue-hangju`)
- 九寨沟水蕨菜 (`jiuzhaigou-lixia-water-fern`)
- 福州惊蛰糟菜 (`fuzhou-jingzhe-zhaocai`)
- 英德廊步村红松茸 (`yingde-langbu-xiaohan-red-pine-mushroom`)

## Validation

Before testing or previewing, run `node scripts/prepare-reader-release.cjs`. Run it twice and compare all dist hashes to verify idempotence. Run `node --test tests/*.test.cjs`, `node scripts/audit-tarot-pool.cjs 2027`, and compare `docs/TAROT_POOL_COVERAGE_2027.json`.

`tests/reader-access.test.cjs` checks admission, evidence links, untouched source signatures, shared media, all 24 curated terms, licensed image hashes and loading order. `scripts/test-reader-access-browser.py` checks actual served bytes, both widths, all curated lists, directory thumbnails, withdrawn searches/URLs, saved-record compatibility, both draw flows, and browser decoding of every unique public cover. Existing identity and reader browser checks continue. CI success, merging, Pages deployment and actual live verification are separate gates.

This change does not add payment, inventory, price promises, global plugin permissions, or changes to unrelated repositories. Chromium desktop and narrow-screen tests do not establish physical Safari/iPad or mainland-network performance.
