# 普通动物食材替代来源核验（2026-11-06）

结论：建议以**三门血蚶**替代大寒青鱼。中山东升脆肉鲩保留为地域及特殊口感候选；霞浦小白章只有夏季地方菜证据，均不编码为自然短季新品。夏季可由现有灌云豆丹、南沙黄油蟹替代普通三文鱼推荐位，不强凑新条目。

## 三门血蚶：推荐集成

### 窗口与产区两条原文

1. [浙江工人日报《血蚶》](https://epaper.zjgrrb.com/html/2015-07/04/content_2526596.htm?div=-1)，2015-07-04，人间第4版，公开全文已读。原文：“小寒至大寒期间，血蚶血量最多”。同段记述肉质饱满鲜红。此为地方饮食记述中的肥满赏味线索，不表示1月独占供应，也不是三门专门的肥满度实验。可以用一般血蚶冬季赏味资料介绍三门地方产品，须保留这一边界。不采用文中的半熟吃法和药效旧说。
2. [国家知识产权局地理标志产品保护要求汇编](https://www.cnipa.gov.cn/attach/0/20250826010509.pdf)，2025年附件，第509项，PDF正文1493—1495页；已下载全文、提取文字并看图核对1493页。正式名称是“三门血蚶”，不是搜索索引显示的“三门血蛤”。1493页将产地限定为三门县海游、海润、沙柳、健跳、浦坝港、横渡、花桥、蛇蟠共8乡镇（街道）98村，范围东经121°27′31″—121°56′36″、北纬28°51′37″—29°10′30″。1494页规定壳长达2.5cm以上人工采捕，没有限定1月上市。

地域交叉证据：[浙江在线《三门县打造“放心血蚶”金名片》](https://tz.zjol.com.cn/tzxw/202503/t20250314_30880212.shtml)，2025-03-14，记者罗亚妮、陈栋，通讯员罗茜，公开全文已读。确认三门98个专业养殖村、9万亩海域，以及“血蚶学名‘泥蚶’”；其养殖、检验、溯源过程可用于采购判断。不引用10秒烫食或药效说法。

### 与既有大连毛蚶不同

已读取现有 `dalian-jinzhou-hairyclam` 完整条目：名称毛蚶，产地金州沿海，立冬初冬赏味，来源为[中国农业博物馆立冬专题](https://jgs.agri.gov.cn/detail/zh/39871.html)。本次原站读取失败（502及本地DNS失败），只看到公开搜索索引中的毛蚶段，故不声称重读全文；现有条目也未写拉丁学名。

身份由以下公开全文交叉核实：

- [中研院国际贝库：毛蚶](https://shell.sinica.edu.tw/english/shellbase_detail.php?science_no=2180)：学名 **Scapharca subcrenata**，分布明确列大连、金州，约32条壳肋；对应既有条目名称与地域。
- [国立台湾博物馆血蚶藏品记录](https://collections.culture.tw/Object?RNO=QjAwMTMtMTg%3D&SYSUID=13)：血蚶学名 **Tegillarca granosa**，壳面15—20粗肋；结合三门原文确认血蚶＝泥蚶。
- [农业农村部种质资源普查操作手册](https://www.moa.gov.cn/xw/bmdt/202106/P020210617343595765105.pdf)公开索引分别列42泥蚶（Tegillarca granosa）、44毛蚶（Scapharca subcrenata）。此手册仅索引核对，不作为本次已全文读取的证据。

结论：两者为不同物种，不是毛蚶换产地重录。俗名“蚶子、瓦楞子、血蛤”不能单独作为去重或鉴别依据；照片也不承担最终物种鉴定。

### 可集成字段

| 字段 | 建议 |
|---|---|
| id / name | `sanmen-winter-blood-cockle` / 三门血蚶 |
| alias | 三门血蛤、泥蚶、血蚶；不加毛蚶 |
| region / category | 浙江台州·三门湾沿岸（地理标志范围） / `seafood` |
| lat / lon | 约29.02 / 121.70，只表示产区概略点 |
| months / peakMonths | `[1]` / `[1]`，冬季肥满线索，不是排他供应期 |
| peakTerms / entryTerms | 以大寒 `[1]` 为替代推荐入口；文内完整保留“小寒至大寒” |
| seasonBasis / seasonPrecision | `best-taste` / `solar-term` |
| seasonLabel | 小寒至大寒的肥满赏味线索 |
| short | 壳里藏着一圈金线的三门血蚶，姜葱煮透，趁热剥壳尝鲜。 |
| seasonEvidence | 浙江地方饮食资料描述血蚶小寒至大寒较肥满；三门为明确地方产区。此为赏味资料整理，不是当年上市或库存保证。 |
| comparison | 泥蚶Tegillarca granosa；与金州毛蚶Scapharca subcrenata分开，不能按俗名互换。 |

### 正规采购和充分熟制

路线聚焦**浙江三门当地正规海鲜市场或合规餐饮渠道**，问实际养殖产地、采捕/到货日、鲜活或冷冻状态、来源与检验追溯信息。搜索词“三门血蚶 泥蚶 鲜活”。未核验具体商家、价格、库存或跨省配送；白壳或金线不能证明产地。

食谱可用“姜葱煮血蚶”：刷洗，弃破壳或异味异常品，姜葱水充分加热至蚶肉熟透，不以刚开口或秒数单独判断。不采用10秒烫、六七成熟、酒浸、生腌；这是本站熟食改写，不冒称三门传统食法。

[香港食物安全中心2017年5月专文](https://www.cfs.gov.hk/sc_chi/multimedia/multimedia_pub/multimedia_pub_fsf_130_03.html)全文要求包括血蚶在内的贝类彻底烹煮。已核对[上海现行通告（沪府规〔2023〕15号）](https://www.shanghai.gov.cn/nw12344/20231219/e77f3d8746dc43e68e166db8f667a79a.html)全文：禁止生产经营毛蚶、泥蚶、魁蚶等蚶类，有效期至2028-12-12。采购文案简洁提示核对目的地限制，不声称熟制可以绕过限制。

### 已下载并看图的CC实拍

[Commons文件页：Kkomak (Tegillarca granosa) 2.jpg](https://commons.wikimedia.org/wiki/File:Kkomak_(Tegillarca_granosa)_2.jpg)，2000×1711，作者韩国国立国语院（국립국어원），**CC BY-SA 2.0 KR**。Commons记载EXIF拍摄日2013-12-05，2024-01-11审查员确认原站许可证。

- 原图：https://upload.wikimedia.org/wikipedia/commons/e/ec/Kkomak_%28Tegillarca_granosa%29_2.jpg
- 原机构页：https://krdicmedia.korean.go.kr/front/search/searchResultView.do?file_no=259829 （本次未另打开；许可依据为Commons已审文件页）。
- 许可证：https://creativecommons.org/licenses/by-sa/2.0/kr/
- 本地原图：`/Users/kennethj.michael/.agent-reach/captures/distinctive-20261106/kkomak-reference.jpg`
- Manifest：`/Users/kennethj.michael/.agent-reach/captures/distinctive-20261106/sanmen-bloodcockle-image-manifest.json`
- 建议署名：`국립국어원 / Wikimedia Commons / CC BY-SA 2.0 KR`。裁剪、转WebP须标修改，并保留适用的相同方式共享许可。
- 建议图注：`泥蚶同种实拍参考 · 非三门产地实拍，不用于产地或熟度鉴别。`

实看为白底整盘带壳泥蚶，既有闭壳也有开壳，壳肋与肉体清晰，无血水画面。上方留白较多，可居中偏下裁图；不能称三门现场拍摄、三门传统菜或已验证安全熟度。

浙江在线三门报道有实拍，但明确“未经许可不得转载或镜像”，不下载作网站素材。博物馆干贝壳图为CC BY-NC，不选用。另有Commons宁波Blood Cockles.jpg（Taishonambu，2025-04-21，CC BY-SA 4.0）未看原图、不选用。

## 保留候选：中山东升脆肉鲩

[中山市市场监管局《地理标志产品“中山脆肉鲩”的知识产权保护之路》](https://www.zs.gov.cn/zjj/zscqxzcfgsxx/zscqgzdt/content/post_2582520.html)，2026-01-14。公开HTTP全文已读：它是草鱼经地方脆化工艺形成的特殊养殖状态，地域与口感差异成立，不是新鱼种。文内水温25℃以上、110—130天脆化喂养属于生产过程，不能推导大暑最佳赏味。

可保留id `zhongshan-dongsheng-crisp-grass-carp`，广东中山·小榄（原东升区域），特色为蚕豆脆化草鱼、爽脆耐煮。既有FOODS无脆化草鱼。没有自然短季证据，也未核实全年每月供货；本轮不编造月份、不进入节气推荐。文内图片来自中山发布，未核实开放许可，不下载。

## 条件候选：霞浦小白章（望潮）

[宁德网／霞浦融媒《霞浦十大时令菜》](https://www.ndwww.cn/xspd/xpxw/2023/0515/255908.shtml)，2023-05-15。公开HTTP全文已读，酒炖小白章位于“夏季”部分；文内为生活在滩涂、当地又称望潮的章鱼，口感紧实Q弹。可证明地方夏季菜，但没有明确月份、窄鲜捕高峰或拉丁物种名，不能由俗名自动归为某种短蛸。既有FOODS无望潮/小白章；暂不编码，图片授权未核，不下载。

## 读取与变更边界

现有FOODS使用既有audit-reader加载核对，目标青鱼、三文鱼和毛蚶已读完整条目。只新增本研究文档；公开HTTP、PDF、照片及manifest存于 `~/.agent-reach/captures/distinctive-20261106/`。没有改JS、资产配置、测试或发布状态，没有跑整测。
