# 阅读文案版本 2026.10.23-reader.1

## 编辑范围

保留当前四分类、首页原料图、地图和三维节气风味树。以完整 354 味目录为基础，只调整阅读层。

- `reader-copy.js`：审读后的精确句段替换、食材专属补充、四个定向词条。
- `reader-copy-curation.js`：保留有信息的原有烹调提醒与搭配；给已核实词条补充正面差异。
- `food-detail.js`：空栏目隐藏，鲜食精简，份量不再统一写成两人份；具体安全要求和资料出处保留。
- `scripts/prepare-reader-release.cjs`：在现有静态入口接入阅读层，保持大型内联地图 SVG 原样；首页用阅读副本，抽签引擎仍接收原始数据，仅结果展示使用阅读副本。所有接点均作唯一性断言，可重复执行。

## 本地预览与测试

```sh
node scripts/prepare-reader-release.cjs
node --test tests/*.test.cjs
node scripts/audit-tarot-pool.cjs 2027 > /tmp/tarot-pool.json
cmp docs/TAROT_POOL_COVERAGE_2027.json /tmp/tarot-pool.json
python3 -m http.server 8774 --directory dist
```

发布前运行同一准备步骤。`dist/build-info.json` 记录发布提交与文案版号。准备步骤不改原始食材目录、产期、抽签签名或来源数组；无需为文风调整修改抽签覆盖快照。

## 验收

`Check reader copy` 对全目录检查实际详情渲染、来源和安全文本，对四个定向词条及特殊处理食材在桌面与 390px 窄屏下检查。正式 Pages 发布成功后自动再次访问公开网址，核对资源 SHA-256、检查页面并保存截图。该校验工作流只有 contents: read 权限。

状态以具体 CI 与正式站回读为准；本文档本身不表示已经发布。
