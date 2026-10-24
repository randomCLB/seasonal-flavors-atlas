/* Stable ingredient identities. Regional/seasonal observations remain independent evidence.
 * A culinary market name is not a biological-species assertion. Cultivars and edible parts
 * stay separate unless an explicit reviewed merge below says otherwise. */
(function(root){
 'use strict';
 const version='2026.10.24-identity.1',groups=[],lookup=new Map();
 function add(primary,name,family,others,kind='ingredient',references=[]){
  const group=Object.freeze({id:primary,name,family,kind,ids:Object.freeze([primary,...others.split(' ').filter(Boolean)]),references});
  for(const id of group.ids){if(lookup.has(id))throw Error('Ambiguous ingredient identity: '+id);lookup.set(id,group);}groups.push(group);
 }
 add('huangbohai-yingzhuaxia','鹰爪虾（蛎虾）','eagle-claw-shrimp','qingdao-shazikou-li-xia qingdao-shazikou-li-xia-shrimp-2026');
 add('hejiang-late-lychee','合江晚熟荔枝','lychee','hejiang-xiaoshu-late-lychee');
 add('emei-wenchun-dahan-early-tea','峨眉问春早茶','tea','jiangan-changsha-xiaohan-early-tea-first-pick');
 add('taiwan-jialiao-bream','真鲷（嘉鱲）','sea-bream','taiwan-jingzhe-jiala tamsui-xiaoshu-jiala taiwan-lidong-east-jiana-fish taiwan-rainwater-jialai-fish keelung-jingzhe-jiaranyu','market-name',[
  ['台湾鱼类资料库：真鲷及嘉鱲、加蚋、加魶俗名','https://fishdb.sinica.edu.tw/taxon/382642-fishdb/specimen']
 ]);
 add('taiwan-lidong-east-red-eye-bream','红目鰱','red-eye-fish','taiwan-lichiu-red-eye-bream','market-name');
 add('keelung-north-xiaoshu-red-emperor-bream','赤宗（赤鯮）','sea-bream','taiwan-qiufen-northeast-red-emperor','market-name',[
  ['台湾鱼类资料库：黄背牙鲷及赤鯮俗名','https://fishdb.sinica.edu.tw/taxon/395481-fishdb'],
  ['台湾鱼类资料库：阿部牙鲷及赤鯮俗名','https://fishdb.sinica.edu.tw/taxon/395231-fishdb']
 ]);
 add('taiwan-frost-white-belly-seerfish','白腹鰆','seerfish','taiwan-hanlu-whitebelly-mackerel taiwan-qiufen-lukang-white-belly-seerfish taiwan-daxue-whitebelly-mackerel','market-name');
 add('suao-dahan-black-skin-marlin','黑皮旗鱼','billfish','taiwan-qiufen-northeast-black-marlin','market-name');
 add('taiwan-lidong-east-sailfish','旗鱼','billfish','sihu-xiaohan-sailfish taiwan-qiufen-northeast-sailfish','market-name');
 add('taiwan-qingming-liuqiu-bullet-bonito','扁花鰹（烟仔鱼）','bullet-bonito','ntpc-xiazhi-bullet-bonito','market-name',[
  ['台湾鱼类资料库：扁花鰹及烟仔鱼俗名','https://fishdb.sinica.edu.tw/taxon/382486-fishdb']
 ]);
 add('donghai-dongzhi-cuttlefish','墨鱼（乌贼）','cuttlefish','taiwan-lichiu-kaohsiung-squid keelung-hanlu-cuttlefish','market-name');
 add('suao-frost-beltfish','白带鱼','hairtail','taiwan-lichun-hairtail','market-name');
 add('bishan-ercai','儿菜（抱子芥）','child-mustard','fushun-xiaohan-ertai');
 add('jiande-chuncai','莼菜','water-shield','suzhou-dongshan-taihu-water-shield');
 add('gaochun-liuyuehuang','六月黄','june-yellow-crab','suzhou-june-yellow-late-may-market');
 add('mouding-winter-early-fava','鲜蚕豆','fava','changshu-lixia-fresh-fava');
 add('luquan-greenhouse-toon-first-pick','香椿芽','toon-shoot','hanzhong-qingming-xiangchun-shoots');
 add('guangning-lidong-ma-bamboo-shoot','麻竹笋','bamboo-shoot','lianjiang-xiaoshu-june-hemp-bamboo-shoot');
 add('shidian-lixia-qingmei','青梅','green-plum','dazhou-tanzi-mangzhong-green-plum-last-pick');
 add('hengyang-zhuhui-golden-pomelo','黄金贡柚','pomelo','linwu-liping-golden-pomelo');
 add('minhou-baisha-late-longan','鲜龙眼','longan','tainan-dongshan-fresh-longan fuzhou-longxiangdao-bailu-longan');
 add('cinenya','刺嫩芽','aralia-shoot','fushun-niuyake-greenhouse-dahan');
 const familyOverrides=Object.freeze({
  'hubei-ejiao4-summer-jiaobai':'water-bamboo',
  'caidian-summer-solstice-fresh-lotus-pod':'lotus-seed',
  'qingdao-shazikou-qingming-spring-mackerel':'seerfish',
  'beian-xiaohan-white-lover-strawberry':'strawberry',
  'ganyu-zhaohu-xiaohan-greenhouse-strawberry':'strawberry',
  'mengzi-june-red-pomegranate':'pomegranate',
  'henan-qiufen-tunisian-softseed-pomegranate':'pomegranate'
 });
 // Keep the recently expanded recipe rather than reverting to an older short one
 // merely because its source record supplied the stable identity ID.
 const recipeSources=Object.freeze({
  'guangning-lidong-ma-bamboo-shoot':'lianjiang-xiaoshu-june-hemp-bamboo-shoot',
  'shidian-lixia-qingmei':'dazhou-tanzi-mangzhong-green-plum-last-pick',
  'hejiang-late-lychee':'hejiang-xiaoshu-late-lychee'
 });
 const key=value=>{const id=typeof value==='string'?value:value?.id;return lookup.get(id)?.id||id;};
 const descriptor=value=>lookup.get(typeof value==='string'?value:value?.id);
 const uniq=values=>[...new Set(values.filter(v=>v!==undefined&&v!==null&&v!==''))];
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function family(food){
  if(familyOverrides[food.id])return familyOverrides[food.id];
  if(food.category==='vegetable'&&/笋|筍/.test(food.name||'')&&!/茭/.test(food.name||''))return 'bamboo-shoot';
  return descriptor(food)?.family||null;
 }
 function members(value,catalog=root.FOODS||[]){const id=key(value);return catalog.filter(f=>key(f)===id);}
 function present(food){const d=descriptor(food);return d?{...food,id:d.id,name:d.name,ingredientId:d.id,sourceId:food.sourceId||food.id}:food;}
 function sources(records,extra=[]){const seen=new Set();return records.flatMap(f=>f.sources||[]).concat(extra).filter(pair=>{const id=JSON.stringify(pair);if(seen.has(id))return false;seen.add(id);return true;});}
 function places(records){
  const seen=new Map();
  for(const record of records)for(const p of record.placeSeasons||[]){
   const id=JSON.stringify([p.name,p.lat,p.lon,p.source,p.seasonNote,p.flavorNote,p.flavorSource]);
   const old=seen.get(id);if(old)old.months=uniq([...old.months,...(p.months||[])]).sort((a,b)=>a-b);
   else seen.set(id,{...p,months:[...(p.months||[])],sourceRecordId:record.id});
  }
  return [...seen.values()];
 }
 function make(records){
  const d=descriptor(records[0]);if(!d||records.length===1&&records[0].identityMembers)return records[0];
  const primary=records.find(f=>f.id===d.id)||records[0],all=members(d.id);
  const origin=places(records),peakMonths=uniq(records.flatMap(f=>f.peakMonths||[])).sort((a,b)=>a-b);
  const known=records.find(f=>root.PhotoReview?.records?.[f.id]?.src)||records.find(f=>f.cardImage||f.image)||primary;
  return {...primary,id:d.id,name:d.name,ingredientId:d.id,sourceId:primary.id,
   identityMembers:records.map(f=>f.id),identityKind:d.kind,
   alias:uniq([d.name,...records.flatMap(f=>[f.name,...(f.alias||[])]),...all.flatMap(f=>[f.name,...(f.alias||[])])]),
   region:uniq(records.map(f=>f.region)).join(' / '),
   peakMonths,months:uniq(records.flatMap(f=>f.months||[])).sort((a,b)=>a-b),
   seasonLabel:peakMonths.map(m=>m+'月').join('、'),
   placeSeasons:origin,places:origin,sources:sources(records,d.references),
   identityPhoto:root.PhotoReview?.records?.[known.id],cardImage:known.cardImage||known.image,image:known.image||known.cardImage
  };
 }
 function catalog(records=root.FOODS||[]){
  const buckets=new Map();for(const f of records){const id=key(f);if(!buckets.has(id))buckets.set(id,[]);buckets.get(id).push(f);}return [...buckets.values()].map(make);
 }
 function detail(value,records=root.FOODS||[]){const list=members(value,records);return list.length?make(list):null;}
 function reading(food){
  const read=raw=>{const merged={...raw,...root.EDITORIAL_DETAILS?.[raw.id]};return root.ReaderCopy?root.ReaderCopy.view(merged):merged;};
  const view=read(food);if(!food.identityMembers)return view;
  for(const field of ['id','name','ingredientId','identityMembers','identityKind','region','alias','seasonLabel','placeSeasons','places','sources','identityPhoto'])if(Object.hasOwn(food,field))view[field]=food[field];
  const sourceId=recipeSources[key(food)],raw=(root.FOODS||[]).find(f=>f.id===sourceId);
  if(raw){const recipe=read(raw);for(const field of ['recipeTitle','ingredients','steps','finish','pitfall','pair','kitchen','storage','eatingMode'])if(Object.hasOwn(recipe,field))view[field]=Array.isArray(recipe[field])?[...recipe[field]]:recipe[field];view.recipeSourceId=sourceId;}
  return view;
 }
 function sourceHtml(food){
  const records=members(food.id);if(records.length<2)return '';
  const buckets=new Map(),notes=new Set([food.safety]);
  for(const raw of records){
   const f=root.ReaderCopy?root.ReaderCopy.view({...raw,...root.EDITORIAL_DETAILS?.[raw.id]}):raw;
   const period=f.seasonLabel||(f.peakMonths||[]).map(m=>m+'月').join('、'),token=JSON.stringify([f.region,period,f.sourceYears]);
   if(!buckets.has(token))buckets.set(token,{region:f.region,period,years:f.sourceYears||[],rows:[]});
   buckets.get(token).rows.push({raw,view:f});
  }
  const rows=[...buckets.values()].map(group=>{
   const names=uniq(group.rows.map(x=>x.raw.name)),safety=uniq(group.rows.map(x=>x.view.safety)).filter(value=>!notes.has(value));safety.forEach(value=>notes.add(value));
   const links=sources(group.rows.map(x=>x.view));
   return `<article data-origin-record="${esc(group.rows.map(x=>x.raw.id).join(' '))}"><h4>${esc(group.region)}</h4><p>${esc(group.period)}${group.years.length?' · '+esc(group.years.join('、'))+'年':''}</p><p class="identity-local-name">当地名称：${esc(names.join('、'))}</p>${safety.map(value=>`<p class="identity-preparation">${esc(value)}</p>`).join('')}${links.map(([title,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a>`).join(' · ')}</article>`;
  });
  return `<div class="origin-details identity-origins"><h3>各地产期与名称</h3>${rows.join('')}</div>`;
 }
 function mapEntries(entries){
  const buckets=new Map();for(const e of entries){const id=key(e.food);if(!buckets.has(id))buckets.set(id,[]);buckets.get(id).push(e);}
  return [...buckets.values()].map(items=>({...items[0],food:present(items[0].food),place:{...items[0].place,name:uniq(items.map(x=>x.place.name)).join('、'),months:uniq(items.flatMap(x=>x.place.months||[])).sort((a,b)=>a-b)}}));
 }
 function migrate(saved){
  const result={};for(const [id,value]of Object.entries(saved||{})){const canonical=key(id),prior=result[canonical];if(!prior||value.updatedAt>prior.updatedAt||value.updatedAt===prior.updatedAt&&value.state==='tried')result[canonical]={...value};}return result;
 }
 root.IngredientIdentity={version,groups:Object.freeze(groups),familyOverrides,recipeSources,key,descriptor,family,members,present,catalog,detail,reading,sourceHtml,mapEntries,migrate};
})(typeof window==='object'?window:globalThis);
