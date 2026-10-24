/* Reader copy, 2026-10-23. Canonical catalog, dates, recipes, safety and sources remain intact.
 * Literal edits below remove reviewed editorial clauses only. Never strip negations by pattern.
 * Flavor/texture/aroma are consolidated in the existing edited short paragraph. */
(function(root){
 'use strict';
 const VERSION='2026.10.23-reader.1';
 const omissions=new Set([
 '本站未试吃','本站未亲身试吃','本站没有试吃记录','本站未作独立试吃','未亲身试吃','这里是资料整理，不是本站试吃',
 '平台搜索不代表现货','平台搜索不代表库存','平台搜索不代表有货','平台搜索不代表当年有货','平台搜索不代表当前有货','平台搜索不代表当年现货','平台搜索不代表当前供应','平台搜索不代表当年渔获','平台搜索不代表当日有货','平台搜索不代表当前仍有货','平台结果不代表现货','平台结果不代表有货','平台结果不代表当年有货','平台结果不代表当前有货','平台搜索不代表当前库存',
 '搜索结果不代表现货','搜索结果不代表有货','搜索结果不代表实际有货','搜索结果不代表当年有货','搜索结果不代表本地有货','搜索结果不代表本站推荐或当前有货','平台搜索不代表本站推荐商家或当前有货','平台搜索不代表库存，本站未核实商家','平台搜索不代表有货，本站没有核实商家',
 '本站未核实具体商家、库存或价格','本站未核实具体商家、价格或当前库存','本站未核实具体商家、价格或库存','本站未核实商家、库存或价格','本站未核实具体商家或库存','本站未核实具体商家和库存','本站未核实具体商家与库存','本站未核实商家或现货','本站未核实商家、价格或库存','本站未核实商家','本站未推荐具体卖家','本站未核实当年供应','本站未核实具体商家','本站未核实具体果园、商家或当前库存',
 '地方春分资料不代表当年现货','时令报道不代表当季现货','地方报道不代表当季库存','历史报道不代表2027年有货','来源报道不代表当前有货','报道日不代表当前有货','2026 年报道不能证明当前仍有货','2026年报道不能证明当前仍有货','报道的年度窗口不保证当前现货','小暑渔讯不代表当年现货','清明渔讯不代表当年现货','小满历史报道不代表当前库存','本条时令资料不代表当前有货','网页报道的成熟预期不等于现货',
 '外观不能单独证明产地','外皮颜色不能单独证明品种','仅写“空心菜”不能证明地方品种','“小卷”俗名不等于具体物种鉴定','铁棍山药粉、干片不是鲜山药',
 '该做法是家常建议，不代表地方传统','这是家常建议，不是来源记录的传统做法','这是家常搭配建议，不是地方传统配方','不把此家庭做法说成当地独有传统','这是资料线索，不是该来源给出的完整食谱','来源没有给出专属冲泡参数','来源没有给精确烹饪时间，按商品嫩度调整',
 '这是简易家常吃法，不是地方菜谱还原','甜酸以当批成熟度为准','酸甜以实际批次为准','甜酸以当批果实为准','甜度以实际成熟批次为准','具体香气与滋味以实际批次为准',
 '本步骤为本站整理，不是来源所载完整配方','此处做法是家常建议，不代表苏澳传统菜式','此做法是本站建议，不代表来源所载地方菜谱','配料做法为本站家常建议','本条不把其他荔枝品种的成熟期套用于观音绿',
 '这是本站整理的家常做法，不标作汉中独有菜式','本页搭配是家常建议，不代表地方传统菜式','搭配为家常建议，不是来源记录的地方传统','本条配方是本站家常建议','以上步骤为本站整理，未亲身试吃','本站配方为家常建议',
 '报道没有确认常年商家或2026年当前库存','报道没有核实常年商家或2026年库存','来源没有核实商家、库存或学名','平台搜索不代表当年开捕或库存'
 ]);
 const clauses=new Map([
 ['确认不是观赏蕨或其他野菜','购买标明可食用种类与来源的鲜蕨芽'],
 ['确认是鲜筍而非茭白脆片等加工品','确认购买鲜茭白筍'],
 ['确认不是已盐腌、晒干或装坛成品','确认购买刚采收的原菜'],
 ['确认买的是菜荞，而非鳞茎较粗的头荞','选择鳞茎细嫩的菜荞'],
 ['确认是细嫩菜荞而非粗鳞茎头荞','选择鳞茎细嫩的菜荞'],
 ['买前确认是苏州东山太湖鲜莼菜，不是瓶装、盐渍或加工品','选择苏州东山鲜采莼菜嫩梢'],
 ['鲜菜用保鲜袋松装后冷藏，尽早食用','鲜菜松装保鲜袋冷藏，尽早食用'],
 ['冻干、菜粉与鲜菜不是同一商品形态，按标签保存','冻干菜和菜粉按包装要求保存'],
 ['核对商品标注的贝类名称、产地、生产者、配料和干制状态','查看贝类名称、产地、生产者、配料和干制状态'],
 ['蛏干、蛤干、鲜蛏不是同一商品','购买蛏干，烹调前先泡发'],
 ['蔗汁清甜、甘蔗纤维仍有脆韧感','嚼取蔗汁后吐出纤维'],
 ['先清饮一小杯，观察实际茶汤','先清饮，按喜好调整下一泡的浓淡'],
 ['茶油可作为普通烹调油使用','茶油可用于日常烹调'],
 ['具体香气和适用火候以产品标签及生产者说明为准','按包装建议选择烹调温度'],
 ['茶水比例、水温和浸泡时间以该批包装说明为准','按成品茶包装设置投茶量、水温与浸泡时间'],
 ['青皮鲜果不是即食状态','选择已脱青皮、干燥并熟制的果仁'],
 ['资料所述野外采集不等于可自行采集','购买有食品标签的可食用商品，勿自行采集野藻'],
 ['地理标志标准记载立冬前后采收','立冬前后采收'],
 ['大雪渔获记录，不代表最佳赏味期','大雪渔获记录'],
 ['惊蛰地方渔讯 · 俗名待核','惊蛰地方渔讯'],
 ['随植株抽蕾采收，最佳月份待核','随植株抽蕾采收'],
 ['鲜粒煮熟后；不把干芡实的口感套在鲜粒上','鲜粒煮熟后食用'],
 ['鲜果洗净后少量鲜尝，或加热制成酸梅饮','鲜果洗净后少量鲜尝，或加热制成酸梅饮'],
 ['不把鲜果与腌渍品混称',''],
 ['嫩梢与肉片均完全熟透','嫩梢与肉片均完全熟透'],
 ['检查熟度并留意鱼刺','鱼肉熟透后挑去细刺'],
 ['清甜（来源描述）','清甜'],['清甜（地方报道描述）','清甜'],['甜感（来源描述）','甜感'],['甜（品种资料描述）','甜'],['软糯（来源描述）','软糯'],['脆嫩（来源描述）','脆嫩'],['甜酸适口（品种标准）','甜酸适口'],['果皮香气（品种标准）','果皮香气']
 ]);
 // Punctuation is used only to look up exact, reviewed whole clauses. Unknown text is retained.
 function clean(value){
  if(typeof value!=='string')return value;
  const pieces=value.split(/([。；;\n])/);let output='';
  for(let i=0;i<pieces.length;i+=2){const original=pieces[i].trim();if(!original)continue;let t=clauses.has(original)?clauses.get(original):original;if(!t||omissions.has(t))continue;output+=t+(pieces[i+1]||'');}
  return output.trim().replace(/[；;]+$/,'。');
 }
 const notes={
  'nanhu-ling':'鲜嫩时清甜脆口，老熟后煮得粉糯。看菱角老嫩，再决定鲜煮还是炖食。',
  cigu:'吃的是地下球茎。削皮切块后煮熟，粉糯里带微苦，适合炖肉。',
  'eryuan-haicaihua':'主要吃嫩茎，清煮或与芋头同煮，入口柔滑。',
  'yanchi-huanghuacai':'这里用干黄花菜做菜。夏季采收的花蕾经处理干制后，可全年购买。',
  'bayuegua':'熟果自然开裂后取果瓤食用，吐出种子；发霉、有异味的果实丢弃。',
  'ruanzao-mihoutao':'果皮光滑、个头小。轻按稍软时适合鲜食，硬果可继续后熟。',
  'jiaozhou-kailing-suo':'开凌时节上市的梭鱼，用姜葱炖煮，鱼肉熟透后挑去细刺。',
  'shanzhou-green-wheat-nianzhuan':'未完全老熟的新麦碾成细条，带青麦香，适合与鸡蛋、韭菜同炒。',
  'minqin-field-shacong':'吃细长嫩叶，葱韭香明显，适合炒蛋。这里收录露地夏季鲜菜。',
  'banna-banana-blossom':'取内层嫩苞片和可食花朵，按食材处理要求去涩后煮熟。',
  'he shi-xianfenge':'',
  'heshi-xianfenge':'鲜粉葛切块煮汤，熟后粉糯微甜；购买时选择整根或切块鲜葛根。',
  'zhenning-honey-plum':'果大核小。镇宁南部果园按海拔先后成熟，六月可留意分批采收的鲜果。',
  'wujiang-xiaoxue-fragrant-greens':'叶色深绿，叶面皱缩、肥厚。十二月初长成，霜后更香甜，炒熟软糯。',
  'cangnan-lidong-four-seasons-pomelo':'果皮较薄，果肉蜜黄或浅红，脆嫩多汁、甜酸适口。',
  'fengqing-xinhua-walnut-flowers':'取核桃雄花穗的花茎食用。鲜花茎焯泡后炒腊肉，干花泡发后适合炖鸡、火腿或腊排骨。',
  'yunxiao-liuye-baigeng-wongcai':'柳叶形叶片配白色叶柄，梗脆、叶嫩，粗纤维较少。',
  'tianjin-huangya-cabbage':'黄芽菜是大白菜的旧称，也指黄色内叶。挑新鲜紧实的菜心，切丝炒肉或煮汤。',
  'shawan-yuba-red-stropharia':'赤松茸又称大球盖菇，购买栽培食用鲜菇，洗净后充分煮熟。',
  'mouding-winter-early-fava':'冬早鲜蚕豆剥出豆米，煮熟或炒熟后软糯；蚕豆病患者应避免食用。',
  'xinhui-winter-after-mandarin':'冬后留树采收的大红柑批次，购买时问清采摘日期与留树采收情况。',
  'beian-xiaohan-white-lover-strawberry':'成熟果保持白色。挑果形完整、气味清新、表面干爽的鲜莓。',
  'fangshan-doudian-nongkenuo336-corn':'同一果穗的甜粒与糯粒约为一比三，蒸熟后兼有甜味和黏糯。',
  'anji-xilong-baiye-first-pick':'白叶一号春芽按绿茶工艺加工；购成品茶，按包装建议冲泡。',
  'jiangmen-duruang-lixiang-cool-gourd':'瓜肉较厚，表面瘤粒粗大、顶部较平，切薄片炒熟，苦后回甜。',
  'miaoli-gongguan-fresh-jujube':'鲜果由青绿转黄、逐步泛红；越红通常越熟，肉质也更软。喜欢脆口可挑偏硬实的成熟鲜果。',
  'dazu-lichun-winter-vegetable-tip':'用鲜嫩菜尖清炒。当地冬菜成品还需风干、盐揉和发酵，购买时选准鲜原料或腌制品。',
  'shexian-qizili-hickory':'白露开始采收的原果还要脱蒲、干燥和加工。日常食用选择加工完成、标签完整的山核桃。',
  'cangyuan-bailu-lincang-macadamia':'青皮原果经脱皮、干燥和加工后成为食用坚果。购买熟制果仁更方便。',
  'chengde-spring-equinox-elm-samaras':'吃的是榆树嫩翅果。挑柔嫩、来源明确的食用榆钱，裹粉蒸熟。',
  'ningbo-spring-equinox-alfalfa-shoots':'“草籽”指苜蓿类嫩梢。选开花前的嫩菜，适合少油快炒或炒年糕。',
  'taiwan-winter-solstice-mullet-roe':'乌鱼卵巢经盐渍、脱水制成乌鱼子，吃前按产品说明熟制，切薄片搭配。',
  'huairou-huaibei-hongxiaoli':'鲜食与入窖储藏后的果实口感不同，购买时问清采摘日期和储藏方式。',
  'henan-qiufen-tunisian-softseed-pomegranate':'籽粒较软，可随果肉一起咀嚼。河南产区通常九月下旬至国庆前成熟。',
  'suzhou-guangfu-hanlu-late-osmanthus':'食品级鲜桂花经糖渍制成糖桂花，适合拌藕或用于甜品。',
  'fuzhou-hanlu-razor-clam-dry':'蛏干烹调前先泡发，适合与冬瓜、姜片一起煮汤。',
  'fuzhou-jingzhe-zhaocai':'芥菜经晾晒后与红酒糟、盐腌制，开瓮有酒糟香，适合煮粉干。',
  'enping-naji-tainung17-pineapple':'果眼浅，果肉金黄细腻，果心较嫩，削皮后切块鲜食。',
  'guangzhou-qingming-jiaocai':'菜荞鳞茎细嫩，适合热炒；鳞茎较粗的头荞常做酸甜小菜。',
  'suzhou-jinting-wumei-mangzhong-waxberry':'“乌梅种”是早熟杨梅品种，通常先于浪荡子、东魁上市。',
  'guangnan-mianhao-baba':'曲鼠草嫩芽与小黄花揉进糯米粉，包肉馅或豆沙馅后煎、蒸，外皮软糯带韧。',
  'suzhou-bailu-ginkgo':'食用部分是银杏种仁。去外种皮、衣膜和胚芽后充分加热，具体食用限制见安全提示。',
  'jiangjin-bailu-late-harvest-pepper':'收录江津玉溪镇二〇二五年的延迟采收试验批次，可用于花椒油和火锅底料。购买时问清试验点、年份与加工状态。',
  'changning-hanlu-camellia-seed-oil':'“寒露籽”指寒露前后采收的油茶籽；经过正规压榨加工的食用茶油可用于炒菜。',
  'songjiang-cangqiao-crystal-pear':'仓桥果园种有翠冠、圆黄等品种，购买时同时看品种、采摘日期和成熟度。',
  'yunyang-winter-solstice-red-orange':'云阳红橙包含纽荷尔、红肉、伦晚等品种，各有采收时段，购买时看清具体品种。',
  'danling-great-cold-late-citrus':'留树保鲜延后采收的柑橘，购买时核对具体品种与采摘时间。'
 };
 const tips={
  'zengcheng-caixin':'粗梗纵向剖开，梗先下、叶后下；沥干再调味，避免盘底积水。',
  'kucihua':'苦刺花按要求焯泡后沥干，再与配料炒熟。',
  'honghu-oudai':'挑切面新鲜、无发黑软烂的藕带，切段后尽快烹调。',
  cizhousun:'鲜笋先充分焯煮；厚片比薄片更难熟透。凉拌也要先煮熟，勿自行配制草木灰水。',
  cili:'去刺、去籽，按酸度兑水；浓缩汁按产品用量使用。',
  'bishan-ercai':'大小芽包切成相近厚度，粗厚处先下锅。',
  congjun:'确认可食菌种与正规来源，充分加热；汤刚沸腾时不能据此判断菇体已熟。',
  'rugao-takecai':'叶片间冲洗干净，粗梗先下，嫩叶后下。',
  'yanqing-baleng-crisp-haitang':'购买标明鲜食用途的八棱脆海棠，勿食来源不明的观赏果。',
  'lufeng-zhongcun-late-early-chestnut':'先划开栗壳再加热，熟后食用；整颗带壳栗子勿直接放入微波炉。',
  'qingdao-youreka-greenhouse-blueberry':'果面均匀的自然果粉可保留；绒毛状霉点、破损渗汁或发酵味果实丢弃。',
  'shidian-autumn-longzhu-shoot':'本条龙竹笋须焯水并充分煮熟后食用。',
  'qujing-shasong-tip':'购买有明确食用身份的鲜嫩商品，嫩梢与肉片均须熟透。',
  'jiuzhaigou-lixia-water-fern':'先核实可食用品类，按该商品要求焯煮、浸泡后再炒熟，勿自行采食不明蕨类。',
  'dujiangyan-spring-equinox-cotton-grass':'购买来源明确、作为食材出售的原料，勿凭俗名或图片自行采食。',
  'lichuan-heyuan-girl-fruit':'购买来源明确的食用鲜果，勿凭俗名或外观自行采食野果。',
  'wujiang-xiaoxue-fragrant-greens':'粗梗先炒、加少量水焖软，再下嫩叶，避免梗硬叶老。',
  'fengqing-xinhua-walnut-flowers':'摘除花穗、保留花茎；鲜茎先焯烫、冷水浸泡并换水，再炒熟。',
  'suzhou-bailu-ginkgo':'白果须充分加热，不能靠去胚芽代替熟制；按安全提示控制食用。',
  'wuxi-mashan-mangzhong-yangmei':'鲜果易损，收货后及时检查，尽早吃完。',
  'ntpc-northeast-cape-thorn-purple-algae':'只买有食品标签、可追溯的食用海藻，勿自行采集不明野藻。'
 };
 const extra={
  'zhenning-honey-plum':{short:'果肉紧实酥脆，果香清楚。',buy:'挑表皮完整的鲜果，查看镇宁产地标识，问清采摘日期。',steps:['流水洗净并擦干。','沿果核切开或掰开，去核后鲜食。'],eatingMode:'fresh'},
  'wujiang-xiaoxue-fragrant-greens':{short:'深绿皱叶，叶片肥厚；霜后更香甜，炒熟软糯。',pair:'清炒吃它的香气和软糯，也适合做咸肉菜饭。',steps:['剔除黄叶、腐叶，流水洗净并沥干；粗菜梗与嫩叶分开。','热锅加油，先炒粗菜梗，加少量清水盖锅焖软。','放入嫩叶炒至熟透，加少量盐调味。'],finish:'菜梗熟软，叶片熟透。'},
  'cangnan-lidong-four-seasons-pomelo':{short:'立冬前后采收，果肉脆嫩多汁、甜酸适口。',buy:'看果皮是否完整，核对苍南产地和采收日期。',steps:['洗净外皮并擦干。','剥皮分瓣，去籽和厚白络，直接鲜食。'],eatingMode:'fresh'},
  'fengqing-xinhua-walnut-flowers':{short:'吃核桃雄花穗的花茎，焯泡去苦后炒腊肉。',aroma:'',buy:'购买可食用核桃雄花穗的花茎，问清鲜品或干品及采收日期。',steps:['摘除花穗，保留花茎，洗净。','沸水焯烫后用冷水冲洗，再浸泡约一天去苦，中途换水，沥干切段。','腊肉薄片煸香，加入姜蒜、辣椒，再下花茎翻炒至熟透，按腊肉咸度调味。'],finish:'花茎熟热，仍有脆感。',pair:'鲜花茎炒腊肉；干花泡发后炖鸡、火腿或腊排骨。'},
  'pinggu-zhongpan9-xiaoshu-peach':{short:'七月中旬成熟的黄肉蟠桃，果肉紧实，洗净切瓣吃。'},
  'rongxian-shatian-pomelo':{steps:['洗净柚皮，剥皮分瓣。','去籽和囊衣，直接鲜食。'],eatingMode:'fresh'},
  'cangyuan-bailu-lincang-macadamia':{steps:['购买已完成脱青皮、干燥并熟制的坚果仁。','按原配方煮好燕麦粥，将果仁掰碎后拌入。'],finish:'燕麦煮软，加入熟制果仁。'},
  'suao-jingzhe-huahui':{seasonLabel:'惊蛰地方渔讯'},'suao-jingzhe-muhou':{seasonLabel:'惊蛰地方渔讯'},'suao-jingzhe-dingmian':{seasonLabel:'惊蛰地方渔讯'},'keelung-jingzhe-jiaranyu':{seasonLabel:'惊蛰地方渔讯'},'keelung-jingzhe-wenyu':{seasonLabel:'惊蛰地方渔讯'},
  'taiwan-daxue-eastern-striped-bonito':{seasonLabel:'大雪渔获记录',intro:'全年可捕，春夏较丰，秋季风味较好。大雪在南台湾与澎湖也有渔获记录。'},
  'yaan-chuancai3-lichun-first-pick':{ingredients:'川茶3号成品茶、洁净饮用水。',finish:'',pair:'先清饮，按喜好调整下一泡的浓淡。'},
  'xihu-longjing-group-late-march':{finish:'',pair:'先清饮，按喜好调整下一泡的浓淡。'},
  'lingshan-dahan-spring-tea-first-pick':{finish:'茶汤无霉味、酸败味或明显异物。'},
  'fuzhou-hanlu-liaozai-clam':{finish:'蚬肉完全熟透后食用。'}
 };
 const labelEdits=new Map([['（来源描述）',''],['（地方报道描述）',''],['（品种标准）',''],['（品种资料描述）','']]);
 function tag(value){let t=String(value||'');for(const [a,b]of labelEdits)t=t.split(a).join(b);return t;}
 const cleanKeys=['short','state','seasonLabel','buy','buyDetail','storage','recipeTitle','ingredients','finish'];
 function view(raw){
  if(!raw)return raw;
  const f={...raw};for(const key of cleanKeys)f[key]=clean(f[key]);
  // The edited overview already gives flavor and texture once. Research prose is not a second overview.
  f.description=f.short||'';f.intro=notes[f.id]||'';f.taste='';f.aroma='';f.texture='';
  f.season='';f.place='';f.context='';f.market='';f.kitchen='';f.seasonPhase=null;f.comparison=null;
  f.pitfall=tips[f.id]||'';f.pair='';
  f.steps=(Array.isArray(raw.steps)?raw.steps:[]).map(clean).filter(Boolean);
  f.flavor=(raw.flavor||[]).map(tag);
  f.procurement={...(raw.procurement||{}),checks:(raw.procurement?.checks||[]).map(clean).filter(Boolean),route:''};
  f.placeSeasons=(raw.placeSeasons||[]).map(p=>({...p,seasonNote:'',flavorNote:''}));
  Object.assign(f,extra[f.id]||{});
  f.description=f.short||'';
  if(raw.sourceYears?.length&&!raw.sourceYears.some(y=>String(f.seasonLabel||'').includes(String(y))))f.seasonLabel=`${raw.sourceYears.join('、')} 年 · ${f.seasonLabel||''}`;
  const fresh=f.eatingMode==='fresh'||(f.category==='fruit'&&/鲜食|鲜切|鲜尝|水果|优格|酸奶|剥食/.test(f.recipeTitle||''));
  if(fresh){f.eatingMode='fresh';f.finish='';f.pair='';if(tips[f.id])f.buy=[f.buy,tips[f.id]].filter(Boolean).join('');f.pitfall='';}
  f.readerVersion=VERSION;
  return f;
 }
 const api={VERSION,view,clean,tag,notes,tips,extra};root.ReaderCopy=api;
 if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
