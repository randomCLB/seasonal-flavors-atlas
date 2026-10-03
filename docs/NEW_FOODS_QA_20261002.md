# 新品本地验收 · 2026-10-02

基线：main@79f51f70cd1abf2bc6e46b0c70c3f8c4664852e7。分支：content/seasonal-additions-20261002。

## 自动回归

命令：`node --test tests/*.test.cjs`。

最终TAP摘要：tests 136 / suites 0 / pass 136 / fail 0 / cancelled 0 / skipped 0 / todo 0；退出码0。日志：[tests.tap](evidence/new-foods-20261002/tests.tap)。

`git diff --check`：无输出，退出码0。

## 浏览器

Playwright Chromium，本地静态站 http://127.0.0.1:8770/。检查七味新品在1440×1000、390×844两种视口的14组详情；全部打开成功，标题、做法、分享按钮正确，图片解码成功，详情无横向溢出，跳到做法有效。搜索“蓝靛果”可直接打开新品。

谷雨首页可以出现四月下旬短柄樱桃；大图解码为900像素原生宽度，主角也在下方当季列表中；浏览器未出现页面脚本错误。首次截图在图片解码前拍到占位，已等待解码补拍。浏览器第一次跳转检查早于 requestAnimationFrame，后来按目标滚动位置等待，复测通过；没有改动网站跳转逻辑。

证据：[详情检查运行记录](evidence/new-foods-20261002/browser-check.txt)（命令退出码0） · [首页检查结果](evidence/new-foods-20261002/home-check.txt)（命令退出码0）。这属于桌面浏览器视口检查，没有扩大真机范围。LG7/Android unauthorized：未测，未请求授权或重试。

## 截图

- [手机谷雨首页](evidence/new-foods-20261002/mobile-guyu.png)
- [手机开凌梭成菜详情](evidence/new-foods-20261002/390-jiaozhou-kailing-suo.png)
- [手机蓝靛果切面详情](evidence/new-foods-20261002/390-harbin-fresh-honeyberry.png)
- [桌面短柄樱桃详情](evidence/new-foods-20261002/1440-shangyu-duanbing-cherry.png)

## 改动与保留

本批：7味正文及地方时令、7份推荐/忌口标签、14张本地图片；首页完整节气区间与新品赏味窗口交集；抽签同一窗口过滤；三页面相关脚本缓存键更新；图片登记、资料页、覆盖审计与针对性测试。

已有 CSS 工作树改动保持原样，不进入新品提交：

- dist/style.css：2行，手机搜索和做法按钮44像素触区、横屏操作按钮触区。
- dist/tarot-spread.css：1行，手机结果牌横向滚动、牌面最小宽高与文字换行。

`.playwright-cli/`和`output/`仍为本地未跟踪的制作/检查目录。本站新品已可本地操作；无推送、无发布、无合并。冬荪为资料未齐的候选，十一月覆盖仍为4味。
