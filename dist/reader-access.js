/* Public admission and editorial review. Original observations remain untouched.
 * Lack of verified access is an editorial hold, not a claim that a food cannot be bought.
 * A useful Bilibili introduction OR a concrete mainland food-supply reference is required.
 * Evidence is attached to reviewed market identities, never guessed from a similar name. */
(function(root){
 'use strict';
 const version='2026.10.24-access.1';
 const evidence=Object.freeze({
 "taiwan-jialiao-bream": {
  "keyword": "真鲷 红加吉",
  "video": [
   "黑猫厨房 · 真鲷的处理与烹调",
   "https://www.bilibili.com/video/BV1v7411s7Yd/"
  ],
  "mainland": [
   "经海渔业 · 深海真鲷产品",
   "https://www.jinghaiyuye.com/index.php/product/show/sid/691/id/603.html"
  ],
  "channel": "山东烟台生产商产品页",
  "checkedAt": "2026-10-24"
 },
 "taiwan-lidong-east-red-eye-bream": {
  "keyword": "大眼鸡 红目鲢",
  "video": [
   "胖江生活美食 · 潮汕红目鲢做法",
   "https://www.bilibili.com/video/BV1Nv411b7kc/"
  ],
  "mainland": [
   "福建商务厅 · 马尾水产市场供应介绍",
   "https://swt.fujian.gov.cn/xxgk/jgzn/jgcs/zmsyq/zmzhc_tpxw/202503/t20250312_6778321.htm"
  ],
  "channel": "福建马尾水产市场；文中列明红目鱼",
  "checkedAt": "2026-10-24"
 },
 "donghai-dongzhi-cuttlefish": {
  "keyword": "鲜墨鱼 乌贼",
  "video": [
   "童妈的料理 · 宁波红烧小墨鱼",
   "https://www.bilibili.com/video/BV1LfxKztEfM/"
  ],
  "mainland": [
   "福建商务厅 · 马尾水产市场供应介绍",
   "https://swt.fujian.gov.cn/xxgk/jgzn/jgcs/zmsyq/zmzhc_tpxw/202503/t20250312_6778321.htm"
  ],
  "channel": "福建马尾水产市场；文中列明乌贼",
  "checkedAt": "2026-10-24"
 },
 "taiwan-winter-solstice-mullet-roe": {
  "keyword": "乌鱼子 鲻鱼卵",
  "video": [
   "乌鱼子食材介绍",
   "https://www.bilibili.com/video/BV1h34y1b75v/"
  ],
  "checkedAt": "2026-10-24"
 },
 "gongliao-autumn-japanese-horse-mackerel": {
  "keyword": "日本竹荚鱼 真鲹",
  "video": [
   "竹荚鱼开背与油炸",
   "https://www.bilibili.com/video/BV1w7411z7zc/"
  ],
  "checkedAt": "2026-10-24"
 },
 "taiwan-daxue-mullet": {
  "keyword": "鲻鱼 乌头鱼",
  "video": [
   "老詹说渔 · 浙江市场乌头鱼介绍",
   "https://www.bilibili.com/video/BV1Xd5N6gE4K/"
  ],
  "checkedAt": "2026-10-24"
 },
 "tamsui-xiaoshu-black-bream": {
  "keyword": "黑鲷 黑翅鱼",
  "video": [
   "小珠酱美食 · 清蒸黑鲷",
   "https://www.bilibili.com/video/BV17K4y1T7ry/"
  ],
  "mainland": [
   "惠农网 · 东山黑鲷询购页",
   "https://www.cnhnb.com/gongying/8141268/"
  ],
  "channel": "福建东山供货，页面列有4斤样品规格",
  "checkedAt": "2026-10-24"
 },
 "changhua-xiaoshu-black-over": {
  "keyword": "黄鳍鲷 黄翅鱼 黄脚立",
  "video": [
   "厦门酱油水黄翅鱼",
   "https://www.bilibili.com/video/BV1ii4y1i7Px/"
  ],
  "mainland": [
   "惠农网 · 漳浦黄鳍鲷询购页",
   "https://www.cnhnb.com/gongying/6011914/"
  ],
  "channel": "福建漳浦供货，页面为批发规格",
  "checkedAt": "2026-10-24"
 },
 "taiwan-lichun-mackerel": {
  "keyword": "鲭鱼 青花鱼",
  "video": [
   "呵酱做的饭 · 盐烤鲭鱼",
   "https://www.bilibili.com/video/BV1bFoYBDEfY/"
  ],
  "mainland": [
   "福建商务厅 · 马尾水产市场供应介绍",
   "https://swt.fujian.gov.cn/xxgk/jgzn/jgcs/zmsyq/zmzhc_tpxw/202503/t20250312_6778321.htm"
  ],
  "channel": "福建马尾水产市场；文中列明鲭鱼",
  "checkedAt": "2026-10-24"
 },
 "taiwan-lichiu-northwest-tilefish": {
  "keyword": "马头鱼 方头鱼",
  "video": [
   "老曾家常菜 · 红烧马头鱼",
   "https://www.bilibili.com/video/BV1Xy4y1S7sD/"
  ],
  "mainland": [
   "惠农网 · 霞浦马头鱼询购页",
   "https://www.cnhnb.com/gongying/8507668/"
  ],
  "channel": "福建霞浦供货，页面为5斤起询购",
  "checkedAt": "2026-10-24"
 },
 "suao-frost-beltfish": {
  "keyword": "白带鱼 带鱼",
  "video": [
   "老东北美食 · 红烧带鱼",
   "https://www.bilibili.com/video/BV1JG411977s/"
  ],
  "checkedAt": "2026-10-24"
 }
});
 // Common foods without a distinctive local identity or tasting window stay out of public discovery.
 const withdrawn=Object.freeze({"wuhua-longcun-mountain-sweet-potato":"现有证据所指为普薯32号栽培红薯；高山与冬至后起薯不足以区别普通红薯的风味体验。","chuan-yu-dahan-pea-tips":"在川渝属于普遍冬季蔬菜，产区宽、无地方品种或较佳短窗；采嫩梢本身不足以突出。","huishui-hanlu-autumn-tea-2026":"单次寒露日秋茶开采，缺乏茶种、工艺或较佳短批次，感官描述通用，与其他茶条目重叠。","lanshan-baidieling-guyu-tea":"谷雨茶主要按时间命名，当前没有本地茶种或独特工艺证明，和多条春茶功能重复。","tianjin-huangya-cabbage":"现有正文已说明是大白菜旧称/黄色内叶；小寒食俗不是独立稀少食材，也未锁定真实覆盖软化批次。","cangyuan-bailu-lincang-macadamia":"普通澳洲坚果成熟开季节点，常见成品为干燥熟仁；当前既无短季鲜食体验，也未限定地方品种。","panyu-qingming-sugarcane":"清明假期集市销售高峰，非采收成熟或短赏味窗口；也未限定可辨识的蔗种。","anlu-bailu-huaguoshan-fig":"普通无花果采摘园记录，未指品种，鲜果季9–11月；地点具体不等于食材区域独有。","tengchong-fenghuang-xiaohan-yam":"未说明山药物种或地方品种；仅一次冬挖记录，与在库山药缺少可识别区别。","luocheng-dafu-xiaohan-black-wood-ear":"普通栽培黑木耳，鲜采状态未给出地方品种、独有风味或短季优势。","ganyu-zhaohu-xiaohan-greenhouse-strawberry":"普通设施草莓，仅一次采摘现场，未限定品种、独特形态或较佳赏味短窗。","nanxian-wushenggong-xiaohan-caitai":"普通白菜薹，原记录采摘可延续到4月初，不能用1月单次新闻压成短时令。","danling-great-cold-late-citrus":"品种未指明，留树晚采概念在大量柑橘中存在；原料和在库春见/早熟血橙差异不清楚。","suixian-lishan-great-cold-shiitake":"普通栽培香菇，鲜采而非干品只是常见商品状态；大寒采收新闻不足以形成独特条目。","dahan-green-carp":"全国常见养殖青鱼，产地未限定，现证据只是大寒食材报道，缺少独立地方品种、状态或明确最佳赏味差异。","longyangxia-salmon":"龙羊峡是真实养殖产区，但现源只谈大暑适生水温，未证具体鲑鳟商品种、当季独特品质或短暂最佳期，正文仍是普通三文鱼吃法。","nanjing-lishui-qingming-river-snail":"普通螺蛳加晶桥市集与清明赏味线索，没有证实不同于各地螺蛳的地方种类/品质或生产条件，特色弱。","fuzhou-hanlu-razor-clam-dry":"蛏干作为广泛干货，当前只以寒露晒海味习俗挂节气，没有具体地方工艺或特殊原料差异，特色不足。","lianjiang-great-cold-abalone":"连江是真实鲍鱼养殖产区，但当前只是普通鲜鲍鱼加大寒单日丰收稿，未说明具体地方品种/工法/特殊品质，探索性弱。","yingde-langbu-xiaohan-red-pine-mushroom":"仅有冬季采收报道，红松茸商品身份未厘清，并可能与已核实的赤松茸重复。"});
 const canonical=value=>root.IngredientIdentity?.key(value)||(typeof value==='string'?value:value?.id);
 const scope=food=>['protein','seafood'].includes(food?.category)&&(/台湾|台灣|苏澳|蘇澳|澎湖|高雄|基隆|贡寮|貢寮|彰化|台南|臺南|云林|雲林|屏东|屏東|嘉义|嘉義/.test(food.region||'')||/^(taiwan-|suao-|keelung-|tamsui-|changhua-|penghu-|pengjia-|gongliao-|chiayi-|ntpc-|sihu-|anping-)/.test(food.id||''));
 const entry=food=>evidence[canonical(food)]||null;
 const visible=food=>!Object.hasOwn(withdrawn,canonical(food))&&(!scope(food)||Boolean(entry(food)?.video||entry(food)?.mainland));
 const filter=foods=>(foods||[]).filter(visible);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function links(food){const e=entry(food);if(!e)return '';return `<div class="reader-access-links"><p><strong>大陆查询词</strong> · ${esc(e.keyword)}</p>${e.video?`<a class="verified-video" href="${esc(e.video[1])}" target="_blank" rel="noopener noreferrer">B站 · ${esc(e.video[0])} ↗</a>`:''}${e.mainland?`<a class="mainland-source" href="${esc(e.mainland[1])}" target="_blank" rel="noopener noreferrer">${esc(e.mainland[0])} ↗</a><small>${esc(e.channel)}；下单前确认规格、配送与当日供货。</small>`:''}</div>`;}
 root.ReaderAccess={version,evidence,withdrawn,scope,entry,visible,filter,links};
})(typeof window==='object'?window:globalThis);
