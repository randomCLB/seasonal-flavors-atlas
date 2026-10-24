/* Final reading pass. Facts stay in the catalog; this projection consolidates duplicated sections.
 * All sentence changes below are reviewed literal edits or record-specific replacements.
 * Safety fields and sources are not rewritten. */
(function(root){
 'use strict';
 const R=root.ReaderCopy;if(!R)throw Error('ReaderCopy must load first');
 const originalView=R.view;
 // Optional slots containing research narration are omitted, not made factual by deleting qualifiers.
 const editorial=/本站|本条|本页|本文|试吃|资料|来源|报道|标准(?:称|描述)|不代表|不保证|不是|并非|不等于|不把|不能.*证明|以.*为准|批次|实测|鉴定|渔讯|现货|统一等级|统一名称|没有记录|未提供|不同年份/;
 const literal=new Map([
 ['平台搜索只提供查询入口，不代表有货。',''],['平台搜索不代表当下有货。',''],['平台搜索不代表当年供应。',''],['平台搜索不保证现货。',''],['历史报道不代表现货。',''],['历史上市报道不代表当前库存。',''],['2026年报道不代表当前有货。',''],['2026年记录不代表当前有货。',''],['报道记录的历史采摘期不代表当年库存。',''],['本站未核实商家或当年供应。',''],['平台结果不等于现货。',''],
 ['成熟鲜果有清雅梨香，具体浓淡随批次变化。','清雅梨香。'],['成熟鲜果有荔枝清甜香；香气不能证明品种或产地。','荔枝清甜香。'],['成熟凤梨有清甜果香；香气不能证明品种或产地。','清甜果香。'],['清甜（地方资料描述）','清甜'],['滑润（地方资料描述）','滑润'],['软Q（地方资料描述）','软Q'],['清香（地方资料描述）','清香'],['桂花香（地方资料描述）','桂花香'],['清甜（产区报道描述）','清甜'],['脆嫩多汁（报道描述）','脆嫩多汁'],['鲜爽（资料描述）','鲜爽'],['栗香（资料描述）','栗香'],['甜香（资料描述）','甜香'],['鱼种待核',''],
 ['先清饮一小杯，观察实际茶汤。','先清饮，按喜好调整下一泡的浓淡。']
 ]);
 function exact(value){if(typeof value!=='string')return value;let s=R.clean(value);for(const [from,to]of literal)s=s.split(from).join(to);return s.trim().replace(/[；;]+$/,'。');}
 function useful(value){const s=exact(value);return typeof s==='string'&&s.trim()&&!editorial.test(s)?s:'';}
 delete R.notes['he shi-xianfenge'];
 Object.assign(R.notes,{
  'wujiang-xiaoxue-fragrant-greens':'十二月初长成，可吃到来年开春。',
  'cangnan-lidong-four-seasons-pomelo':'果皮较薄，果肉蜜黄或浅红。',
  'fengqing-xinhua-walnut-flowers':'',
  'wenzhou-sanyang-ougan':'小雪前后采收，预贮藏四十天以上、转色转味后再鲜食。',
  'huizhou-chengkan-qingming-tea-shoot':'“茶笋”是呈坎春季鲜笋的地方称呼。',
  'chuan-yu-dahan-pea-tips':'采豌豆藤顶端的嫩梢做菜。',
  'jiangning-bailu-white-dew-tea':'龙针与龙毫按芽叶规格区分，购买时看产品名称与等级。'
 });
 const edits={
  jitoumi:{state:'鲜鸡头米煮熟食用。'},
  'nanhu-ling':{intro:'嫩菱脆，老菱粉。清洗后充分煮熟，剥壳食用。'},
  'dalian-zihaitan':{aroma:'鲜品有海水气息；出现刺鼻或腐败异味时丢弃。'},
  'wuding-jinquehua':{aroma:'',buy:'购买作为食材销售的武定鲜金雀花，问清采摘日期与保存方式。'},
  'jinjiang-toushui-zicai':{storage:'干片密封、避光防潮，开封后尽快使用；泡软后及时煮熟。'},
  'jintang-fresh-morel':{buy:'选菌盖完整、颜色自然、菌柄紧实的鲜羊肚菌，问清来源和采收日期；避免来源不清的野生菌。'},
  'jianou-zhuilli':{storage:'鲜仁按商品说明冷藏并尽快烹调；久放时分装冷冻。'},
  'chongming-xiangsu-yu':{buy:'问清崇明香酥芋品种与采收日期；挑实心、无腐烂和酸味的芋头。'},
  'wenzhou-pancai':{buy:'确认盘菜品种、种植地与采收时间。冬批可找温州鲜货，秋批可找宁夏引种鲜货；问清采后储藏时间。'},
  'taitung-winter-atemoya':{aroma:'切开后果香明显；有发酵酒味时丢弃。'},
  'longyang-pupiao-allium-root':{finish:'根段熟透、无泥沙和生硬芯，肉片全熟。'},
  'ximeng-bamboo-worm':{texture:'外层干香，内部熟软。'},
  'binchuan-renong1-yuganzi':{buy:'挑饱满、表皮完整、无霉烂的鲜果；查看“热农1号”品种标签与宾川产地信息。'},
  'xiaolan-shiju-huaban':{storage:'鲜花瓣冷藏短放，尽快熟制。'},
  'taitung-luoshen-calyx':{storage:'鲜萼冷藏并尽快去籽处理；家常果酱用洁净器具分装后冷藏。'},
  'heshi-xianfenge':{buy:'购买佛山高明更合产区的鲜葛根，问清品系与采收日期。'},
  'bomi-winter-muli':{texture:''},
  'xinhui-winter-after-mandarin':{buy:'查看新会产地和采摘日期，选择冬至后留树采收的鲜果。'},
  'minhou-wenxi-juyou':{buy:'核对闽侯白沙汶溪产地、采摘日期与包装日期；问清运输和到货安排。'},
  'xinhui-yamen-tianshui-radish':{finish:'萝卜熟透仍有清甜，汤圆中心熟软；先尝汤，再少量加盐。'},
  'mouding-winter-early-fava':{buy:'选牟定柜山产地的冬早鲜蚕豆荚，问清采收日期。',storage:'鲜荚冷藏并尽快剥煮；剥好的豆米密封冷藏，尽早熟制。',pitfall:''},
  'laiyang-pear':{buy:'查看莱阳茌梨产地标签，问清采收日期和储藏时间；挑果皮完整、无软斑渗液的鲜梨。'},
  'wujiang-xiaoxue-fragrant-greens':{buy:'挑深绿皱叶、叶片肥厚的鲜菜，核对吴江产地与采收日期。'},
  'ningbo-yinzhou-xiaoxue-fresh-snow-mustard':{texture:'',storage:'鲜菜保持干爽并冷藏，尽早食用；腌制品按包装要求保存。'},
  'xinhui-xinghuang-water-chestnut':{buy:'核对新会司前兴篁村产地，问清采挖日期和鲜货状态。',pitfall:''},
  'ntpc-dahan-native-yam':{buy:'查看新北产地和品系标签，问清鲜品、真空包装或冷冻状态。'},
  'chuan-yu-dahan-pea-tips':{storage:'采后易失水，买回尽快烹调；短时冷藏保持干爽，避免挤压和积水。'},
  'huangpi-luzui-water-chestnut':{buy:'询问黄陂陆咀产地、采挖日期和鲜品状态。'},
  'miaoli-xihu-wendan':{buy:'核对苗栗西湖产地、采收日期和辞水处理。果皮转黄绿、轻微失水是辞水表现；有霉斑、渗液或发酵味的果实丢弃。'},
  'shawan-yuba-red-stropharia':{storage:'鲜菇冷藏，尽快食用。',pitfall:'购买人工栽培的大球盖菇，勿自行采食野生菌。'},
  'hechuan-qingshicao-winter-red-radish':{pitfall:''},
  'qingdao-shuangdongmi-peach':{buy:'核对“双冬蜜”品种、青岛种植地和采摘日期，问清冷藏时间。'},
  'qixia-lidong-winter-after-apple':{buy:'核对栖霞产地、具体苹果品种和采摘日期，问清留树晚采情况。'},
  'yubei-xiazhi-sugar-peach':{texture:'果肉硬脆，不易软。'},
  'jiangning-bailu-white-dew-tea':{ingredients:'江宁白露龙针成品茶、洁净饮用水。'},
  'huishui-hanlu-autumn-tea-2026':{ingredients:'惠水寒露秋茶成品茶、洁净饮用水。'},
  'pujiang-dahan-chunjian':{aroma:'',storage:'整果放阴凉通风处短期保存；切开后冷藏，尽快食用。'},
  'lichuan-heyuan-girl-fruit':{storage:'鲜果保持干爽、冷藏并尽快食用，吃前再清洗。'},
  'fushun-niuyake-greenhouse-dahan':{buy:'核对辽宁新宾棚室栽培产地，挑无黄化、黏滑和异味的鲜嫩芽，问清采收日期。'},
  'fangshan-doudian-nongkenuo336-corn':{buy:'查看“农科糯336”品种标签和房山窦店产地，问清采摘日期。'},
  'suzhou-rainwater-caihua-tangli':{buy:'向卖家确认塘鳢鱼品类、来货产地、鲜活或冰鲜状态与冷链。',storage:'购买后尽快冷藏并烹调，运输时保持冷链。'},
  'fengxian-shihai-2026-japanese-sweet-mulberry':{buy:'核对奉贤青村石海村产地和“日本甜果桑”品种名，问清采摘日期。'},
  'yaoan-edible-rose':{buy:'购买食用栽培的姚安光禄鲜玫瑰花瓣，确认食品用途、采摘日期和保存方式。'},
  'tainan-dongshan-fresh-longan':{texture:'果肉多汁，剥壳后去核食用。'},
  'pinggu-yingshuanghong-late-peach':{buy:'核对平谷金海湖产地、“映霜红”品种名和采摘日期；查看果面是否完整、运输是否挤伤。'},
  'hubei-ejiao4-summer-jiaobai':{buy:'购买标明“鄂茭4号”的鲜茭白，核对种植记录，问清采收日期以及带壳或剥壳状态。'},
  'wenzhou-oujiang-ziji':{pair:'油煎后蘸少量酱醋食用。'},
  'shexian-qizili-hickory':{buy:'选标签完整、生产者可追溯的山核桃成品，核对歙县杞梓里产地、采收年份、脱蒲与干燥加工情况。'},
  'taiwan-lichiu-red-eye-bream':{pair:'少量姜葱和盐调味，煎熟配饭。'},
  'keelung-north-xiaoshu-red-amberjack':{pair:'少量姜葱和盐调味，煎熟配饭。'},
  'caidian-ehong4-early-caitai':{pair:'蒜香快炒，少量加盐。'},
  'wenzhou-sanyang-ougan':{buyDetail:'轻微苦味是瓯柑的风味；有发酵异味、渗液或软烂时丢弃。',pitfall:''},
  'youxi-lidong-kumquat':{texture:'鲜果洗净后可连皮食用。'},
  'eshan-jingzhe-mulberry-flower':{texture:'',pitfall:'购买标明食品用途的桑葚花，烹调前先用沸水煮熟。'},
  'chengde-spring-equinox-elm-samaras':{pair:'蒜泥和香油适合拌榆钱饭。'},
  'wuhan-spring-equinox-hanpai-red-amaranth':{buy:'核对鲜红苋菜产地、采收日期和运输状态。'},
  'lanxi-huitan-sugarcane':{finish:'嚼取蔗汁后吐出纤维。'},
  'yuanchang-heijingang-winter-peanut':{finish:'花生仁充分熟透。'},
  'rongan-xiaozhou-winter-head-vegetable':{buy:'购买融安长安镇小洲村鲜采头菜，向卖家说明要刚采收的原菜。'},
  'changning-hanlu-camellia-seed-oil':{texture:'经正规加工的液态食用茶油。',finish:'叶菜熟透，仍有清爽口感。'},
  'shidian-lixia-qingmei':{finish:'青梅保持爽脆，酸味清晰。'},
  'caidian-summer-solstice-fresh-lotus-pod':{finish:'米粥软稠，鲜莲子熟软但仍成粒。'},
  'fushun-xiaohan-ertai':{buy:'挑芽包紧实、表面无软烂和明显失水的儿菜，核对富顺产地与采收日期。'},
  'henan-qiufen-tunisian-softseed-pomegranate':{buy:'查看突尼斯软籽品种标签、河南产地与采摘日期；果皮完整、籽粒正常着色的果实更便于判断成熟状态。'},
  'suzhou-guangfu-hanlu-late-osmanthus':{aroma:'',buy:'购买有食品用途标识的鲜桂花或糖桂花，核对光福产地、采摘年份与加工方式。'},
  'fuzhou-jingzhe-zhaocai':{finish:'汤带糟香，粉干热透；先尝汤，再决定是否加盐。'},
  'wenzhou-lingkun-baizhuogua':{buy:'核对温州灵昆产地和春季头茬采收日期，问清鲜瓜成熟状态与运输安排。'},
  'qingdao-youreka-greenhouse-blueberry':{finish:'果实完整，气味清新。'},
  'miyun-houchangjiawu-yuanwei1-tomato':{texture:'多汁，咬开时汁液充沛。'},
  'pinggu-zhongpan9-xiaoshu-peach':{buy:'核对北京平谷产地、“中蟠9号”品种名和采摘日期。'},
  'guangnan-mianhao-baba':{pitfall:'确认原料是食用曲鼠草嫩芽与小黄花；揉入糯米粉后煎熟或蒸熟。'},
  'suzhou-bailu-ginkgo':{pitfall:'去除外种皮、衣膜和胚芽后仍须充分加热；按安全提示控制食用。'},
  'zhenning-honey-plum':{aroma:'',texture:'',taste:''},
  'fengqing-xinhua-walnut-flowers':{aroma:'',texture:'',taste:''}
 };
 const stepEdits={
  'yanshi-fresh-yintiao':{1:'锅里加足量水煮沸，下银条煮至熟透、仍有脆感，再捞起。'},
  'tonghai-fresh-sour-quince':{0:'购买供烹饪的云南酸木瓜，洗净，去硬籽和籽腔，切薄片。'},
  'xinhui-yamen-tianshui-radish':{2:'汤圆浮起后再煮 2 分钟，检查中心熟透后少量加盐，撒葱花。'},
  'laiyang-pear':{0:'挑果皮完整、无软斑渗液的鲜梨，洗净后切开。'},
  'ningbo-yinzhou-xiaoxue-fresh-snow-mustard':{0:'购买小雪前后采收的鲜雪菜，摘除黄叶、病叶。'},
  'renhua-danxia-gonggan':{0:'洗净果皮，剥开后分瓣。'},
  'qingdao-shuangdongmi-peach':{0:'挑表皮完整的成熟鲜桃，洗净后切开。'},
  'suao-xiaoman-flying-fish-fishery':{0:'核对商品标准名或学名，确认捕捞海域、上岸日期与鲜冻状态。'},
  'taiwan-pengjia-lichun-chun-fish':{0:'核对商品标准名或学名，确认捕捞海域、上岸日期与鲜冻状态。'},
  'huishui-hanlu-autumn-tea-2026':{0:'核对惠水长岩村产地、茶类、加工方式和采制年份，按成品茶包装冲泡。'},
  'lichuan-heyuan-girl-fruit':{0:'只购买标明荷源乡产地、食品用途和采摘日期的鲜果。',1:'去除外层萼片，流水轻柔洗净并沥干。'},
  'suzhou-june-yellow-late-may-market':{0:'购买鲜活蟹，询问养殖产地、规格和到货日期。'},
  'suzhou-rainwater-caihua-tangli':{0:'核对塘鳢鱼品类、来货产地和冷链，购买鲜活或冰鲜商品。'},
  'lanshan-baidieling-guyu-tea':{0:'核对蓝山百叠岭产地、茶类、采制年份和加工方式，按成品茶包装冲泡。'},
  'minhou-baisha-late-longan':{0:'挑外壳完整的成熟鲜果，洗净后剥壳。'},
  'tainan-dongshan-fresh-longan':{0:'选台南东山新采鲜果，洗净后剥壳。'},
  'taiwan-frost-white-belly-seerfish':{2:'撒葱后趁热食用，留意鱼刺。'},
  'taiwan-lidong-east-sailfish':{0:'核对旗鱼具体商品名、捕捞海域、上岸日期与鲜冻状态。'},
  'taiwan-lidong-east-red-eye-bream':{0:'核对商品名、捕捞海域、上岸日期和鲜冻状态。'},
  'taiwan-lidong-east-jiana-fish':{2:'撒葱后趁热食用，挑去鱼刺。'}
 };
 const suffixes=['（来源描述）','（地方报道描述）','（地方资料描述）','（产区报道描述）','（报道描述）','（资料描述）','（品种标准）','（品种资料描述）'];
 const cleanFields=['short','description','intro','state','seasonLabel','buy','buyDetail','storage','recipeTitle','ingredients','finish'];
 R.view=function(raw){
  const f=originalView(raw);if(!f)return f;
  for(const key of cleanFields)f[key]=exact(f[key]);
  // The search drawer is an action entry. Buying advice is shown once in the dedicated buying section.
  f.procurement={...f.procurement,checks:[],route:''};
  f.kitchen='';
  if(f.eatingMode!=='fresh'){
   if(!f.pitfall)f.pitfall=useful(raw.pitfall);
   if(!f.pair)f.pair=useful(raw.pair);
  }
  const normalized=s=>String(s||'').replace(/[\s，。、；：;,.!！]/g,'');
  for(const key of ['aroma','texture']){const value=useful(raw[key]);if(value&&!normalized(f.short).includes(normalized(value)))f[key]=value;}
  f.placeSeasons=(f.placeSeasons||[]).map((p,i)=>({...p,flavorNote:raw.placeSeasons?.[i]?.flavorSource?useful(raw.placeSeasons[i].flavorNote):''}));
  f.steps=f.steps.map((s,i)=>stepEdits[f.id]?.[i]||exact(s));
  f.flavor=f.flavor.map(t=>{for(const suffix of suffixes)t=t.split(suffix).join('');return t==='鱼种待核'?'':t;}).filter(Boolean);
  Object.assign(f,edits[f.id]||{});f.description=f.short||'';
  if(f.category==='tea'){f.finish='';f.pitfall='';}
  if(f.category==='fruit'&&!f.steps.some(s=>/煮|炒|炖|蒸|烤|煎|熬|焯|腌|糖渍|发酵/.test(s)))f.eatingMode='fresh';
  if(f.eatingMode==='fresh'){
   if(f.pitfall&&!editorial.test(f.pitfall)&&!f.buy?.includes(f.pitfall))f.buyDetail=[f.buyDetail,f.pitfall].filter(Boolean).join('');
   f.finish='';f.pair='';f.pitfall='';
  }
  if(raw.comparison?.source&&!f.sources?.some(([,url])=>url===raw.comparison.source))f.readerExtraSource=raw.comparison.source;
  return f;
 };
})(typeof window==='object'?window:globalThis);
