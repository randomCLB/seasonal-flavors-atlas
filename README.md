# 时令风物

沿二十四节气、产地和口感认识中国各地较少见的时令食材。目前完整目录收录 357 味，涵盖蔬菜、水果、水产与肉、菌菇、食用花、茶饮、坚果种子、香辛料和油料。首页从完整目录中选出当季适合尝试的一组，食材详情包含处理、吃法和选购信息。

## 本地打开

`dist/` 是完整静态站点。运行 `python3 -m http.server 8766 --directory dist`，然后打开 `http://localhost:8766/`。网站所需脚本、样式、地图和食材图都随仓库提供，不依赖海外字体或图片服务。

## 发布

推送到 GitHub 的 `main` 分支后，GitHub Actions 将 `dist/` 发布到 GitHub Pages。请在仓库设置中将 Pages 发布源设为 **GitHub Actions**。

## 内容与图片

产季以具体产地为准；首页节气从当年秋分展示到次年秋分，地图可看单月或全年，并可用鼠标滚轮缩放。首页和地图以每种食材最好吃的短窗口为主，集中采收或上市期作为时令佐证；全年供货不等于全年正当时。其他月份仍可买到的加工品或冷链货留在详情说明。具体成熟日每年会随天气变化。词条均提供两人份做法、用量、步骤和选购信息。图片来源、授权与地方品种核验情况见 [图片清单](IMAGE_REGISTER.md)；新增选题与候选见 [食材扩充矩阵](CANDIDATES_25_48.md)。部分照片为形态参考，地方品种或原始拍摄地仍待确认；南湖菱、施甸羊奶果和青海蕨麻等新闻或政府图片网页未注明开放许可，详见清单。

## 地图与节气资料

地图海岸、河流和湖泊取自 [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) 公共领域资料，以 Lambert 等角圆锥投影绘制。节气时刻在中国时区显示，静态数据由 [lunar-javascript](https://github.com/6tail/lunar-javascript) 生成，并核对 [香港天文台节气表](https://www.hko.gov.hk/en/gts/time/24solarterms.htm)。

## 塔罗牌池与轮换

默认抽签为塔罗三牌阵。新增5种地方食材，并将12种已有鲜果的可食状态图显式接入；原料参考与熟制照片分开标记。同一页面内先抽遍当前合格候选再轮换，刷新重新开始。不会放宽忌口或改写时令凑数。详见[扩充说明](docs/TAROT_POOL_EXPANSION.md)与[全年牌池采样](docs/TAROT_POOL_COVERAGE_2027.json)。运行 `node scripts/audit-tarot-pool.cjs 2027` 可复算。

## 二十四节气的编辑精选

`dist/season-features.js` 配置每个节气的主推风物、短句、导读和推荐缘由。主推仍须通过原有时令窗口及图片条件；配置不能把不当季的食材硬塞进页面。`dist/season-selection.js` 按可食部位和具体风物家族去重，保留不同实质食材，优先保留本期主推；共享一张通用参考图不会被视为同一种食材。其他地方品种仍可在搜索、地图和完整目录中找到。

首页分类将目录里的 `seafood` 并入“水产与肉”、`nuts` 并入“坚果种子”，只作展示归类，不修改抽签档案。顶部主推独立展示，下面的卡片严格遵循所选类别。`dist/editorial-copy.js` 统一卡片短文，并通过 `EDITORIAL_DETAILS` 补充阅读文案，保留原始来源、食用注意事项和配方签名。

回归检查：`node --test --test-concurrency=4 tests/*.test.cjs`。其中 `tests/season-counts.test.cjs` 使用首页真实加载顺序检查全部节气的分类、主推、计数和跨年行为。
