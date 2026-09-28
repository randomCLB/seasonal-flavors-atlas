# 时令风物

沿二十四节气、产地和口感认识中国各地较少见的时令食材。目前收录 55 味：蔬菜 34 味、水果 13 味、蛋白类 8 味。食材详情包含处理、吃法和选购信息。

## 本地打开

`dist/` 是完整静态站点。运行 `python3 -m http.server 8766 --directory dist`，然后打开 `http://localhost:8766/`。网站所需脚本、样式、地图和食材图都随仓库提供，不依赖海外字体或图片服务。

## 发布

推送到 GitHub 的 `main` 分支后，GitHub Actions 将 `dist/` 发布到 GitHub Pages。请在仓库设置中将 Pages 发布源设为 **GitHub Actions**。

## 内容与图片

产季以具体产地为准；首页节气从当年秋分展示到次年秋分，地图可看单月或全年，并可用鼠标滚轮缩放。首页和地图以每种食材最好吃的短窗口为主，集中采收或上市期作为时令佐证；全年供货不等于全年正当时。其他月份仍可买到的加工品或冷链货留在详情说明。具体成熟日每年会随天气变化。词条均提供两人份做法、用量、步骤和选购信息。图片来源、授权与地方品种核验情况见 [图片清单](IMAGE_REGISTER.md)；新增选题与候选见 [食材扩充矩阵](CANDIDATES_25_48.md)。部分照片为形态参考，地方品种或原始拍摄地仍待确认；南湖菱、施甸羊奶果和青海蕨麻等新闻或政府图片网页未注明开放许可，详见清单。

## 地图与节气资料

地图海岸、河流和湖泊取自 [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) 公共领域资料，以 Lambert 等角圆锥投影绘制。节气时刻在中国时区显示，静态数据由 [lunar-javascript](https://github.com/6tail/lunar-javascript) 生成，并核对 [香港天文台节气表](https://www.hko.gov.hk/en/gts/time/24solarterms.htm)。
