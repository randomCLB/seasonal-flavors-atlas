/* The seasonal page is an edited tasting list. The full catalog stays searchable. */
(function(root){
 'use strict';
 const families=[
  ['pomelo',/柚|文旦/],['kumquat',/金桔|金柑/],['citrus',/柑|橘|桔|橙/],
  ['cherry',/樱桃/],['pear',/(?<!凤)梨/],['peach',/(?<!猕猴)桃/],['waxberry',/杨梅|乌梅种/],['plum',/李|青梅/],
  ['loquat',/枇杷/],['lychee',/荔枝/],['longan',/龙眼/],['persimmon',/柿/],
  ['apple',/苹果/],['mulberry',/桑果|果桑|桑葚(?!花)/],
  ['bamboo-shoot',/竹笋|毛笋|雷笋|苦笋|甜笋|冬笋|春笋|麻笋|茶笋/],
  ['water-bamboo',/茭白/],['water-chestnut',/荸荠|马蹄/],['water-caltrop',/南湖菱|水红菱/],
  ['yam',/山药/],['radish',/萝卜/],['fava',/蚕豆/],['caitai',/菜心|菜薹/],
  ['celery',/芹/],['tatsoi',/塌菜|塌棵菜|泡泡青|香青菜/],
  ['seaweed',/紫菜/],['hairtail',/带鱼/]
 ];
 // Editorial preferences describe a tasting choice, not an objective ranking of all cultivars.
 const preferred={19:['tainan-madou-frost-white-pomelo','xikou-xindongsun','lintong-huojing-shizi'],18:['laiyang-pear','cizhousun','lintong-huojing-shizi'],20:['cangnan-lidong-four-seasons-pomelo','rongan-jingju'],21:['wenzhou-sanyang-ougan'],23:['ningbo-youdai'],1:['pujiang-dahan-chunjian']};
 const group=food=>food.category==='tea'?'tea':families.find(([,pattern])=>pattern.test(food.name))?.[0]||food.id;
 function select(list,termIndex,visual=food=>({src:food.cardImage||food.image})){
  const winners=new Map();
  const score=food=>(preferred[termIndex]?.includes(food.id)?100:0)+(root.CORE_REFINEMENTS?.[food.id]?20:0)+(food.comparison?4:0)+(food.peakTerms?.length===1?3:0);
  for(const food of list){
   const src=visual(food)?.src;
   if(!src||/\.svg(?:[?#]|$)|illustration/i.test(src))continue;
   const key=group(food),current=winners.get(key);
   if(!current||score(food)>score(current))winners.set(key,food);
  }
  const usedImages=new Set();
  return list.filter(food=>{
   if(winners.get(group(food))!==food)return false;
   const src=visual(food).src;if(usedImages.has(src))return false;
   usedImages.add(src);return true;
  });
 }
 function plan(pools,previousPool,quarterKeys=[]){
  let previous=previousPool;
  const lists=pools.map(pool=>{
   const ids=new Set(previous.map(food=>food.id));
   const fresh=pool.filter(food=>!ids.has(food.id));
   const keep=new Set(fresh.map(food=>food.id));
   for(const food of pool.filter(food=>ids.has(food.id)).slice(0,fresh.length))keep.add(food.id);
   const list=pool.filter(food=>keep.has(food.id));previous=list;return list;
  });
  const winners=new Map();
  for(let i=0;i<lists.length;i++)for(const food of lists[i]){
   if(group(food)!=='hairtail'||!quarterKeys[i])continue;
   const key=`${quarterKeys[i]}:hairtail`,current=winners.get(key);
   const preferredId=String(quarterKeys[i]).endsWith('-Q4')?'ningbo-youdai':null;
   if(!current||(food.id===preferredId&&current.id!==preferredId))winners.set(key,food);
  }
  return lists.map((list,i)=>list.filter(food=>{
   if(group(food)!=='hairtail'||!quarterKeys[i])return true;
   return winners.get(`${quarterKeys[i]}:hairtail`)===food;
  }));
 }
 root.SeasonSelection={select,group,plan};
})(typeof window==='undefined'?globalThis:window);
