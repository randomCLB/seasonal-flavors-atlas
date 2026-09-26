# 时令风物

沿二十四节气、产地和口感认识中国各地较少见的时令食材。首版收录 24 味，覆盖全年；食材详情包含处理、吃法、选购和资料来源。

## 本地打开

`dist/` 是完整静态站点。运行 `python3 -m http.server 8766 --directory dist`，然后打开 `http://localhost:8766/`。网站所需脚本、样式、地图和食材图都随仓库提供，不依赖海外字体或图片服务。

## 发布

推送到 GitHub 的 `main` 分支后，GitHub Actions 将 `dist/` 发布到 GitHub Pages。请在仓库设置中将 Pages 发布源设为 **GitHub Actions**。

## 内容与图片

产季以具体产地为准；首页节气从当年秋分展示到次年秋分，地图可看单月或全年，并可用鼠标滚轮缩放。不保证每年每地同时上市。详情页末尾列出资料出处。24 味食材的文字已扩写为约 600—900 字，并提供两人份做法。图片来源、授权与地方品种核验情况见 [图片清单](IMAGE_REGISTER.md)；候选扩充见 [第 25—48 味矩阵](CANDIDATES_25_48.md)。所有词条现都有图片；部分照片仅作形态参考，地方品种或原始拍摄地仍待确认。南湖菱新闻照片许可也仍待确认。鸡头米详情使用明确标注的生成示意图，首页使用真实芡实植株照片。

## 地图与节气资料

地图海岸、河流和湖泊取自 [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) 公共领域资料，以 Lambert 等角圆锥投影绘制。节气时刻在中国时区显示，静态数据由 [lunar-javascript](https://github.com/6tail/lunar-javascript) 生成，并核对 [香港天文台节气表](https://www.hko.gov.hk/en/gts/time/24solarterms.htm)。
