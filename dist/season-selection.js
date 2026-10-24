/* The seasonal page is an edited tasting list. The full catalog stays searchable. */
(function(root){
 'use strict';
 const editorialHolds=Object.freeze({
  'suao-jingzhe-huahui':'来源仅俗名，标准商品名与具体鱼种待确认',
  'suao-jingzhe-muhou':'来源仅俗名，标准商品名与具体鱼种待确认',
  'suao-jingzhe-dingmian':'来源仅俗名，标准商品名与具体鱼种待确认',
  'keelung-jingzhe-jiaranyu':'来源仅俗名，标准商品名与具体鱼种待确认',
  'keelung-jingzhe-wenyu':'来源仅俗名，标准商品名与具体鱼种待确认',
  'taiwan-hanlu-whitebelly-mackerel':'来源仅俗名，标准商品名与具体鱼种待确认',
  'taiwan-lichiu-penghu-shrimp':'来源仅列虾类渔讯，具体虾种与可辨认商品待确认',
  'taiwan-qiufen-northeast-shrimp':'来源仅列虾类渔讯，具体虾种与可辨认商品待确认',
  'fuzhou-hanlu-liaozai-clam':'来源仅列蚬类地方俗名，具体品类与可辨认商品待确认'
 });
 // Browsing families group similar tasting choices, not biological species.
 // Keep edible parts separate and retain every regional record in the catalog.
 const fruitFamilies=[
  ['rose-fruit',/刺梨/],['hickory',/山核桃/],['walnut',/核桃/],
  ['pomelo',/柚|文旦/],['kumquat',/金桔|金柑/],['citrus',/柑|橘|桔|橙/],
  ['cherry',/樱桃/],['pear',/(?<!凤)梨/],['peach',/^(?!.*荔)(?=.*(?<!猕猴)桃)/],['waxberry',/杨梅|乌梅种/],
  ['green-plum',/青梅/],['plum',/李/],['loquat',/枇杷/],['lychee',/荔枝|仙桃荔/],['longan',/龙眼/],
  ['persimmon',/柿/],['apple',/苹果/],['mulberry',/桑果|果桑|桑葚(?!花)/],
  ['emblica',/余甘子/],['crabapple',/海棠果|海棠$/],['sugarcane',/甘蔗|清明蔗/],
  ['chestnut',/板栗|锥栗/],['fig',/无花果/]
 ];
 const plantFamilies=[
  ['lei-bamboo-shoot',/雷竹笋|雷笋/],['ma-bamboo-shoot',/麻竹笋|麻笋/],
  ['moso-bamboo-shoot',/毛笋|冬笋/],['thorn-bamboo-shoot',/刺竹笋/],
  ['bitter-bamboo-shoot',/苦笋/],['sweet-bamboo-shoot',/甜笋/],
  ['water-bamboo',/茭白/],['water-chestnut',/荸荠|马蹄/],['water-caltrop',/南湖菱|水红菱/],
  ['yam',/山药/],['radish',/萝卜/],['fava',/蚕豆/],['child-mustard',/儿菜|儿薹/],
  ['choy-sum',/菜心/],['white-caitai',/白菜薹/],['red-caitai',/红菜薹|洪山菜薹|鄂红4号.*菜薹/],
  ['water-celery',/水芹|竹梗芹|白芹/],['celery',/芹菜/],
  ['tatsoi',/塌菜|塌棵菜|泡泡青|香青菜/],['water-shield',/莼菜/],
  ['toon-shoot',/香椿/],['aralia-shoot',/刺嫩芽|刺老芽|刺脑包/],
  ['lotus-root',/莲藕|玉臂藕/],['lotus-seed',/莲蓬|鲜莲子/],['sweet-corn',/甜玉米|农科糯336/],['seaweed',/紫菜/]
 ];
 const seafoodFamilies=[
  ['mullet-roe',/乌鱼子|烏魚子/],['billfish',/旗鱼|旗魚/],['mullet',/乌鱼|烏魚|梭鱼|梭魚/],['hairtail',/带鱼|帶魚/],
  ['seerfish',/白腹鰆|高丽.*鰆|闊腹鰆|鰆|马鲛|馬鮫|马加|馬加/],
  ['sea-bream',/黑鲷|黄鳍鲷|黄背牙鲷|赤宗|赤鯮|嘉鱲|嘉腊|嘉臘|加腊|真鲷|真鯛/],
  ['bullet-bonito',/扁花鰹|炸弹鱼/],['red-eye-fish',/红目鰱|紅目鰱/],
  ['cuttlefish',/墨鱼|墨魚|乌贼|烏賊|目贼/],['neritic-squid',/小卷|锁管|鎖管/],
  ['eagle-claw-shrimp',/蛎虾|鹰爪虾|灯笼红虾/],
  ['june-yellow-crab',/六月黄/],['mud-crab',/青蟹|红鲟/],['jialai-fish',/加蚋鱼/]
 ];
 const preferred={19:['tainan-madou-frost-white-pomelo','xikou-xindongsun','lintong-huojing-shizi'],18:['laiyang-pear','cizhousun','lintong-huojing-shizi'],20:['cangnan-lidong-four-seasons-pomelo','rongan-jingju'],21:['wenzhou-sanyang-ougan'],23:['ningbo-youdai'],1:['pujiang-dahan-chunjian']};
 const match=(families,text)=>families.find(([,pattern])=>pattern.test(text))?.[0];
 function group(food){
  if(food.category==='tea')return 'tea';
  const name=food.name||'',category=food.category;
  if(!category||category==='fruit'||category==='nuts'||category==='seed'){const family=match(fruitFamilies,name);if(family)return family;}
  if(!category||category==='vegetable'){const family=match(plantFamilies,name);if(family)return family;}
  if(!category||category==='protein'||category==='seafood'){
   const family=match(seafoodFamilies,[name,...(food.alias||[])].join(' '));if(family)return family;
   if(/紫菜/.test(name))return 'seaweed';
  }
  return food.id;
 }
 function select(list,termIndex,visual=food=>({src:food.cardImage||food.image})){
  const winners=new Map(),featureId=root.SEASON_FEATURES?.[termIndex]?.foodId;
  const score=food=>(food.id===featureId?1000:0)+(preferred[termIndex]?.includes(food.id)?100:0)+(root.CORE_REFINEMENTS?.[food.id]?20:0)+(food.comparison?4:0)+(food.peakTerms?.length===1?3:0);
  for(const food of list){
   if(Object.hasOwn(editorialHolds,food.id))continue;
   // Missing photography is a presentation state, never a seasonal eligibility rule.
   const key=group(food),current=winners.get(key);
   if(!current||score(food)>score(current))winners.set(key,food);
  }
  return list.filter(food=>winners.get(group(food))===food);
 }
 function plan(pools,previousPool=[],quarterKeys=[],featuredIds=[]){
  const winners=new Map();
  for(let i=0;i<pools.length;i++)for(const food of pools[i]){
   if(group(food)!=='hairtail'||!quarterKeys[i])continue;
   const key=`${quarterKeys[i]}:hairtail`,current=winners.get(key),preferredId=String(quarterKeys[i]).endsWith('-Q4')?'ningbo-youdai':null;
   if(!current||(food.id===preferredId&&current.id!==preferredId))winners.set(key,food);
  }
  let previous=previousPool;
  return pools.map((candidates,i)=>{
   const pool=candidates.filter(food=>group(food)!=='hairtail'||!quarterKeys[i]||winners.get(`${quarterKeys[i]}:hairtail`)?.id===food.id);
   const ids=new Set(previous.map(food=>food.id)),fresh=pool.filter(food=>!ids.has(food.id)),feature=pool.find(food=>food.id===featuredIds[i]),repeated=pool.filter(food=>ids.has(food.id));
   if(feature&&ids.has(feature.id))repeated.sort((a,b)=>Number(b===feature)-Number(a===feature));
   const keep=new Set(fresh.map(food=>food.id));for(const food of repeated.slice(0,fresh.length))keep.add(food.id);
   if(!keep.size&&pool.length)keep.add((feature||pool[0]).id);
   const list=pool.filter(food=>keep.has(food.id));previous=list;return list;
  });
 }
 root.SeasonSelection={select,group,plan,holds:editorialHolds,labels:{billfish:'旗鱼类',seerfish:'马鲛与鰆鱼','sea-bream':'海鲷类',cuttlefish:'乌贼类','neritic-squid':'锁管与小卷'},variants:(food,catalog)=>(catalog||[]).filter(other=>other.id!==food.id&&group(other)===group(food))};
})(typeof window==='undefined'?globalThis:window);
