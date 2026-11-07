# 时令风物：私有轻量访问统计

## 当前状态

接入代码已准备，**尚未启用采集**。`analytics.config.json` 的 `siteCode` 为空，构建不会向网页注入统计脚本。统计账号尚未创建或绑定，未完成真实后台入库和登录权限验收。不得将此状态表述为“已上线统计”。

使用 GoatCounter 托管后台和其官方稳定 `/count` 接口，不自行搭建数据库或服务器。前端仅有一个 2405 字节的同站脚本，压缩测试约 1096 字节；没有第三方 JavaScript 依赖。每个实际可见的页面加载最多发送一次非阻塞请求。无计数器、徽章、悬浮窗或公开报表链接。

## 启用前唯一外部依赖

由站主在 https://www.goatcounter.com/signup 创建或选择自己的账号。站点域名填 `https://randomclb.github.io/seasonal-flavors-atlas/`。需要返回的只有账号地址中的站点代码，例如 `example.goatcounter.com` 的 `example`，**不需要密码、API 密钥或邮箱验证码**。示例名称不是已经注册的账号。

后台必须设置为私有，并实际退出登录验证无法读取报表；关闭公开计数器和公开嵌入。仅仅不展示后台链接不是权限保护，前端代码也无法替代后台访问控制。开启国家/地区数据收集以及 Sessions；Campaign Parameters 包含 `utm_source`。不启用 Individual pageviews。固定报告时区并在报告中注明，例如 Asia/Shanghai；可在需要更细的省/州数据时另行检查地区收集设置，不承诺城市精度。

完成账号与私有访问检查后，将 `analytics.config.json` 的 `siteCode` 填为真实代码。通过原有 PR 审核/发布流程合并，现有发布脚本 `scripts/prepare-reader-release.cjs` 会自动执行 `scripts/prepare-analytics.cjs`，向所有顶层 HTML 的 `</body>` 前插入同一个延迟加载脚本。默认空值可以安全合并但不会采集；本次草稿尚未合并或发布。

## 记录什么

- 页面路径和页面标题，按 GoatCounter 的去重访问口径展示趋势。`index.html` 与目录首页归为同一路径。
- 外部来源网站域名，不记录来源页面的完整路径、查询参数或片段。
- 一个可选短渠道标签 `utm_source`，仅允许 1 至 40 个英文字母、数字、下划线或连字符。
- 国家/地区由 GoatCounter 根据请求网络地址推断，不向浏览器申请定位权限。代理/VPN、共享出口可能改变归属地，不能当成真实居住地。

默认不记录页面搜索词、分享载荷、抽签偏好、URL 片段、完整查询串、完整来源 URL、屏幕尺寸、点击事件或会话录像。不设置 Cookie，不写入 localStorage，不生成长期访客 ID。请求使用 `credentials: omit` 和 `referrerPolicy: no-referrer`，显式发送已清理的来源字段。

GoatCounter 为短时去重会在服务器内存中使用 IP 与 User-Agent，官方说明最长约 8 小时，不将原始 IP/完整 User-Agent 写入统计数据库或磁盘。不能将这说成“服务器从未接触 IP”。

## 来源与数字的边界

浏览器不提供来源时显示为直接/未知，不能还原微信私聊或朋友圈的原始发送者。可用带标签的分享链接，例如 `https://randomclb.github.io/seasonal-flavors-atlas/?utm_source=wechat`；已有查询参数时用 `&utm_source=wechat`。这只标记该链接所属渠道，不能证明访问者实际从该渠道打开；标签可被复制或修改。

GoatCounter 默认对同一页面在短时会话内去重，并不是“精确自然人数”或每次刷新的原始 PV。不同页面的去重访问不能直接相加当成独立用户，跨日/跨周也不能简单相加后称为周期 UV。广告拦截、DNT/GPC、网络故障、JS 禁用等都会造成漏计；不绕过拦截。没有历史记录，启用前的两周不能补算。

本地、其他域名、`preview/`、iframe、自动化浏览器、DNT 和 GPC 都不发送。站主可用 `?analytics=off` 跳过当前页面的采集；该开关不会持久保存或自动跟随站内跳转。

## 验收与回滚

本地针对性测试：

```sh
node --check dist/analytics.js
node --test tests/analytics.test.cjs
```

2026-11-02：19 项针对性测试通过；没有运行仓库完整回归，也没有访问真实 GoatCounter 接收端。当前测试用模拟浏览器验证请求内容，不等同于真实后台入库验收。

激活时还要完成：原有全量回归和 Pages 字节核验；用真实非自动化浏览器分别打开首页、塔罗、风味签和图片来源页；开发者工具看到一次 `/count` 请求；登录后台确认收到记录、正确的来源和地区；退出后台后不能读取统计；确认网站外观无变化。在未通过后台权限与入库检查前，不宣布启用成功。

回滚：清空 `siteCode` 后重新发布，构建脚本会移除它注入的标签；或回退本次提交。统计模块失败不会阻断网站功能，也不重试。

## 官方依据

- 收集接口与稳定参数：https://www.goatcounter.com/help/pixel
- 会话与访客口径：https://www.goatcounter.com/help/sessions
- 数据与 IP 处理：https://www.goatcounter.com/help/privacy
- 来源缺失与机器人边界：https://www.goatcounter.com/help/faq
