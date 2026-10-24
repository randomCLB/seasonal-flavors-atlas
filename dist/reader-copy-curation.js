/* Keep useful original cooking information; omit research narration from optional reading slots. */
(function(root){
 'use strict';
 const R=root.ReaderCopy;if(!R)throw Error('ReaderCopy must load first');
 const originalView=R.view;
 const editorial=/本站|未试吃|未亲身|资料整理|官方资料|来源(?:没有|未|描述)|(?:地方|官方)?(?:报道|资料)(?:称|描述|记载|记录|未|没有|所说)|标准(?:称|描述)|不代表|不保证|不是(?:来源|地方|本站)|以.*为准|批次差异|实际批次|来源所述/;
 function useful(value){const s=R.clean(value);return typeof s==='string'&&s.trim()&&!editorial.test(s)?s:'';}
 delete R.notes['he shi-xianfenge'];
 R.notes['wujiang-xiaoxue-fragrant-greens']='十二月初长成，可吃到来年开春。';
 R.notes['cangnan-lidong-four-seasons-pomelo']='果皮较薄，果肉蜜黄或浅红。';
 R.notes['fengqing-xinhua-walnut-flowers']='';
 R.notes['wenzhou-sanyang-ougan']='小雪前后采收，预贮藏四十天以上、转色转味后再鲜食。';
 const final={
  'nanhu-ling':{intro:'嫩菱脆，老菱粉。清洗后充分煮熟，剥壳食用。'},
  'zhenning-honey-plum':{aroma:'',texture:'',taste:''},
  'fengqing-xinhua-walnut-flowers':{aroma:'',texture:'',taste:''},
  'wenzhou-sanyang-ougan':{pitfall:'轻微苦味是瓯柑的风味；出现发酵异味、渗液或软烂时丢弃。'}
 };
 R.view=function(raw){
  const f=originalView(raw);if(!f)return f;
  if(f.eatingMode!=='fresh'){
   if(!f.pitfall)f.pitfall=useful(raw.pitfall);
   if(!f.pair)f.pair=useful(raw.pair);
   f.kitchen=useful(raw.kitchen);
  }
  const normalized=s=>String(s||'').replace(/[\s，。、；：;,.!！]/g,'');
  for(const key of ['aroma','texture']){
   const value=useful(raw[key]);
   if(value&&!normalized(f.short).includes(normalized(value)))f[key]=value;
  }
  f.placeSeasons=(f.placeSeasons||[]).map((p,i)=>({...p,flavorNote:raw.placeSeasons?.[i]?.flavorSource?useful(raw.placeSeasons[i].flavorNote):''}));
  Object.assign(f,final[f.id]||{});
  if(f.eatingMode==='fresh'&&f.pitfall){f.buy=[f.buy,f.pitfall].filter(Boolean).join('');f.pitfall='';}
  // Evidence-only comparison links remain reachable even when the redundant comparison paragraph is hidden.
  if(raw.comparison?.source&&!f.sources?.some(([,url])=>url===raw.comparison.source))f.readerExtraSource=raw.comparison.source;
  return f;
 };
})(typeof window==='object'?window:globalThis);
