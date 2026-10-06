# 食品实拍图清晰度与版面复核

依据已发布仓库基线 `main@bd3a1010b1d6b827f13880cc6eb8927dab72630b`。本次修正首页笋图为整支带壳鲜笋，并将摄影来源说明收至悬停/键盘聚焦显示；不改卡牌插画和全站风格。

## 本轮可见改动

| 区域 | 修改 | 证据与许可 |
| --- | --- | --- |
| 沙棘首页主图及详情辨识图 | 首页原为 720×405 剖面照，在近方形主图框中 `cover` 后果实细节不足。换成同种沙棘果实近景，原图 2012×3006；生成 400、800、1280、1600px 宽 sRGB WebP，保持原比例，加入 `srcset`/`sizes` 和尺寸属性。画框仍按 `cover` 局部显示；原图和完整比例版本保留。 | [Hans Hillewaert 原图及授权](https://commons.wikimedia.org/wiki/File:Hippophae_rhamnoides.jpg)，CC BY-SA 3.0；比利时 De Haan 拍摄，仅为同种形态参考，不代表敖汉产地。原图保存在 `docs/source-images/shajiguo-original-commons.jpg`，SHA-256 和衍生文件记录见 `IMAGE_REGISTER.md`。 |
| 刺竹笋首页卡与首屏主图 | 首页改用整支带壳毛笋实拍，生成 400×533、800×1067、1200×1600px WebP；首页按完整外观显示，详情中的成菜照片保留。长来源说明默认收起，悬停或键盘聚焦图片时显示；授权记录仍在 credits。 | [Fumikas Sagisavas 原图及授权](https://commons.wikimedia.org/wiki/File:Bamboo_shoots.jpg)，CC0 1.0；常州市场照片，竹种未注明，只作通用形态参考，不声称是腾冲刺竹。原图和 SHA-256 见 `IMAGE_REGISTER.md`。 |
| 节气插段 | 保留原有节气 SVG 插画与文字，图片由统一小方块放大为主图，并依节气索引设置四种高度，手机端改为上下编排。当前秋分图在 390px 视口为 305×176px，在 1440px 视口为 388×184px。 | 沿用现有矢量插画，没有替换成生成图或新增不明来源照片。截图见下方。 |

衍生图均为常规等比例 Lanczos 缩小、WebP 质量 90，并嵌入 sRGB 配置；没有 AI 重绘、纹理重建、降噪或锐化。沙棘输出文件体积：400w 47,312 B、800w 125,294 B、1280w 239,698 B、1600w 338,866 B；新鲜带壳竹笋：400w 61,560 B、800w 200,630 B、1200w 389,546 B。

## 加载和版面检查

Playwright + 本机 Chrome 模拟浏览器，视口 320/390/1440 CSS px、DPR 2；没有将模拟验收描述为微信或真机测试。

| 检查项 | 结果 |
| --- | --- |
| 沙棘主图 `currentSrc` | 390px 与 320px 选 800w；1440px 选 1280w。主图 `loading=eager`、`fetchpriority=high`。 |
| 刺竹笋图片 `currentSrc` | 卡片 390px 选 400w、1440px 选 800w；首屏主图和详情辨识图采用各自的 `sizes`，竖幅原图按 `contain` 完整展示。 |
| 页面宽度 | 320、390、1440px 与布局根宽一致；根字号放大至 200% 的 320px 模拟也未产生横向溢出。 |
| 页面截图 | [改前首页 390](photo-clarity-evidence/before-home-390.jpg) · [改后首页 390](photo-clarity-evidence/after-home-390.jpg) · [改前首页 1440](photo-clarity-evidence/before-home-1440.jpg) · [改后首页 1440](photo-clarity-evidence/after-home-1440.jpg) · [改后 320](photo-clarity-evidence/after-home-320.jpg) · [320 根字号 200% 模拟](photo-clarity-evidence/after-text-200-320.jpg) |
| 用户指出的区域 | [刺竹笋卡片 390](photo-clarity-evidence/after-cizhousun-card-390.jpg) · [刺竹笋卡片 1440](photo-clarity-evidence/after-cizhousun-card-1440.jpg) · [来源说明悬停状态](photo-clarity-evidence/after-cizhousun-credit-hover.jpg) · [节气插段 390](photo-clarity-evidence/after-interlude-390.jpg) · [节气插段 1440](photo-clarity-evidence/after-interlude-1440.jpg) · [竹笋详情 390](photo-clarity-evidence/after-cizhousun-detail-390.jpg) · [竹笋详情 1440](photo-clarity-evidence/after-cizhousun-detail-1440.jpg)。新来源说明仅在鼠标悬停或键盘聚焦时显现。 |

本机静态服务器上进行了布局、加载来源和截图复核。320/390/1440 的实测是模拟浏览器结果；没有推断微信缓存、网络速度或真实设备表现。

本次图像修正重新检查了 Playwright 390px 和 1440px 视口、卡片注释的默认/悬停状态，以及详情成菜图。表中 320px、200% 根字号与 DPR 2 的结果来自先前发布版本，本次没有重跑这些组合。

## 仍待核实或替换

| 图片 | 当前情况 | 后续处理 |
| --- | --- | --- |
| `shajiguo-cut.jpg`，720×405 | 原图来源页未标开放许可；仍留作剖面食用状态图。 | 找到同照片的高分辨率原图及许可前，不放大或锐化；当前首页已不再使用。 |
| `lintong-huojing.webp`，600×450 | 高清屏辨识图像素仍不足，现有来源未能确认可授权的高清原图。 | 继续找可核同图原片；不以异品种照片冒充临潼火晶柿。 |
| `juema-roots-enhanced.webp`，750×481 | 已经增强过，原始图源的再分发许可未明。 | 不重复锐化、不放大；等有许可的高清原图。 |
| `cizhousun-salad.jpg`，1400×929 | 原图登记为 2448×1624，但下厨房页面未标开放许可；清晰许可待确认。 | 详情成菜照仍留用并标待确认；首页毛笋照片是异地产地的通用形态参考，腾冲刺竹品种实拍仍待授权来源。 |

## 测试

`node --test tests/*.test.cjs`：145 项通过。修改没有触碰内容、抽取规则或塔罗行为。页面源文件和图片仍在审阅分支；本记录不代表已合并或发布。
