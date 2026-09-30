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

(function(){const rows={"jianou-zhuilli":["53c1a414","sweet","","soft","soup","尖小的栗果；熟后粉糯"],"chongming-baibiandou":["35620feb","sweet","","tender","boil","熟荚柔嫩；不可当作生脆蔬菜"],"chongming-xiangsu-yu":["63e64c36","sweet","","soft","steam","剥皮后酥糯绵密"],"xiangyin-santang-jiaotou":["7a64912f","spicy","salty umami","crisp","stirfry","鲜鳞茎有葱蒜样辛香"],"wenzhou-pancai":["4ae86f03","sweet","","tender soft","soup","圆盘般根块；熟后柔软"]};const list=s=>s?s.split(" "):[];for(const [id,[signature,tastes,recipeTastes,textures,cooking,features]] of Object.entries(rows)){window.LOTTERY_PROFILES[id].senses={signature,tastes:list(tastes),recipeTastes:list(recipeTastes),textures:list(textures),cooking:list(cooking),features:features?features.split("；"):[]};}})();
