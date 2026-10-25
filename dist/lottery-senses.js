/* Editorial tags from existing descriptions. Columns: source fingerprint, food taste,
 * recipe seasoning taste, prepared texture, serving method, observable features.
 * Features are not popularity, personal familiarity, price or safety ratings.
 * Original food data and recipe/allergen checks stay unchanged. */
(function () {
  'use strict';
  const rows = {
    "nanhu-ling": ["59030f80","sweet","","soft","boil","没有明显弯角的水乡菱；熟肉略带粉感"],
    "jitoumi": ["704025ec","sweet","","soft tender chewy","soup","鲜粒外层滑润，咬下有轻弹感"],
    "foshougua-miao": ["acac0329","sweet","","crisp tender chewy","stirfry","卷须、细茎和嫩叶呈现不同质地"],
    "cinenya": ["f8acf86c","bitter","salty","crisp","boil","焯熟后仍带微苦"],
    "cigu": ["e5134f66","sweet bitter","salty umami","soft","soup","熟块根粉糯，留有轻微回苦"],
    "dier": ["aa99aa46","","umami","tender","soup","薄片煮熟后柔滑"],
    "zengcheng-caixin": ["a11f70a1","sweet","","crisp tender","boil",""],
    "hongshan-caitai": ["e142f55","sweet","","crisp tender","stirfry",""],
    "tanglihua": ["29c111e6","bitter","sour spicy","tender","boil","以花入菜；处理后仍保留微苦"],
    "kucihua": ["f3f4b667","bitter","salty umami","tender","stirfry","以花入菜；微苦和豆豉相配"],
    "pucai": ["384ebc4b","sweet","salty umami","crisp tender","soup","洁白水生嫩芯"],
    "juhuanao": ["8689975c","bitter","","tender","soup","草本气味较明显；嫩叶带轻微回苦"],
    "honghu-oudai": ["7cdd9e1","sweet","sour spicy","crisp","stirfry",""],
    "houtui-cai": ["bbba2a18","bitter","umami","crisp tender","stirfry","嫩茎和叶端有不同质地"],
    "yanchi-huanghuacai": ["fc04aa1f","","salty umami","chewy","soup","花蕾炖后柔韧"],
    "cizhousun": ["2b7456b2","","sour","crisp","boil",""],
    "bayuegua": ["2709080c","sweet","","tender","fresh","果皮自然开裂；白色滑润果肉含较多黑籽"],
    "ruanzao-mihoutao": ["9c5bcedd","sour sweet","","tender","fresh","薄皮无毛，可连皮吃"],
    "shajiguo": ["e95de013","sour","","","fresh","小果酸味鲜明"],
    "cili": ["b04eaf70","sour","","juicy","fresh","带刺果皮需先处理；酸涩特征鲜明"],
    "yangxin-huhao": ["faf24f3","sweet","salty","crisp","stirfry","草本气味鲜明"],
    "bishan-ercai": ["59dfb885","sweet bitter","spicy","crisp tender","boil","芽体成簇抱合"],
    "congjun": ["ce716c51","umami","","tender chewy","soup","菌盖和菌柄呈现不同质地"],
    "rugao-takecai": ["cff6ea0c","sweet","","tender","stirfry",""],
    "eryuan-haicaihua": ["db8a8d9d","sweet umami","","tender crisp","stirfry","嫩茎熟后既滑又脆"],
    "xunyang-guizao": ["b28b39f4","sweet","","tender","fresh","入口的是膨大果梗；果梗打浆过滤成清饮"],
    "dalian-zihaitan": ["6ad371b8","salty umami","","tender","steam","海胆黄成瓣，质地细腻"],
    "atushi-winter-lamb": ["204f873","umami","","tender chewy","soup",""],
    "ganbajun": ["8a3b5aaf","umami salty sweet","","chewy","stirfry","菌体层叠；浓香带腌肉般的气息"],
    "yangnaiguo": ["294e22e0","sour sweet","salty spicy","juicy tender","fresh","小果薄皮大核；盐辣子与酸果搭配"],
    "juema": ["4dfb3f65","sweet","","soft","soup","小块鲜根煮出粉糯质地"],
    "yantai-haichang": ["571ffb3b","salty umami","","crisp chewy","stirfry","管状食材切段；熟后脆弹"],
    "wuding-jinquehua": ["f0b36179","sweet bitter","","tender chewy","stirfry","金黄花朵入菜；花瓣与花萼质地有别"],
    "tongxiang-zhuili": ["6022ff55","sweet sour","","tender juicy","fresh",""],
    "huoshan-yanghe": ["a62b156d","spicy","","crisp chewy","stirfry","紫红嫩苞入菜；姜科植物的辛香"],
    "kuche-xiaobaixing": ["16478a1b","sweet sour","","tender juicy","fresh",""],
    "jiande-chuncai": ["4d3d68dd","sweet umami","","tender","soup","一芽一叶外裹清亮胶质"],
    "gaochun-liuyuehuang": ["1298fd4c","sweet umami","sour","tender","steam","薄壳，蟹黄柔软"],
    "chenghai-baoke": ["29c5b84c","sweet salty umami","","tender chewy","stirfry","细小贝肉配金不换香气"],
    "zhenlai-jiaobai": ["72014e54","sweet umami","","crisp","stirfry",""],
    "hanshou-yubiou": ["b55227ae","sweet","sour","crisp","stirfry",""],
    "shazhou-zhugengqin": ["8841a68f","sweet","","crisp tender","stirfry","竹节状茎身；水芹草本香"],
    "liyang-baixin": ["b3dc5a36","sweet","","crisp","stirfry",""],
    "conghua-dajiecai": ["2d8e59c8","sweet bitter","","tender crisp","soup",""],
    "dalian-haimaxian": ["f6f91c0c","umami sweet","","chewy crisp","steam","细条海藻入馅；软韧中有轻脆感"],
    "jinjiang-toushui-zicai": ["de7dfa1b","salty umami","","tender","soup",""],
    "zhuhai-hechong": ["d075478","umami sweet","","tender","steam","条状食材蒸蛋后细软"],
    "lintong-huojing-shizi": ["534eea96","sweet","","tender","fresh","软熟果肉可直接舀食"],
    "lyg-shaguang-fish": ["c1ba3597","sweet umami","","tender","soup",""],
    "minqing-tanxiang-olive": ["8b882762","sweet","","crisp chewy","fresh","先涩后回甘；草本香与纤维咀嚼感"],
    "ninghai-changjie-razor-clam": ["984551f5","sweet salty umami","","tender chewy","steam",""],
    "jintang-fresh-morel": ["b7bcdc39","umami","","tender chewy","soup","蜂窝状菌盖；菌盖柔韧、菌柄细嫩"],
    "ninghai-white-loquat": ["e3cc42c2","sweet","","tender juicy","fresh",""],
    "yunan-seedless-huangpi": ["1e6aa84c","sour sweet","","juicy tender","fresh",""],
    "xishuangbanna-wood-milk-fruit": ["b855ee2f","sour sweet","","juicy tender","fresh",""],
  };
  const list = text => text ? text.split(' ') : [];
  for (const [id, [signature, tastes, recipeTastes, textures, cooking, features]] of Object.entries(rows)) {
    if (window.LOTTERY_PROFILES[id]) window.LOTTERY_PROFILES[id].senses = {
      signature, tastes:list(tastes), recipeTastes:list(recipeTastes), textures:list(textures),
      cooking:list(cooking), features:features ? features.split('；') : []
    };
  }
})();

Object.assign(window.LOTTERY_PROFILES['rongxian-shatian-pomelo'],{senses:{signature:'2f5fb1d7',tastes:['sweet'],recipeTastes:[],textures:['crisp','juicy'],cooking:['fresh'],features:['容县地方地理标志柚类','霜降前后有采收和成熟记录']}});
Object.assign(window.LOTTERY_PROFILES['weixian-frost-radish'],{senses:{signature:'5274461d',tastes:['sweet','spicy'],recipeTastes:[],textures:['crisp','juicy'],cooking:['fresh','stirfry'],features:['寒亭潍县地方青萝卜','不同品系的辛香和内芯颜色有差异']}});

(function(){const rows={"jianou-zhuilli":["53c1a414","sweet","","soft","soup","尖小的栗果；熟后粉糯"],"chongming-baibiandou":["35620feb","sweet","","tender","boil","熟荚柔嫩；不可当作生脆蔬菜"],"chongming-xiangsu-yu":["63e64c36","sweet","","soft","steam","剥皮后酥糯绵密"],"xiangyin-santang-jiaotou":["7a64912f","spicy","salty umami","crisp","stirfry","鲜鳞茎有葱蒜样辛香"],"wenzhou-pancai":["4ae86f03","sweet","","tender soft","soup","圆盘般根块；熟后柔软"]};const list=s=>s?s.split(" "):[];for(const [id,[signature,tastes,recipeTastes,textures,cooking,features]] of Object.entries(rows)){window.LOTTERY_PROFILES[id].senses={signature,tastes:list(tastes),recipeTastes:list(recipeTastes),textures:list(textures),cooking:list(cooking),features:features?features.split("；"):[]};}})();

(function(){const rows={
  "helan-luosicai":["fe64daa4","sweet","","crisp","boil stirfry","螺旋节状的白色地下块茎"],
  "lanzhou-xianbaihe":["cd00197a","sweet","","soft tender","steam stirfry","厚实的鲜鳞片；与干百合区分"],
  "binchuan-renong1-yuganzi":["e3870e9d","sour bitter sweet","","crisp","fresh","先酸涩后回甘；热农1号特定品种"],
  "xiaolan-shiju-huaban":["10abfeb0","sweet","salty umami","tender","soup","食用菊鲜花瓣；非茶花或菊花脑"],
  "taitung-luoshen-calyx":["c1c1b4c7","sour","sweet","tender chewy","boil soup","去籽后肥厚红色花萼；非花瓣"],
  "luoping-hongguoshen":["baf94a11","sour sweet","","juicy tender","fresh","罗平成熟红果；果肉轻微沙脆"],
  "heshi-xianfenge":["c8cc88b6","sweet","salty umami","soft","soup","鲜葛块煮熟后粉糯"],
  "xikou-xindongsun":["96a740f8","sweet","salty","crisp tender","boil stirfry","溪口新挖冬笋"],
  "rongan-jingju":["e6cd6e12","sour sweet","","crisp juicy","fresh","脆蜜与滑皮金桔的地方品种专题"],
  "sanmen-qingxie":["2dbb3924","umami salty","","tender chewy","steam","三门湾青蟹；秋季肥美期延至十一月"],
  "huadu-jingtang-lotusroot":["6acf7c77","sweet","","crisp","stirfry","冬至前后采收的花都京塘莲藕；生食脆爽、熟后松化"],
  "ningbo-youdai":["807f28f9","umami salty","","tender","steam","冬至前后宁波北洋油带；鱼肉细嫩、脂香较丰"],
  "bomi-winter-muli":["2c2b539f","sweet","","juicy","fresh","波密冬至前后成熟晚熟梨；来源只支持汁水足与糖分较高"],
  "xinhui-winter-after-mandarin":["13ea8b2b","sweet","","juicy","fresh","冬至后留树采收的新会柑；迟采批次，不是独立品种"],
  "wuhua-longcun-mountain-sweet-potato":["3f8bcfbc","sweet","","soft tender","steam","龙村冬至后起薯报道；基地品种普薯32号"],
  "minhou-wenxi-juyou":["50af7a7c","sweet","","juicy","fresh","闽侯汶溪桔柚冬至前后入采摘期，延续至次年一月中旬"],
  "hengyang-zhuhui-golden-pomelo":["61e8aa00","sweet","","juicy tender","fresh","珠晖黄金贡柚；报道描述柚甜多汁并带清新柑橘香"],
  "xinhui-yamen-tianshui-radish":["160bac7c","sweet","","tender","boil","冬至前后新会崖门甜水萝卜；地方报道描述清甜爽口、滑嫩少渣"],
  "gejiu-cinaobao":["e41782cb","bitter fresh","salty umami","tender","boil stirfry","食用楤木嫩芽；野生同形植物需要谨慎鉴别"],
  "conghua-lutian-bitter-shoot":["c5a36bee","bitter umami","salty","crisp tender","boil stirfry soup","从化吕田春季苦笋；通用竹笋图不作竹种鉴别"],
  "wulong-taiwan-long-mulberry":["53d473ee","sweet","","juicy tender","fresh","武隆长坝台湾长桑果；采摘窗口约4月中旬至5月中旬"]
};const list=s=>s?s.split(" "):[];for(const [id,[signature,tastes,recipeTastes,textures,cooking,features]] of Object.entries(rows)){window.LOTTERY_PROFILES[id].senses={signature,tastes:list(tastes),recipeTastes:list(recipeTastes),textures:list(textures),cooking:list(cooking),features:features?features.split("；"):[]};}})();

(function(){window.LOTTERY_PROFILES['yaoan-edible-rose'].senses={signature:'473b5187',tastes:['floral','sweet'],recipeTastes:[],textures:['soft'],cooking:['steam'],features:['姚安光禄食用玫瑰花瓣；食用品种须与观赏玫瑰区分']};})();
(function(){window.LOTTERY_PROFILES['yongjia-hesheng-red-persimmon'].senses={signature:'3027d6d',tastes:['sweet'],recipeTastes:[],textures:['soft','juicy'],cooking:['fresh'],features:['永嘉鹤盛红柿；立冬前后采收，成熟与脱涩状态需核对']};})();
(function(){window.LOTTERY_PROFILES['huangbohai-yingzhuaxia'].senses={signature:'738a1d80',tastes:['umami','sweet'],recipeTastes:['salty'],textures:['tender','soft'],cooking:['boil'],features:['黄渤海鹰爪虾；大连称灯笼红虾、山东称蛎虾']};})();
(function(){window.LOTTERY_PROFILES['xuanzhou-shuidong-cherry'].senses={signature:'92fffbbc',tastes:['sweet'],recipeTastes:[],textures:['juicy'],cooking:['fresh'],features:['宣州水东鲜樱桃；四月下旬开采，批次和成熟度须核对']};})();
(function(){window.LOTTERY_PROFILES['hulin-liuhao-shoot'].senses={signature:'2e02dec2',tastes:['herbal'],recipeTastes:[],textures:['fibrous'],cooking:['cold'],features:['虎林柳蒿芽；五月中下旬采收，须核对俗名与来源']};})();

(function(){window.LOTTERY_PROFILES['shidian-autumn-longzhu-shoot'].senses={signature:'923f809d',tastes:['sweet'],recipeTastes:[],textures:['crisp'],cooking:['stirfry'],features:['施甸立秋后龙竹笋；普通龙竹须焯熟，不与甜龙竹混淆']};})();

(function(){window.LOTTERY_PROFILES['wenchuan-qingcui-plum'].senses={signature:'4f242227',tastes:['sweet'],recipeTastes:[],textures:['crisp','juicy'],cooking:['fresh'],features:['汶川绵虒草坡青脆李；报道记载七月集中采收上市']};})();

(function(){window.LOTTERY_PROFILES['minhou-baisha-late-longan'].senses={signature:'efc35729',tastes:['sweet'],recipeTastes:[],textures:['juicy'],cooking:['fresh'],features:['闽侯白沙上岐晚熟龙眼，九月上中旬白露前后采摘']};})();
(function(){window.LOTTERY_PROFILES['longlin-march-plum'].senses={signature:'424ef072',tastes:['sour','sweet'],recipeTastes:[],textures:['crisp'],cooking:['fresh'],features:['隆林三月李；2026年四月下旬上市旺季的地方报道线索']};})();
(function(){window.LOTTERY_PROFILES['sanzhi-red-sheath-jiaobai'].senses={signature:'108ab024',tastes:['sweet'],recipeTastes:['umami'],textures:['crisp','tender'],cooking:['stirfry'],features:['新北三芝赤壳茭白筍；地方资料记录十至十一月产季','茭白嫩茎不是竹笋']};})();

(function(){window.LOTTERY_PROFILES['taiwan-jialiao-bream'].senses={signature:'e6edecf1',tastes:['umami'],recipeTastes:['salty'],textures:['tender','soft'],cooking:['steam'],features:['台湾农业部门记录立冬前后北部海域可捕获嘉鱲','捕捞鱼与养殖真鯛分别核对']};})();
(function(){window.LOTTERY_PROFILES['chiayi-budai-douzai-fish'].senses={signature:'41551029',tastes:['umami'],recipeTastes:['salty'],textures:['tender'],cooking:['panfry'],features:['台湾农业部资料列作小雪时令渔获','豆仔鱼为地方俗名，物种未由来源鉴定']};})();

(function(){window.LOTTERY_PROFILES['bomi-gutong-crisp-red-plum'].senses={signature:'9ac3505a',tastes:['sweet'],recipeTastes:[],textures:['crisp','juicy'],cooking:['fresh'],features:['2026年10月13日报道古通村脆红李进入采摘季','报道描述果肉脆爽、汁多离核；非本站试吃']};})();
(function(){window.LOTTERY_PROFILES['yuanmou-yangjie-autumn-shatangju'].senses={signature:'c766bbcc',tastes:['sweet','sour'],recipeTastes:[],textures:['tender','juicy'],cooking:['fresh'],features:['元谋羊街镇政府于2026-10-16记录陆续成熟上市','报道形容细嫩化渣、汁水充盈；非本站试吃']};})();
(function(){window.LOTTERY_PROFILES['ankang-yinghu-daxing-loquat'].senses={signature:'97ede11b',tastes:['sweet','sour'],recipeTastes:[],textures:['tender','juicy'],cooking:['fresh'],features:['安康汉滨瀛湖“大五星”枇杷，五月中下旬至六月初成熟','生成示意图不用于品种鉴别']};})();
(function(){window.LOTTERY_PROFILES['wanning-damao-baitangying-lychee'].senses={signature:'96ef1f96',tastes:['sweet'],recipeTastes:[],textures:['juicy','tender'],cooking:['fresh'],features:['万宁大茂白糖罂荔枝；地方资料记载每年四月底至五月初上市','鲜果与冷冻果、产地与采摘批次须分别核对']};})();
(function(){window.LOTTERY_PROFILES['qiongshan-sanmenpo-xiantaoli'].senses={signature:'1f3256b6',tastes:['sweet'],recipeTastes:[],textures:['juicy','tender'],cooking:['fresh'],features:['海南琼山三门坡仙桃荔；2025、2026 年资料记录五月上旬上市','大果外形不能单独证明产地或品种']};})();
(function(){window.LOTTERY_PROFILES['hubei-ejiao4-summer-jiaobai'].senses={signature:'22c97565',tastes:['sweet'],recipeTastes:['savory'],textures:['crisp','tender'],cooking:['stir-fried'],features:['双季茭白鄂茭4号夏茭，资料记载五月中旬上市','通用茭白插画不用于品种鉴别']};})();
(function(){window.LOTTERY_PROFILES['keelung-xiaojuan'].senses={signature:'baf6aeb6',tastes:['umami'],recipeTastes:['salty'],textures:['tender','chewy'],cooking:['stir-fried'],features:['台湾农业部小暑节气资料列有基隆北方外海小卷','小卷是俗名，来源未鉴定到具体物种']};})();
(function(){window.LOTTERY_PROFILES['tianjin-huangya-cabbage'].senses={signature:'cc310d1d',tastes:['sweet'],recipeTastes:['salty'],textures:['crisp','tender'],cooking:['stirfry'],features:['天津小寒黄芽菜食俗；黄芽菜是大白菜旧称','传统覆盖后的菜心被资料描述为更脆嫩']};})();
(function(){window.LOTTERY_PROFILES['qingdao-shazikou-li-xia'].senses={signature:'647a2b82',tastes:['umami','sweet'],recipeTastes:['salty'],textures:['tender'],cooking:['stir-fried'],features:['青岛沙子口春汛海捕蛎虾，俗名与学名需买前核对','活鲜和离水死亡产品的状态、风味与价格不同']};})();
(function(){window.LOTTERY_PROFILES['qujing-shasong-tip'].senses={signature:'c0bd82d7',tastes:['umami'],recipeTastes:['salty'],textures:['tender'],cooking:['stir-fried'],features:['曲靖市场春季嫩梢，植物种未由来源鉴定','2023与2026年地方报道均有春季鲜货线索']};})();
(function(){window.LOTTERY_PROFILES['miaoli-gongguan-fresh-jujube'].senses={signature:'1424342f',tastes:['sweet'],recipeTastes:[],textures:['crisp'],cooking:['fresh'],features:['苗栗公馆鲜红枣，农业部资料以大暑作为时令线索','鲜果主产期延至八月上旬，与红枣干状态不同']};})();
(function(){window.LOTTERY_PROFILES['dazu-lichun-winter-vegetable-tip'].senses={signature:'d2e06a4',tastes:[],recipeTastes:['salty'],textures:['tender'],cooking:['stirfry'],features:['重庆市档案馆记录大足冬菜原料在立春采割鲜嫩菜尖','鲜菜原料与后续风脱水、盐揉、发酵的冬菜成品不同']};})();
(function(){window.LOTTERY_PROFILES['yunxiao-liuye-baigeng-wongcai'].senses={signature:'64b3a0c',tastes:[],recipeTastes:[],textures:['crisp','tender'],cooking:['stirfry'],features:['福建省农业农村厅记录云霄柳叶白梗蕹菜立春后上市','地方报道描述鲜、脆、嫩；不代表本站试吃']};})();
(function(){window.LOTTERY_PROFILES['shexian-qizili-hickory'].senses={signature:'52f01529',tastes:[],recipeTastes:['sweet'],textures:[],cooking:['boil'],features:['歙县杞梓里山核桃白露开杆，地方报道记采收约半个月','报道引述当地介绍称粒大壳薄、香味醇厚；未作本站试吃']};})();
(function(){window.LOTTERY_PROFILES['chongming-malan-head'].senses={signature:'71bf4368',tastes:[],recipeTastes:[],textures:['tender'],cooking:['stirfry'],features:['崇明地方资料记马兰头清明前后吃口最佳','马兰头嫩梢可拌香干；地方俗称蟛蜞头']};})();
(function(){window.LOTTERY_PROFILES['taiwan-daxue-mullet'].senses={signature:'d986813c',tastes:[],recipeTastes:['savory'],textures:[],cooking:['panfry'],features:['台湾农业部记载小雪至大寒为乌鱼汛期','来源未提供统一日期、物种学名或当年渔获']};})();
(function(){window.LOTTERY_PROFILES['taiwan-daxue-korean-seerfish'].senses={signature:'69c0c9cc',tastes:['umami'],recipeTastes:['salty'],textures:['tender'],cooking:['panfry'],features:['台湾农业部资料将高丽马加鰆列入大雪期间沿海渔汛线索','农业部资料记其秋冬味美；购买时须核对鱼种，不能以土魠俗名替代']};})();
(function(){window.LOTTERY_PROFILES['taiwan-daxue-eastern-striped-bonito'].senses={signature:'52980cdf',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部大雪资料列出台南以南、高雄、澎湖疏齒鰆渔获线索','东方齿鰆资料称春夏较丰、秋季风味较好；大雪不标最佳赏味期']};})();
(function(){window.LOTTERY_PROFILES['gongliao-autumn-japanese-horse-mackerel'].senses={signature:'d12f57d',tastes:['umami'],recipeTastes:['salty'],textures:['tender'],cooking:['roast'],features:['新北渔业部门指出秋分前后东北角日本竹筴鱼油脂较丰','盛产期记为7—9月；本站只突出秋分赏味节点']};})();

(function(){window.LOTTERY_PROFILES['cangyuan-bailu-lincang-macadamia'].senses={signature:'4c3157c1',tastes:[],recipeTastes:[],textures:['crisp'],cooking:['soup'],features:['临沧坚果白露后开采；成熟判据是果壳坚硬、果仁饱满','青皮采收果不是即食状态，具体味型随加工批次变化']};})();
(function(){window.LOTTERY_PROFILES['penghu-bailu-black-pomfret'].senses={signature:'97f647f8',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部白露节气资料列出澎湖北方可捕获黑鲳','来源没有提供物种学名、风味描述或当年渔获']};})();
(function(){window.LOTTERY_PROFILES['pengjia-xiaoshu-mahi-mahi'].senses={signature:'ce977231',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部小暑节气资料列出彭佳屿附近可捕获鬼头刀','来源未提供具体鱼种学名、风味描述或当年渔获']};})();

(function(){window.LOTTERY_PROFILES['suao-dahan-black-skin-marlin'].senses={signature:'144b2f11',tastes:[],recipeTastes:[],textures:[],cooking:['panfry'],features:['台湾农业部小寒、大寒节气资料记载苏澳附近黑皮旗鱼线索','来源未提供学名、风味描述或当年渔获']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lichiu-red-eye-bream'].senses={signature:'67ed1e5e',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部立秋资料列出东北角红目鰱渔获线索','来源未提供具体学名、风味描述或当年渔获']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lichiu-east-sailfish'].senses={signature:'2b4fe192',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部立秋资料列出东部立翅旗鱼渔讯','来源未提供具体学名、风味描述或当年渔获']};})();

(function(){window.LOTTERY_PROFILES['suao-xiaohan-white-skin-sailfish'].senses={signature:'2562dcdb',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部小寒、大寒节气资料均记录苏澳附近白皮旗鱼渔讯','来源未提供学名、批次风味或当年库存']};})();
(function(){window.LOTTERY_PROFILES['sihu-xiaohan-sailfish'].senses={signature:'2562dcdb',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部小寒、大寒节气资料均记录云林四湖外海旗鱼渔讯','来源未提供学名、批次风味或当年库存']};})();
(function(){window.LOTTERY_PROFILES['penghu-qiufen-tuo-mackerel'].senses={signature:'c995a799',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部秋分资料称鰆鱼秋分后洄游台湾海峡','来源列澎湖周围海域土托鰆，未给具体学名或当年渔获']};})();
Object.assign(window.LOTTERY_PROFILES['taiwan-qiufen-tamsui-maga'],{senses:{signature:'d5efa4cd',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部秋分资料列淡水马加渔获线索','来源未鉴定具体物种、风味或当年库存']}});
Object.assign(window.LOTTERY_PROFILES['taiwan-qiufen-lukang-white-belly-seerfish'],{senses:{signature:'56cf08cf',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部秋分资料列鹿港白腹鰆渔获线索','来源未鉴定具体物种、风味或当年库存']}});
Object.assign(window.LOTTERY_PROFILES['taiwan-qiufen-northeast-sailfish'],{senses:{signature:'8de65efa',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部秋分资料列东北部旗鱼渔获线索','来源未提供具体鱼种、批次风味或当年库存']}});
Object.assign(window.LOTTERY_PROFILES['taiwan-qiufen-northeast-black-marlin'],{senses:{signature:'20c63df5',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部秋分资料列东北部黑旗鱼渔获线索','来源未提供具体鱼种、批次风味或当年库存']}});
Object.assign(window.LOTTERY_PROFILES['taiwan-qiufen-northeast-red-emperor'],{senses:{signature:'ff82960a',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部秋分资料列东北部赤宗渔获线索','地方名未由该来源鉴定物种，也未提供批次风味']}});
Object.assign(window.LOTTERY_PROFILES['taiwan-qiufen-northeast-shrimp'],{senses:{signature:'1282140b',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部秋分资料列东北部虾类渔获线索','来源未细分虾种、捕捞方式或当年库存']}});
(function(){window.LOTTERY_PROFILES['taiwan-lichun-mackerel'].senses={signature:'84602e82',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部立春资料记录苏澳以北与高雄外海鲭鱼产卵洄游','来源列出花腹鲭和白腹鲭，但未说明对应渔讯是哪一种']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lichun-hairtail'].senses={signature:'e2bf0237',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部立春资料列出基隆、彰化外海白带鱼渔讯','来源未提供具体物种、风味或当年库存']};})();
(function(){window.LOTTERY_PROFILES['taiwan-jingzhe-tongjian'].senses={signature:'ebeb3c72',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部立春、惊蛰资料记录不同海域“童尖”地方渔获名，食农教育资料另列春分线索','来源未说明对应物种、风味、捕捞批次或当年供应']};})();
(function(){window.LOTTERY_PROFILES['taiwan-jingzhe-jiala'].senses={signature:'35d1792b',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部立春、惊蛰资料记录不同海域“嘉腊”地方渔获名','来源未说明对应物种、风味、捕捞批次或当年供应']};})();
(function(){window.LOTTERY_PROFILES['shiping-shaochong-bailu-walnut'].senses={signature:'4b2dde6d',tastes:['nutty'],recipeTastes:['salty'],textures:[],cooking:['mix'],features:['石屏哨冲核桃白露采收记录','鲜核桃与干燥核桃形态及保存方式不同']};})();
(function(){window.LOTTERY_PROFILES['wenxian-shuangjiang-tiegun-yam'].senses={signature:'5a22aa73',tastes:['sweet','nutty'],recipeTastes:[],textures:['soft'],cooking:['steam'],features:['温县铁棍山药有霜降采挖活动记录','标准描述粉性足、细腻、久煮不散']};})();
(function(){window.LOTTERY_PROFILES['taiwan-qingming-liuqiu-bullet-bonito'].senses={signature:'f4c7050d',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部清明节气资料记录小琉球鲣鱼洄游捕获线索','来源未提供小琉球批次的风味或具体上岸日期']};})();
(function(){window.LOTTERY_PROFILES['hanzhong-qingming-xiangchun-shoots'].senses={signature:'6dc2b27d',tastes:[],recipeTastes:['salty'],textures:['tender'],cooking:['boil'],features:['树梢鲜芽带有鲜明草木香气','清明前后发芽、谷雨之前采摘']};})();
(function(){window.LOTTERY_PROFILES['jiangmen-muzhou-qingming-huangsha-clam'].senses={signature:'9f1be41',tastes:['sweet','umami'],recipeTastes:['salty'],textures:['tender'],cooking:['steam'],features:['地方资料称蚬肉饱满鲜甜','清明前后较佳赏味，集中上市期更长']};})();
(function(){window.LOTTERY_PROFILES['ntpc-northeast-cape-thorn-purple-algae'].senses={signature:'986edda1',tastes:[],recipeTastes:['salty','umami'],textures:['crisp','tender'],cooking:['stirfry'],features:['贡寮东北角刺紫菜生长季为11月至3月，12月至次年1月较鲜嫩','刺紫菜俗称小紫菜，资料描述紫黑色、约2至4厘米']};})();
(function(){window.LOTTERY_PROFILES['tainan-dongshan-fresh-longan'].senses={signature:'d67b1ead',tastes:['sweet'],recipeTastes:[],textures:['juicy'],cooking:['raw'],features:['东山公所记录早熟鲜龙眼七月下旬上市、八月中旬盛产','八月鲜果与九月晚熟品种及柴烧龙眼干分开']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lichiu-kaohsiung-xiaochuan'].senses={signature:'72e1a8',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部立秋资料列高雄外海小串渔讯','原资料未在该条渔讯处核对标准鱼名与当年供货']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lichiu-kaohsiung-squid'].senses={signature:'a476f998',tastes:[],recipeTastes:['salty'],textures:[],cooking:['stir-fried'],features:['台湾农业部立秋资料列高雄外海乌贼渔讯','原资料未鉴定种类或当年供货']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lichiu-penghu-mackerel'].senses={signature:'74de9bda',tastes:[],recipeTastes:['salty'],textures:[],cooking:['steam'],features:['台湾农业部立秋资料列澎湖附近鰆渔讯','来源未给具体种名或批次风味']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lichiu-penghu-shrimp'].senses={signature:'a10bef77',tastes:[],recipeTastes:['salty'],textures:[],cooking:['boil'],features:['台湾农业部立秋资料列澎湖附近虾类渔讯','来源未鉴定虾种或当年供货']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lichiu-northwest-tilefish'].senses={signature:'86175478',tastes:[],recipeTastes:['salty'],textures:[],cooking:['steam'],features:['台湾农业部立秋资料列西北部马头渔讯','来源只记俗名，未鉴定具体物种']};})();
(function(){window.LOTTERY_PROFILES['zhangzidao-daxue-sea-cucumber'].senses={signature:'c1f7033b',tastes:['umami'],recipeTastes:['salty'],textures:['tender','soft'],cooking:['soup'],features:['獐子岛大雪采捕为历史民俗线索，不代表当年库存','商品养殖方式与鲜冻干状态需按批次核对']};})();
(function(){window.LOTTERY_PROFILES['keelung-north-xiaoshu-red-amberjack'].senses={signature:'c9e50b11',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部小暑资料将红魽列为基隆北方外海渔获线索','鱼类资料库将红魽对应为杜氏鰤，未提供小暑批次风味']};})();
(function(){window.LOTTERY_PROFILES['keelung-north-xiaoshu-red-emperor-bream'].senses={signature:'97c8ad1f',tastes:[],recipeTastes:['salty'],textures:[],cooking:['steam'],features:['台湾农业部小暑资料将赤宗列为基隆北方外海渔获线索','水产试验所将赤宗对应为黄背牙鲷，未提供当年渔情']};})();
(function(){window.LOTTERY_PROFILES['zhangmutou-mangzhong-guanyin-green-lychee'].senses={signature:'ac4a1ba8',tastes:['sweet'],recipeTastes:[],textures:[],cooking:['raw'],features:['东莞地方部门记载樟木头观音绿鲜果集中于六月中旬至七月中旬销售','来源描述果肉晶莹、甜而不腻；未作本站试吃']};})();
(function(){window.LOTTERY_PROFILES['heze-shannong-crisp-pear'].senses={signature:'ef94224e',tastes:['sweet'],recipeTastes:[],textures:['crisp','juicy'],cooking:['raw'],features:['官方资料记载山农酥梨十月下旬成熟','汁多清甜、酥脆为品种资料描述，未作本站试吃']};})();
(function(){window.LOTTERY_PROFILES['suao-frost-beltfish'].senses={signature:'621635c9',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部霜降资料列苏澳沿海百带鱼渔讯','来源未提供物种、风味或当年库存']};})();
(function(){window.LOTTERY_PROFILES['taiwan-frost-white-belly-seerfish'].senses={signature:'5f84b374',tastes:[],recipeTastes:['salty'],textures:[],cooking:['steam'],features:['台湾农业部霜降资料列淡水、彰化、台西、澎湖等地白腹鰆渔讯','来源未提供学名、风味、批次或当年库存']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lidong-east-sailfish'].senses={signature:'2373f12c',tastes:[],recipeTastes:['salty'],textures:[],cooking:['panfry'],features:['台湾农业部立冬资料列东部沿海旗鱼渔获线索','来源没有鉴定具体鱼种或当年供应']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lidong-east-red-eye-bream'].senses={signature:'dbec3776',tastes:[],recipeTastes:['salty'],textures:[],cooking:['steam'],features:['台湾农业部立冬资料列东部沿海红目鰱渔获线索','来源没有提供学名、批次风味或当年供应']};})();
(function(){window.LOTTERY_PROFILES['taiwan-lidong-east-jiana-fish'].senses={signature:'22b8339f',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['台湾农业部立冬资料列东部沿海加纳渔获线索','地方鱼名未由来源锁定学名；购买前需核对商品身份']};})();
(function(){window.LOTTERY_PROFILES['taiwan-rainwater-jialai-fish'].senses={signature:'4fdbafdc',tastes:[],recipeTastes:['salty'],textures:[],cooking:['steam'],features:['台湾农业部雨水资料列澎湖、高雄外海加蚋鱼渔讯','来源未提供学名、批次风味或当年供应']};})();
(function(){window.LOTTERY_PROFILES['wujiang-xiaoxue-fragrant-greens'].senses={signature:'a6bb1041',tastes:['sweet'],recipeTastes:['salty'],textures:['soft','tender'],cooking:['stirfry'],features:['苏州市政府资料记载吴江香青菜12月初长成，霜降后口感更佳','地方品种描述不是本站当季试吃记录']};})();
(function(){window.LOTTERY_PROFILES['ningbo-yinzhou-xiaoxue-fresh-snow-mustard'].senses={signature:'96e6ecf',tastes:[],recipeTastes:['salty'],textures:['tender'],cooking:['stirfry'],features:['地理标志质量规范记载鄞州冬菜多在小雪前后采收','鲜雪菜与腌制咸齑是不同商品状态']};})();
(function(){window.LOTTERY_PROFILES['cangnan-lidong-four-seasons-pomelo'].senses={signature:'7029a130',tastes:['sweet','sour'],recipeTastes:[],textures:['crisp','juicy'],cooking:['fresh'],features:['国家知识产权局地理标志标准记载苍南四季柚一般立冬前后采收','标准描述果肉脆嫩多汁、甜酸适口，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['dengkou-wallace-melon'].senses={signature:'fc242913',tastes:['sweet'],recipeTastes:[],textures:['soft','crisp','juicy'],cooking:['fresh'],features:['磴口华莱士瓜成熟期为7—8月，大暑期间被列为较佳赏味窗口','地方政府资料描述成熟果香甜多汁、软脆适度']};})();
(function(){window.LOTTERY_PROFILES['longyangxia-salmon'].senses={signature:'36a3074b',tastes:[],recipeTastes:[],textures:[],cooking:['steam'],features:['大暑时龙羊峡水温适宜三文鱼生长是报道线索，不是野生捕捞季','俗称三文鱼不等于已鉴定鱼种']};})();
(function(){window.LOTTERY_PROFILES['hejiang-late-lychee'].senses={signature:'89efdd61',tastes:['sweet'],recipeTastes:[],textures:['juicy'],cooking:['fresh'],features:['合江荔枝按品种在7—8月分期成熟','带绿、仙进奉等品种成熟时段不同']};})();
(function(){window.LOTTERY_PROFILES['shicheng-white-lotus'].senses={signature:'3a79825b',tastes:['sweet'],recipeTastes:[],textures:['soft'],cooking:['soup'],features:['石城白莲鲜莲与干莲、莲芯等商品形态需区分','地方资料描述清香甜润，未作本站试吃']};})();
(function(){window.LOTTERY_PROFILES['ntpc-dahan-native-yam'].senses={signature:'7614779a',tastes:[],recipeTastes:[],textures:['soft'],cooking:['soup'],features:['新北农业局记录东北角原生种山药为冬季在地农产','地方资料描述细致、滑润软Q，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['chuan-yu-dahan-pea-tips'].senses={signature:'9da2f3d8',tastes:[],recipeTastes:[],textures:['crisp','tender'],cooking:['blanch','stirfry'],features:['中国农业博物馆大寒专题列豌豆尖为应季鲜蔬','川渝豌豆颠儿指豌豆藤顶端嫩梢，不等同带根豆苗']};})();
(function(){window.LOTTERY_PROFILES['huangpi-luzui-water-chestnut'].senses={signature:'d3c25a92',tastes:['sweet'],recipeTastes:['savory'],textures:['crisp','juicy'],cooking:['stirfry'],features:['黄陂区政府记录陆咀村一月鲜挖地标荸荠','大寒冬季鲜品依据来自中国疾控中心节气资料']};})();
(function(){window.LOTTERY_PROFILES['xinhui-xinghuang-water-chestnut'].senses={signature:'4926e85d',tastes:['sweet'],recipeTastes:['savory'],textures:['crisp'],cooking:['stirfry'],features:['新会区政府记录兴篁村每年冬至前后采收','这条记录是地方采收窗口，不是兴篁独有品种证明']};})();
(function(){window.LOTTERY_PROFILES['caidian-ehong4-early-caitai'].senses={signature:'8b25a21e',tastes:['sweet'],recipeTastes:[],textures:['tender','crisp'],cooking:['stirfry'],features:['蔡甸鄂红4号早熟菜薹约十月中旬集中采收','嫩甜是地方报道中的品种描述，不是本站试吃']};})();

(function(){window.LOTTERY_PROFILES['zhangqiu-dawutong-scallion'].senses={signature:'c0eb6dfb',tastes:['sweet','pungent'],recipeTastes:[],textures:['crisp'],cooking:['raw','stirfry'],features:['章丘地方大葱立冬前后进入集中采收','脆甜为历史采访描述，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['suzhou-dongshan-taihu-water-shield'].senses={signature:'7f8aaf63',tastes:['fresh','umami'],recipeTastes:[],textures:['soft'],cooking:['soup'],features:['苏州东山太湖莼菜春季3月中下旬至6月较鲜嫩','清香、胶质滑润为地方资料描述，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['suizhou-paopaoqing'].senses={signature:'96724b1c',tastes:['sweet'],recipeTastes:[],textures:['crisp','tender'],cooking:['stirfry'],features:['随县蔬菜部门记录泡泡青每年12月至次年2月上市','经霜后鲜嫩、甜感更明显为地方资料描述，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['luogang-sweet-orange'].senses={signature:'775d5807',tastes:['sweet'],recipeTastes:[],textures:['juicy'],cooking:['fresh'],features:['黄埔区政府资料记载萝岗橙地理标志采收期为11月下旬至12月中旬','清甜、多汁与桂花香为地方资料描述，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['wenzhou-sanyang-ougan'].senses={signature:'caa7ad48',tastes:['sweet','bitter'],recipeTastes:[],textures:['soft','juicy'],cooking:['fresh'],features:['三垟瓯柑小雪前后采收','预贮藏转色转味后鲜食']};})();

(function(){window.LOTTERY_PROFILES['kaiyuan-xishan-hulu-pear'].senses={signature:'cd353c38',tastes:['sweet'],recipeTastes:[],textures:['crisp'],cooking:['fresh'],features:['开远市政府记录西山葫芦梨十月采收旺季','果形似葫芦、鲜果脆甜是地方资料描述，不是本站试吃']};})();

(function(){window.LOTTERY_PROFILES['pingdu-majiagou-celery'].senses={signature:'10fedd8e',tastes:[],recipeTastes:[],textures:['crisp','tender'],cooking:['stirfry'],features:['平度马家沟芹菜每年立冬前后开始集中采收','嫩黄、空心、清香酥脆为地方报道描述，不是本站试吃']};})();

(function(){window.LOTTERY_PROFILES['lanxi-huitan-sugarcane'].senses={signature:'8a3b0e4c',tastes:['sweet'],recipeTastes:[],textures:['crisp','juicy'],cooking:['fresh'],features:['国家地理标志标准记载11月中下旬汇潭甘蔗大规模采收','脆甜、茎嫩多汁为标准感官描述，不是本站试吃']};})();

(function(){window.LOTTERY_PROFILES['taitung-daxue-hangju'].senses={signature:'cd9972ee',tastes:[],recipeTastes:[],textures:['soft'],cooking:[],features:['台湾农业部记载知本、太麻里杭菊大雪时节接续开花至12月底','花香描述来自农业部资料，不是本站试饮']};})();
(function(){window.LOTTERY_PROFILES['sinan-qingming-cai-mouse-ear'].senses={signature:'dff993ff',tastes:[],recipeTastes:[],textures:['soft','tender'],cooking:['boil','steam'],features:['思南地方报道记载清明前后采鼠曲草嫩苗制作清明粑','清香描述来自地方报道，本站未试吃']};})();
(function(){window.LOTTERY_PROFILES['yuanchang-heijingang-winter-peanut'].senses={signature:'28f3d199',tastes:['sweet'],recipeTastes:['salty'],textures:['crisp','soft'],cooking:['boil'],features:['农业部食农平台记录元长黑金刚花生冬季产期为11—12月','黑色种皮是品种特征，风味随处理和批次变化']};})();
(function(){window.LOTTERY_PROFILES['taiwan-daxue-whitebelly-mackerel'].senses={signature:'acac8542',tastes:['umami'],recipeTastes:['salty'],textures:['tender'],cooking:['stirfry'],features:['台湾农业部大雪资料记南部与澎湖“白腹”鰆类渔讯','地方俗名不等于标准鱼种鉴定']};})();
(function(){window.LOTTERY_PROFILES['linwu-liping-golden-pomelo'].senses={signature:'33096c5f',tastes:['sweet','sour'],recipeTastes:[],textures:['juicy'],cooking:['fresh'],features:['湖南省政府门户网站2025年报道12月初采收、约半月窗口','报道中的甜酸与批次口感不作本站试吃保证']};})();
(function(){window.LOTTERY_PROFILES['changning-hanlu-camellia-seed-oil'].senses={signature:'c954c9d6',tastes:[],recipeTastes:['salty'],textures:[],cooking:['stirfry'],features:['常宁地方资料连续记录寒露前后收摘油茶寒露籽','茶籽须经后熟和加工成食用油，风味未作来源推断']};})();
(function(){window.LOTTERY_PROFILES['huishui-hanlu-autumn-tea-2026'].senses={signature:'861517df',tastes:['sweet'],recipeTastes:[],textures:['tender'],cooking:['steep'],features:['寒露日开采，茶汤醇厚回甘、香气浓郁','茶叶片厚实、内质丰富']};})();
(function(){window.LOTTERY_PROFILES['yongtai-lianshan-shipaiju-you'].senses={signature:'fce62b25',tastes:['sweet'],recipeTastes:['sweet'],textures:['crisp','juicy'],cooking:['fresh'],features:['福州市政府记录永泰连山橘柚大多冬至后成熟，采收可达一个多月','鲜甜、多汁、脆嫩化渣为地方报道描述，本站未试吃']};})();

(function(){window.LOTTERY_PROFILES['caidian-summer-solstice-fresh-lotus-pod'].senses={signature:'da08b34',tastes:['sweet'],recipeTastes:[],textures:['crisp','tender'],cooking:['fresh','porridge'],features:['湖北地方报道记蔡甸莲蓬头茬在夏至前后集中上市，年份间可提前','清甜与鲜脆为来源转述，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['wuhan-hannan-fresh-sweet-corn'].senses={signature:'c17325e8',tastes:['sweet'],recipeTastes:[],textures:['crisp','juicy'],cooking:['steam'],features:['武汉经开区甜玉米多品种、春季鲜穗开园有约三周采收记录','籽粒甜脆、多汁为地方报道描述，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['taiwan-hanlu-whitebelly-mackerel'].senses={signature:'678e147b',tastes:[],recipeTastes:['salty'],textures:[],cooking:['steam','stirfry'],features:['台湾农业部寒露页列淡水、彰化、台西、澎湖外海白腹鰆渔讯','来源未给学名、规格或风味描述，本站未试吃']};})();
(function(){window.LOTTERY_PROFILES['shidian-lixia-qingmei'].senses={signature:'bd5ba34',tastes:['sour'],recipeTastes:['salty','spicy'],textures:['crisp'],cooking:['fresh','boil'],features:['施甸县政府报道记录当地立夏采青梅习俗','地方描述的鲜食酸脆与盐辣子吃法不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['dongguan-tangxia-shixia-longan'].senses={signature:'29a3533c',tastes:['sweet'],recipeTastes:[],textures:['crisp','juicy'],cooking:['raw'],features:['东莞市农业农村局记载本地龙眼七月中下旬集中上市、采摘延续至八月下旬','石硖果肉厚、核较小、甜脆为地方报道描述，非本站试吃']};})();
(function(){window.LOTTERY_PROFILES['huocheng-xiangfei-crabapple'].senses={signature:'43ff53f8',tastes:['sour','sweet'],recipeTastes:[],textures:['crisp','juicy'],cooking:['raw'],features:['霍城县2025年报道记八月初采摘，2026年报道记八月中旬上市','清甜、酸甜与脆多汁来自地方报道描述，非本站试吃']};})();
(function(){window.LOTTERY_PROFILES['linan-early-spring-leizun'].senses={signature:'8186abc',tastes:['sweet'],recipeTastes:[],textures:['crisp','tender'],cooking:['stirfry'],features:['国家林草局资料记雷竹笋主要分布在临安、余杭，通常3月初至4月中下旬出笋','脆甜鲜嫩为官方资料描述，不是本站试吃']};})();
(function(){window.LOTTERY_PROFILES['tonglu-late-april-gaojie-bamboo'].senses={signature:'f86edb4',tastes:[],recipeTastes:[],textures:['crisp','tender'],cooking:['stirfry'],features:['国家林草局资料记杭州高节竹通常四月底开始出笋','自然高节竹与桐庐覆土培育的五月白玉笋分开记录']};})();
(function(){window.LOTTERY_PROFILES['donghai-dongzhi-cuttlefish'].senses={signature:'d3bee68',tastes:[],recipeTastes:['savory'],textures:[],cooking:['stirfry'],features:['中国农业博物馆将墨鱼列为冬至前后时令海珍','浙江沿海市场报道记冬季产量高峰；没有具体批次试吃记录']};})();
(function(){window.LOTTERY_PROFILES['zizhong-xiaohan-early-blood-orange'].senses={signature:'ea07afd0',tastes:['sweet','sour'],recipeTastes:[],textures:['juicy','tender'],cooking:['raw'],features:['资中血橙产业办公室将早红系（9号）鲜果上市期列为一月上旬','细嫩多汁、甜酸适中为地方资料描述，本站未试吃']};})();

Object.assign(window.LOTTERY_PROFILES['jiangjin-bailu-late-harvest-pepper'],{senses:{signature:'3f0fa75e',tastes:['spicy'],recipeTastes:['spicy'],textures:[],cooking:['sauce'],features:['重庆市农业农村委员会2025年白露前后延迟采收试验','报道所述麻味物质比较仅适用于该试验批次，不是本站试吃']}});
(function(){window.LOTTERY_PROFILES['suzhou-bailu-ginkgo'].senses={signature:'e45265c4',tastes:['bitter'],recipeTastes:[],textures:['soft'],cooking:['soup'],features:['苏州白果白露至秋分采收','白果去壳去衣膜去胚芽后充分加热']};})();
window.LOTTERY_PROFILES["mengzi-lvzi-softseed-pomegranate"].senses={signature:"9b5d6a08",tastes:["sweet"],recipeTastes:[],textures:["juicy"],cooking:["fresh"],features:["蒙自市政府资料记载籽软、多汁、甜度高"]};
window.LOTTERY_PROFILES["baoshan-zaoqiu-sweet-persimmon"].senses={signature:"a3ea93ca",tastes:["sweet"],recipeTastes:[],textures:["crisp","juicy"],cooking:["fresh"],features:["地方报道描述果肉紧实、汁水丰盈、脆爽清甜"]};
window.LOTTERY_PROFILES["shanzhou-black-emperor-grape"].senses={signature:"763968d1",tastes:["sweet"],recipeTastes:[],textures:["juicy","tender"],cooking:["fresh"],features:["陕州区政府报道记录黑皇葡萄八月中下旬成熟采摘"]};
