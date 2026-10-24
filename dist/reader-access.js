/* Public admission for regional seafood records. Original observations remain untouched.
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
 const canonical=value=>root.IngredientIdentity?.key(value)||(typeof value==='string'?value:value?.id);
 const scope=food=>['protein','seafood'].includes(food?.category)&&(/台湾|台灣|苏澳|蘇澳|澎湖|高雄|基隆|贡寮|貢寮|彰化|台南|臺南|云林|雲林|屏东|屏東|嘉义|嘉義/.test(food.region||'')||/^(taiwan-|suao-|keelung-|tamsui-|changhua-|penghu-|pengjia-|gongliao-|chiayi-|ntpc-|sihu-|anping-)/.test(food.id||''));
 const entry=food=>evidence[canonical(food)]||null;
 const visible=food=>!scope(food)||Boolean(entry(food)?.video||entry(food)?.mainland);
 const filter=foods=>(foods||[]).filter(visible);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function links(food){const e=entry(food);if(!e)return '';return `<div class="reader-access-links"><p><strong>大陆查询词</strong> · ${esc(e.keyword)}</p>${e.video?`<a class="verified-video" href="${esc(e.video[1])}" target="_blank" rel="noopener noreferrer">B站 · ${esc(e.video[0])} ↗</a>`:''}${e.mainland?`<a class="mainland-source" href="${esc(e.mainland[1])}" target="_blank" rel="noopener noreferrer">${esc(e.mainland[0])} ↗</a><small>${esc(e.channel)}；下单前确认规格、配送与当日供货。</small>`:''}</div>`;}
 root.ReaderAccess={version,evidence,scope,entry,visible,filter,links};
})(typeof window==='object'?window:globalThis);
