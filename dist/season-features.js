/*
 * One editorial lead per solar term. Indexes follow SOLAR_TERM_NAMES.
 * These are preferences, never season overrides: the chosen food must still
 * pass the source-backed date window and the public-image eligibility gate.
 * Original evidence, provenance and cooking instructions remain on each food.
 */
(function(root){
 'use strict';
 root.SEASON_FEATURES={
  0:{foodId:'yanshi-fresh-yintiao',line:'寒到深处，地下还藏着清脆。',intro:"霜后能挖的银条，到了偃师冬天的菜摊还是一把清脆。宝应的慈姑则把粉糯藏在球茎里。挑新挖鲜货时，一味看细长嫩茎，一味看完整外皮，厨房里的火候也各有安排。",readings:["yanshi-fresh-yintiao", "cigu"],reason:'像一把细白小枝，吃的是地下嫩茎。小寒前后的新挖银条，焯熟拌姜醋，清脆里带淡甜。'},
  1:{foodId:'bishan-ercai',line:'小芽抱成团，寒冬也有嫩意。',intro:"浙江沿海的血蚶，地方吃食记述惦记小寒至大寒的肥满。连江的海带苗则取冬季嫩苗。前者要核对具体蚶种和来处，后者要问鲜苗状态，这一餐可以沿着不同的生长阶段找冬鲜。",readings:["sanmen-winter-blood-cockle", "lianjiang-great-cold-kelp-seedlings"],reason:'一颗菜抱着一圈小芽，掰开就是一口一口。白水煮透，尝芽体的柔脆，再蘸一点辣。'},
  2:{foodId:'jiaozhou-kailing-suo',line:'河口冰开，鲜味先到。',intro:"腾冲的棕包还没露出花穗，河口的开凌梭等着冰解开春。立春的两口鲜，一口藏在棕皮里，一口跟着河口时节走。去菜市问嫩穗的发育，去鱼摊问产地与到货，春天才有具体模样。",readings:["tengchong-late-winter-palm-bud", "jiaozhou-kailing-suo"],reason:'“开凌”说的是冰解开春的短季。蒸熟后拨开银灰鱼皮，里面是细白、润泽的鱼肉。'},
  3:{foodId:'wuding-jinquehua',line:'雨落花开，春天可以炒着吃。',intro:"云南的春花各有进厨房的时刻。武定金雀花赶着三月的小花季，棠梨花也要趁花期处理入菜。买明确供食的花，问清是否已经焯泡，再让鸡蛋或清淡调味接住花香与微苦。",readings:["wuding-jinquehua", "tanglihua"],reason:'花形像小雀，鲜黄花瓣也能入菜。三月鲜花配鸡蛋炒熟，柔软里带清香，尾味微苦。'},
  4:{foodId:'yongsheng-fresh-kapok',line:'木棉开红了，锅里却是另一副模样。',intro:"永胜木棉把高枝开红，入菜取经过处理的花蕊。沿海海肠则从另一处带来鲜味，清理后充分加热，吃柔韧的口感。惊蛰翻这一页，可以先认识两种外形特别、处理也讲究的食材。",readings:["yongsheng-fresh-kapok", "yantai-haichang"],reason:'红木棉入菜，取的是细束花蕊。焯熟漂洗后炒豆豉蒜苗，滑脆里还留着一点微涩。'},
  5:{foodId:'fengqing-xinhua-walnut-flowers',line:'果仁还早，先吃树上的花。',intro:"凤庆新华乡的核桃树先垂下雄花，果仁还要继续等。北方榆钱也在春天形成一串串嫩果。树上刚长出的部分进入餐桌，核桃花要焯泡去苦，榆钱先择净，两味都值得问一声采摘日期。",readings:["fengqing-xinhua-walnut-flowers", "chengde-spring-equinox-elm-samaras"],reason:'核桃还没结仁，雄花已成一串春菜。取花茎焯泡去苦，再和腊肉炒出一口脆爽。'},
  6:{foodId:'eryuan-haicaihua',line:'花浮水面，鲜味藏在长茎里。',intro:"睦洲黄沙蚬在清明前后惦记的是肥度，崇明马兰头赶的是嫩梢。江里的贝与田间的绿，一起把春天带上桌。蚬汤彻底煮熟后再尝咸度，马兰头焯熟、沥干再拌，处理妥当才能吃清爽。",readings:["jiangmen-muzhou-qingming-huangsha-clam", "chongming-malan-head"],reason:'水上开着白花，餐桌上多吃嫩茎与花葶。和鸡蛋炒熟，先觉滑嫩，咬下去又有轻脆。'},
  7:{foodId:'cinenya',line:'趁嫩叶还没舒展，接住春天的苦香。',intro:"四月陇川的蚂蚁蛋来自地下蚁巢，宁海白枇杷则等树上果实成熟。一个看地方供食品类与鲜收批次，一个看果皮完整和熟度。沿着谷雨找鲜，问来处往往能比只认一个名字多知道一些。",readings:["longchuan-spring-ant-brood", "ninghai-white-loquat"],reason:'嫩叶尚未展开，芽体厚实又带一点苦。去掉硬苞焯熟，蘸酱吃，最容易认识它的肉质口感。'},
  8:{foodId:'jianshui-caoya',line:'水田里抽出一口乳白的鲜。',intro:"岱山黄泥螺过谷雨始发，立夏采集最旺，到了芒种春汛便收尾。建水草芽也进入五月起的夏季鲜货线索。薄壳下的软体与乳白嫩尖都怕处理含糊，先认原料状态，再充分做熟。",readings:["daishan-spring-yellow-mudsnail", "jianshui-caoya"],reason:'像小象牙的乳白嫩尖，是香蒲类植物的嫩根状茎。炒鸡丝，柔脆多水，清甜很轻。'},
  9:{foodId:'shanzhou-green-wheat-nianzhuan',line:'麦子还青，已经值得开火。',intro:"小满的新麦已经饱满，颜色还留着青，陕州人把它磨成碾转。库车小白杏则要等果肉成熟柔嫩。一个问麦仁何时采收，一个问果子熟到哪一步，同是赶鲜，等的是两种不同状态。",readings:["shanzhou-green-wheat-nianzhuan", "kuche-xiaobaixing"],reason:'青麦仁趁饱满碾成短碎条，叫作碾转。和鸡蛋炒热，尝新麦的谷物甜与一点嚼劲。'},
  10:{foodId:'tonghai-fresh-sour-quince',line:'把鲜果的酸，慢慢煮进汤里。',intro:"巴中春柞蚕蛹到六月中旬鲜收，乐清海瓜子在梅季肉肥。蚕蛹有春秋批次，小薄壳又跟着入梅出梅改变进度。先说明想找当季春蛹或乐清湾鲜贝，再问采收和处理日期。",readings:["bazhong-spring-oak-silkworm-pupae", "yueqing-meiyu-rainbow-clam"],reason:'这味木瓜以酸香见长，鲜果少量切片入鸡汤。果片煮软，酸味融进汤里，吃法也换个方向。'},
  11:{foodId:'harbin-fresh-honeyberry',line:'日光最长，果汁也染上深紫。',intro:"日光最长时，哈尔滨蓝靛果赶到六月中下旬的成熟期，大连海胆也有夏季鲜货线索。皮薄的果子轻洗鲜尝，海胆黄保持冷链、充分蒸熟，一软一细腻，都值得用清淡吃法认识。",readings:["harbin-fresh-honeyberry", "dalian-zihaitan"],reason:'蓝紫小果细长，轻咬却流出紫红果汁。六月中下旬尝成熟鲜食品种，酸甜都很鲜明。'},
  12:{foodId:'chenghai-baoke',line:'这一盘“米”，带着海风的鲜。',intro:"高青林地的蝉若虫在盛夏出土，台孙村的地方记录把七月初列作产量高峰。潮汕薄壳也接近七八月肥美时。金蝉要看羽化前状态，薄壳米要问鲜剥日期，暑天尝鲜先把处理安排好。",readings:["gaoqing-taisun-jinchan", "chenghai-baoke"],reason:'薄壳米是剥出的细小贝肉。七八月肥美时，配金不换炒熟，一粒粒鲜甜、柔嫩带弹。'},
  13:{foodId:'xishuangbanna-wood-milk-fruit',line:'果子挤上树干，盛夏另有酸甜。',intro:"盐鸿把细小贝肉剥成薄壳米，西双版纳的木奶果沿着树干成串成熟。一个配金不换炒熟，一个剥开果皮慢慢鲜尝。暑气最盛，菜市里的贝肉与树上熟果各有一段值得等的鲜期。",readings:["chenghai-baoke", "xishuangbanna-wood-milk-fruit"],reason:'果实一串串贴着枝干长，剥开是浅色软嫩果肉。七八月成熟，尝一口多汁的酸甜。'},
  14:{foodId:'jitoumi',line:'秋还浅，水乡先剥出一碗鲜。',intro:"灌云豆丹约养到五龄收取，夏季鲜收跟着放养批次走。苏州鸡头米也开始从芡实果里一颗颗剥出。初秋的鲜味未必已经老熟，买豆丹问处理状态，买鲜鸡头米问剥壳日期。",readings:["guanyun-summer-doudan", "jitoumi"],reason:'芡实果里手剥出的鲜粒，像小颗白珠。清氽后滑润微弹，中心略糯，和干芡实是两种口感。'},
  15:{foodId:'ganbajun',line:'暑意将退，雨季菌香仍浓。',intro:"暑意渐退，云南干巴菌仍沿着雨季出菌，霍山阳荷嫩苞则带来九月鲜采线索。菌丛里先挑净松针，嫩苞剥去老片再切。一味浓香入饭，一味温和姜香入炒肉，山林风味各有落点。",readings:["ganbajun", "huoshan-yanghe"],reason:'灰褐菌体层层分叉，炒熟有腌肉似的浓香。雨季鲜菌撕净杂叶，配青椒炒饭，越嚼越有味。'},
  16:{foodId:'huoshan-yanghe',line:'贴地的紫红花苞，藏着温和姜香。',intro:"霍山阳荷的紫红嫩苞贴地长，九月有鲜采记录。福州红鲟则在秋季食单里留下另一口鲜。选嫩苞看苞片与切口，选水产核对来源和鲜度，清脆与鲜香可以沿着产地慢慢找。",readings:["huoshan-yanghe", "fuzhou-bailu-red-xun"],reason:'姜科植物贴地长出的紫红嫩苞，层层苞片抱紧。切片炒肉，脆口里有比生姜柔和的辛香。'},
  17:{foodId:'bayuegua',line:'山果自己开了口，秋天便露出甜。',intro:"秋分翻到苏州的鲜鸡头米，还能接住八月至十月初的采收线索。山里的八月瓜则等果皮成熟开裂。前者吃滑弹的鲜粒，后者舀柔软果瓤，鲜货与干货、青果与熟果都值得分清。",readings:["jitoumi", "bayuegua"],reason:'熟果会自然裂开，露出黑籽密布的白色果肉。舀一口软滑的甜，慢慢吐籽，尝它的成熟。'},
  18:{foodId:'ximeng-bamboo-worm',line:'竹节里的秋味，熟后才露出香。',intro:"西盟竹虫的地方鲜收期从九月中旬接到十月底，临潼火晶柿子也等果子熟软。竹节里的幼虫要充分熟制，柿子要确认熟度再吃。一个问鲜收，一个问后熟，秋天的好味道各有等法。",readings:["ximeng-bamboo-worm", "lintong-huojing-shizi"],reason:'竹节里长大的地方鲜味，九月中旬至十月底有鲜货。充分做熟再煎香，外层干香、内里柔软。'},
  19:{foodId:'xunyang-guizao',line:'弯弯的小枝，也能藏住深秋的甜。',intro:"镇康竹瓦村春天育蜂王，到深秋收蜂蛹。旬阳拐枣则等霜降后肉质果梗成熟。山林里这一季的两口特别，蜂蛹先核对幼虫与蛹的组成，拐枣去掉旁边的小硬果，再认识各自的香与甜。",readings:["zhenkang-late-autumn-wasp-brood", "xunyang-guizao"],reason:'弯弯曲曲像小枝，甜味藏在膨大的肉质果梗。霜降后成熟，去掉硬果，慢慢嚼或打成清饮。'},
  20:{foodId:'helan-luosicai',line:'山收秋色，海藏鲜味，初冬的餐桌渐暖。',intro:"贺兰田里挖出一节节螺旋状的螺丝菜，兰州百合拆开便是一片片鲜鳞片。初冬这两味都从地下走来，鲜货需要问采挖和保存。螺丝菜逐节刷净泥土，鲜百合择净后蒸熟，尝清脆与细糯。",readings:["helan-luosicai", "lanzhou-xianbaihe"],reason:'乳白块茎一节节盘成小螺旋，别名草石蚕。十一月的鲜货洗净煮熟，清炒尝它的脆嫩。'},
  21:{foodId:'xiaolan-shiju-huaban',line:'热汤开了，添一把晚秋的花。',intro:"小榄食用菊的地方赏味介绍偏重十一月下旬，宝应慈姑也接上冬季采收。汤快煮好时再放鲜花瓣，慈姑则要给足烧透的时间。一桌冬菜，花瓣留轻香，地下球茎留粉糯。",readings:["xiaolan-shiju-huaban", "cigu"],reason:'食用菊的鲜花瓣，十一月下旬正好入汤。临起锅前煮熟，柔嫩清香，和鸡肉相互陪衬。'},
  22:{foodId:'baoshan-liangcui-emblica',line:'深冬的一口酸，后面还跟着甘。',intro:"丽江华坪、永胜的冬季街市记述里有爬沙虫，保山晚熟亮脆余甘子则要等到十二月中下旬。一个核对供食来源和处理，一个看具体品种与成熟度。山水之间的冬味，值得把地名和时段一起记。",readings:["lijiang-winter-dobsonfly-larvae", "baoshan-liangcui-emblica"],reason:'保山晚熟“亮脆”，十二月中下旬才熟。浅绿果肉紧实，先酸涩，细嚼后回甘，值得慢尝。'},
  23:{foodId:'shantou-haojiang-liqian-dongjingwan',line:'长夜里，等一锅小丸慢慢透亮。',intro:"浙江沿海墨鱼接上十二月至春节的冬鲜线索，潮汕里前东京丸则在长夜里煮进糖水。鲜墨鱼切片沥干、炒熟即出锅，晒好的小丸要煮到透。冬至这一餐，海味与薯粉各有自己的火候。",readings:["donghai-dongzhi-cuttlefish", "shantou-haojiang-liqian-dongjingwan"],reason:'东京薯磨粉、摇丸、晒干，成了形似西米的小丸。冬至配姜薯红糖煮透，软糯的甜留给长夜。'}
 };
})(typeof window==='undefined'?globalThis:window);
