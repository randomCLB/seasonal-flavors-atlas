# 食品实拍图清晰度优化记录

基于 GitHub `main` 的 `60f2d2d5e809f184420e7f33e207fe9e097269a5`。改动限于食品照片的尺寸信息、裁切方式和沙棘响应式加载；没有改网站整体样式、食品数据或卡牌图片。

## 改动与来源

| 图片 | 原有状态 | 本次处理 | 来源与许可 |
| --- | --- | --- | --- |
| 沙棘首页大图、详情辨识图 | 首页使用 `shajiguo-cut.jpg`（720×405、50,624 B）并在近方形画框中 `cover`；详情辨识图也用较小图 | 改用枝头整果实拍；由原片等比例生成 400、800、1200、1600 px 宽 WebP，加入 `srcset`/`sizes`/宽高，按显示槽位和密度选择；首页大图优先加载，列表继续懒加载；辨识图完整显示 | Stephan Sprinz / Wikimedia Commons，[原图及记录](https://commons.wikimedia.org/wiki/File:Sanddorn_(Hippophae_rhamnoides)_auf_Spiekeroog_02.jpg)，CC BY 4.0。原片 5593×3729，保存在 `source-images/shajiguo-original-commons.jpg`。拍摄于德国 Spiekeroog，仅作同种形态参考，不代表敖汉产地。 |

原片已有嵌入 sRGB 配置。本次只做 Lanczos 等比例缩小、转 sRGB WebP（质量 90）；不裁切、不降噪、不锐化、不重绘、不生成细节。原片 SHA-256、署名和许可也记录于 `IMAGE_REGISTER.md` 与站内图片出处页。

| 输出文件 | 尺寸 | 文件体积 |
| --- | ---: | ---: |
| `shajiguo-400.webp` | 400×267 | 33,198 B |
| `shajiguo-800.webp` | 800×533 | 86,756 B |
| `shajiguo-1200.webp` | 1200×800 | 147,378 B |
| `shajiguo-1600.webp` | 1600×1067 | 212,882 B |

## 重点照片盘点

| 文件 | 源图/当前尺寸 | 展示与裁切 | 来源和许可 | 结论 |
| --- | --- | --- | --- | --- |
| `shajiguo-cut.jpg` | 720×405 | 首页原先近方形 `cover`；详情约 335×189（390px）或 752×423（1440px） | Finess 产品资料；未标开放许可，摄影者及品种信息待核 | 首页不再用。保留详情原图，等待许可明确、同品种且同食用部位的高清照片。1440px/DPR2 下源像素不足。 |
| `lintong-huojing.webp` | 600×450 | 详情辨识图完整显示，不裁切 | FreshPlaza 报道图；作者及开放许可未注明，登记尺寸即 600×450 | 未找到有许可依据的同图高清原片；保留，待替换。现有 `lintong-huojing-cut.jpg` 为另一张 1080×720 详情食用状态图，不冒充同一原片。 |
| `juema-roots-enhanced.webp` | 750×481；原文件 `juema-roots.png` 同尺寸 | 详情辨识图完整显示 | 石渠县政府页面配图；摄影者与开放许可未注明 | 登记显示它已做过轻微对比度、锐度增强。本次不再锐化、不放大、不改图，待高清授权来源。 |
| `cizhousun-salad.jpg` | 站内 1400×929；登记原图 2448×1624 | 列表/详情使用既有裁切 | 下厨房用户食谱；页面未标开放许可。现图嵌入 Display P3 配置 | 未取得清晰许可前不复制原图或替换。若授权核实，应按原图尺寸裁切并保留/正确转换色彩配置。 |

上述重点文件的 `width`/`height` 属性现按登记尺寸填写，避免加载时版面跳动。沙棘、临潼火晶柿、蕨麻和刺竹笋的辨识图改为完整显示，防止辨识部位被裁掉；不对已经增强过的蕨麻图叠加滤镜。

## 前后检查

Playwright 模拟浏览器，390、320、1440 CSS px，DPR 2。截图是 JPEG 90 的浏览器截图；320px 下另以根字号 200% 做布局放大模拟。没有使用微信或真机验收。

| 视图 | 改前 | 改后 |
| --- | --- | --- |
| 首页 390px | [截图](photo-clarity-evidence/before-home-390.jpg) | [截图](photo-clarity-evidence/after-home-390.jpg) |
| 首页 1440px | [截图](photo-clarity-evidence/before-home-1440.jpg) | [截图](photo-clarity-evidence/after-home-1440.jpg) |
| 列表 390px | [截图](photo-clarity-evidence/before-list-390.jpg) | [截图](photo-clarity-evidence/after-list-390.jpg) |
| 列表 1440px | [截图](photo-clarity-evidence/before-list-1440.jpg) | [截图](photo-clarity-evidence/after-list-1440.jpg) |
| 沙棘详情 390px / 1440px | — | [390px](photo-clarity-evidence/after-detail-390.jpg) · [1440px](photo-clarity-evidence/after-detail-1440.jpg) |
| 首页 320px / 文字放大模拟 | — | [320px](photo-clarity-evidence/after-home-320.jpg) · [200% 模拟](photo-clarity-evidence/after-text-200-320.jpg) |

主图加载核对：390px/DPR2 选择 800w（文件 86,756 B），1440px/DPR2 选择 1600w（212,882 B）；首张列表大图在 390px 选择 1200w（147,378 B），且懒加载。320px/DPR2 选择 800w。页面滚动宽度在 320、390、1440px 均与视口相同。裁切后的编辑卡片使用单独 `sizes` 估算；小卡片仍使用较轻版本。浏览器按网络和缓存条件可以选择更大的候选图。

相较原首页图 50,624 B，新的首屏图增加约 36 KB（390px）或 162 KB（1440px）；详情及首屏外图片仍由实际图片元素按需加载，不会把四种尺寸同时下载。这里记录的是本地静态文件体积与模拟页面行为，不代表微信内网速或真实加载耗时。

色彩检查未发现本次色彩处理偏移；沙棘果簇、叶片轮廓来自原始照片本身。现存切面图仍偏软，不能靠放大或锐化补足；需待授权清楚的高清实拍来源。

## 验证

- `node --test tests/*.test.cjs`：145 项通过。
- 模拟浏览器确认：首页主图 `fetchpriority=high`；非首屏列表图懒加载；390、320、1440px 无横向溢出。
- 详情辨识图使用 `contain`，不裁去枝叶/果实；沙棘剖面图仍使用原尺寸文件。
