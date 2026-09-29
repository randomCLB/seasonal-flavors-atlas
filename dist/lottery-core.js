/* Pure, dependency-free scheduling engine. No network, DOM, or account access. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FengwuLottery = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const DAY = 86400000, ZONE = 'Asia/Shanghai';
  const RESTRICTIONS = ['vegan','meat','seafood','egg','milk','soy','wheat','peanut','sesame'];
  const TASTES = {sour:'酸',sweet:'甜',bitter:'苦',spicy:'辣／辛',salty:'咸',umami:'鲜'};
  const TEXTURES = {crisp:'清脆爽口',soft:'软糯绵密',tender:'柔嫩细滑',chewy:'弹韧有嚼劲',juicy:'多汁水润'};
  const COOKING = {fresh:'鲜吃、熟后凉拌',stirfry:'快炒、小炒',steam:'清蒸、白灼',soup:'汤羹、炖煮'};
  function hash(text) { let h=2166136261; for(let i=0;i<text.length;i++) h=Math.imul(h^text.charCodeAt(i),16777619); return (h>>>0).toString(16); }
  function signature(f) { return hash([f.recipeTitle||'',f.ingredients||'',(f.steps||[]).join('\n'),f.finish||'',f.safety||''].join('|')); }
  function random(seed) { let n=parseInt(hash(String(seed)),16); return ()=> {n+=0x6D2B79F5;let t=n;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}; }
  function dayAt(time,zone=ZONE) {const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(time)).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
  function validDay(day) {return /^\d{4}-\d{2}-\d{2}$/.test(day)&&new Date(day+'T12:00:00Z').toISOString().slice(0,10)===day;}
  function addDays(day,n) {if(!validDay(day)||!Number.isInteger(n))throw Error('日期无效');return new Date(Date.parse(day+'T12:00:00Z')+n*DAY).toISOString().slice(0,10);}
  function eventsFrom(times,names) {return Object.entries(times).flatMap(([year,stamps])=>stamps.map((time,index)=>({year:Number(year),index,time,name:names[index]}))).sort((a,b)=>a.time-b.time);}
  function nextSix(events,now=Date.now()) {const future=events.filter(e=>e.time>now);if(future.length<7)throw Error('节气数据不足，无法安排完整六段时间。');return future.slice(0,6).map((e,i)=>({...e,key:`${e.year}-${e.index}`,end:future[i+1].time,startDay:dayAt(e.time),endDay:addDays(dayAt(future[i+1].time),-1)}));}
  function validatePrefs(p) {
    if(!p||!Array.isArray(p.avoid)||p.avoid.some(x=>!RESTRICTIONS.includes(x)))throw Error('请重新确认忌口选项。');
    for(const [key,options,label] of [['tastes',TASTES,'味道'],['textures',TEXTURES,'质地'],['cooking',COOKING,'料理']]) {
      if(!Array.isArray(p[key])||p[key].length>2||new Set(p[key]).size!==p[key].length||p[key].some(x=>!Object.hasOwn(options,x)))throw Error(`${label}最多选择两项，请按新版五问重新选择。`);
    }
    if(![0,1,2].includes(p.curiosity))throw Error('请选择猎奇程度。');
    if(typeof (p.excludeText||'')!=='string'||(p.excludeText||'').length>200)throw Error('其他忌口请限制在200字内。');
    return p;
  }
  function resolveExclusions(text,foods) {
    const words=(text||'').split(/[,，、;；\n]+/).map(x=>x.trim()).filter(Boolean),ids=new Set(),unknown=[];
    for(const word of words){const found=foods.filter(f=>[f.name,f.id,...(f.alias||[])].some(x=>x===word));if(found.length)found.forEach(f=>ids.add(f.id));else unknown.push(word);}
    return {ids,unknown};
  }
  function eligible(food,profile,prefs,excludeIds=new Set()) {
    if(!profile||profile.disabled||profile.signature!==signature(food)||excludeIds.has(food.id))return false;
    if(!Array.isArray(profile.avoid)||!Number.isInteger(profile.effort))return false;
    const avoid=new Set(prefs.avoid);if(avoid.has('vegan'))['meat','seafood','egg','milk','honey'].forEach(x=>avoid.add(x));
    return ![...profile.avoid,...(profile.uncertain||[])].some(x=>avoid.has(x));
  }
  function candidateDays(food,profile,slot,events) {
    const places=food.placeSeasons||[],result=[];
    for(let d=slot.startDay;d<=slot.endDay;d=addDays(d,1)) {
      const [year,month,date]=d.split('-').map(Number);
      if(!(food.peakMonths||[]).includes(month)||date<(profile.notBefore?.[month]||1))continue;
      const start=profile.startTerm??food.seasonStartTerm;
      if(Number.isInteger(start)){
        const anchorYear=start>=17&&month<9?year-1:year;
        const anchor=events.find(e=>e.year===anchorYear&&e.index===start);
        if(!anchor||d<dayAt(anchor.time))continue;
      }
      // Never pool an out-of-season place into a food's other origin.
      const place=places.find(p=>(p.months||[]).includes(month)&&p.source);
      if(place)result.push({day:d,place:place.name,source:place.source,precision:place.precision||food.seasonPrecision||'month'});
    }
    return result;
  }
  function poolFor(foods,profiles,prefs,slot,events) {
    validatePrefs(prefs);const excluded=resolveExclusions(prefs.excludeText,foods);
    if(excluded.unknown.length)throw Error(`这些忌口尚未识别：${excluded.unknown.join('、')}。请选上面的限制或输入本站食材全名，不能忽略后继续。`);
    return foods.filter(f=>eligible(f,profiles[f.id],prefs,excluded.ids)).map(f=>({id:f.id,days:candidateDays(f,profiles[f.id],slot,events)})).filter(x=>x.days.length);
  }
  // Tags describe the declared food state and recipe, never user familiarity.
  function sensorySignature(food) {return hash([food.taste||'',food.aroma||'',food.texture||'',food.state||'',(food.flavor||[]).join('|'),signature(food)].join('~'));}
  function senses(food,profile) {
    const p=profile?.senses;
    if(!p||p.signature!==sensorySignature(food))return {tastes:[],recipeTastes:[],textures:[],cooking:[],features:[]};
    return p;
  }
  function matchInfo(food,profile,prefs) {
    const p=senses(food,profile),taste=prefs.tastes.filter(x=>p.tastes.includes(x));
    return {tastes:taste,recipeTastes:prefs.tastes.filter(x=>!taste.includes(x)&&p.recipeTastes.includes(x)),textures:prefs.textures.filter(x=>p.textures.includes(x)),cooking:prefs.cooking.filter(x=>p.cooking.includes(x)),features:p.features};
  }
  function scoreFood(food,profile,prefs) {
    const m=matchInfo(food,profile,prefs);
    return 2+m.tastes.length*4+m.recipeTastes.length*3+m.textures.length*4+m.cooking.length*3+prefs.curiosity*Math.min(m.features.length,2)*0.8;
  }
  function recommendationReason(food,profile,prefs) {
    const m=matchInfo(food,profile,prefs),parts=[];
    if(m.tastes.length)parts.push(`食材的${m.tastes.map(k=>TASTES[k]).join('、')}味合你偏好`);
    if(m.recipeTastes.length)parts.push(`这道做法带出你选的${m.recipeTastes.map(k=>TASTES[k]).join('、')}味（来自配料或调味）`);
    if(m.textures.length)parts.push(`质地偏${m.textures.map(k=>TEXTURES[k]).join('、')}`);
    if(m.cooking.length)parts.push(`做法属于你选的${m.cooking.map(k=>COOKING[k]).join('、')}`);
    if(!parts.length)parts.push('这味符合本次忌口筛选与时令范围，口味未必正中所选，留作另一种选择');
    if(prefs.curiosity>0&&m.features.length)parts.push(`值得留意的特点：${m.features.slice(0,2).join('；')}`);
    return parts.join('；')+'。';
  }
  function draw({foods,profiles,prefs,events,slots,seed,locked={},exclude={}}) {
    validatePrefs(prefs);const byId=Object.fromEntries(foods.map(f=>[f.id,f]));
    const pools=slots.map(s=>poolFor(foods,profiles,prefs,s,events).filter(c=>c.id!==exclude[s.key]));
    const lockedIds=new Set();slots.forEach((s,i)=>{if(locked[s.key]){if(lockedIds.has(locked[s.key])||!pools[i].some(c=>c.id===locked[s.key]))throw Error('锁定食材已不符合当前条件，请解锁后再抽。');lockedIds.add(locked[s.key]);}});
    const rng=random(seed);let best=null,bestScore=-Infinity;
    // Augmenting-path matching guarantees maximum filled slots; seeded trials
    // choose among maximum matchings for taste and diversity. Locks never move.
    for(let trial=0;trial<64;trial++) {
      const order=pools.map((p,i)=>({i,n:p.length,jitter:rng()})).filter(x=>!locked[slots[x.i].key]).sort((a,b)=>a.n-b.n||a.jitter-b.jitter);
      const lists=pools.map(p=>p.filter(c=>!lockedIds.has(c.id)).map(c=>({...c,rank:scoreFood(byId[c.id],profiles[c.id],prefs)+rng()*1.5})).sort((a,b)=>b.rank-a.rank));
      const owners=new Map(),assigned=slots.map(s=>locked[s.key]||null);
      function visit(i,seen){for(const c of lists[i]){if(seen.has(c.id))continue;seen.add(c.id);const other=owners.get(c.id);if(other===undefined||visit(other,seen)){owners.set(c.id,i);assigned[i]=c.id;return true;}}return false;}
      for(const {i} of order)visit(i,new Set());
      const counts={};let points=0;for(const id of assigned){if(!id)continue;const family=profiles[id].family;points+=1000+scoreFood(byId[id],profiles[id],prefs)-(counts[family]||0)*2;counts[family]=(counts[family]||0)+1;}
      points+=rng()*1.5;if(points>bestScore){bestScore=points;best=assigned;}
    }
    return slots.map((s,i)=>{const c=pools[i].find(c=>c.id===best[i]);if(!c)return {...s,foodId:null,reason:'本节气还没有符合这些条件、且不与其他签重复的食材。不会放宽忌口凑数。'};const preferred=addDays(s.startDay,4),pick=c.days.find(d=>d.day>=preferred)||c.days[0];return {...s,foodId:c.id,eatDay:pick.day,availableDays:c.days.map(d=>d.day),place:pick.place,source:pick.source,precision:pick.precision,locked:!!locked[s.key]};});
  }
  function zonedTime(day,clock,zone) {
    if(!validDay(day)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(clock))throw Error('提醒日期或时间无效');
    const target=Date.parse(`${day}T${clock}:00Z`);let guess=target;
    const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
    for(let i=0;i<5;i++){const p=Object.fromEntries(fmt.formatToParts(new Date(guess)).map(x=>[x.type,x.value]));const observed=Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);const delta=target-observed;if(!delta)return guess;guess+=delta;}
    throw Error('该时区不存在这个本地时刻，请换一个提醒时间。');
  }
  function stamp(ms){if(!Number.isFinite(ms))throw Error('时间无效');return new Date(ms).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');}
  function escapeText(value){return String(value).replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');}
  function fold(line){let lines=[],part='',length=0;for(const c of line){const n=new TextEncoder().encode(c).length;if(length+n>75){lines.push(part);part=' ';length=1;}part+=c;length+=n;}lines.push(part);return lines.join('\r\n');}
  function calendarEvents(plan,foods,options={},now=Date.now()) {
    const byId=Object.fromEntries(foods.map(f=>[f.id,f]));const zone=options.zone||ZONE,clock=options.clock||'19:00';
    const lead=Number(options.lead??3);if(!Number.isInteger(lead)||lead<0||lead>7)throw Error('提前天数应为0至7天。');
    const base=new URL(options.baseURL||'https://randomclb.github.io/seasonal-flavors-atlas/');if(!['https:','http:'].includes(base.protocol))throw Error('详情地址无效');
    const included=options.included?new Set(options.included):null;const rows=[];
    for(const slot of plan.slots){if(!slot.foodId||included&&!included.has(slot.key))continue;const f=byId[slot.foodId];if(!f)throw Error('食材数据已变更，请重新抽签。');
      const eatDay=options.eatDays?.[slot.key]||slot.eatDay;if(!slot.availableDays.includes(eatDay))throw Error(`${slot.name}的日期不在本签有资料支持的时令范围内。`);
      let day=addDays(eatDay,-lead),start=zonedTime(day,clock,zone),late=false;
      if(start<=now){day=dayAt(now,zone);start=zonedTime(day,clock,zone);if(start<=now){day=addDays(day,1);start=zonedTime(day,clock,zone);}late=true;}
      if(day>eatDay)throw Error(`${slot.name}的采购时间已过，请取消这一项或重新抽签。`);
      const url=new URL('index.html',base);url.searchParams.set('food',f.id);
      const description=[`建议尝鲜：${eatDay}。日期是计划，不是成熟日或到货保证。`,`产地线索：${slot.place}`,`做法：${f.recipeTitle}`,`准备（2人份）：${f.ingredients}`,`采购搜索词：${f.search}`,`买前确认：${f.buy}`,`到货与保存：${f.storage||'按具体商品标签和商家说明保存，尽快安排食用。'}`,`注意：${f.safety||'核对商品配料与鲜度；网站不能确认实际商品的过敏原交叉接触。'}`,`时令依据：${f.season}`,`${lead}天是询货提前量，不是储存期限或物流承诺。`,late?'原询货时间已过，本次改到最近的未来提醒时刻。':'',`完整吃法：${url.href}`].filter(Boolean).join('\n\n');
      rows.push({key:slot.key,day,clock,zone,start,end:start+15*60000,title:`风物｜${slot.name}：询货 · ${f.name}`,description,url:url.href,uid:`${hash(plan.id)}-${slot.key}@seasonal-flavors-atlas`,eatDay,late});
    }return rows;
  }
  function makeICS(plan,foods,options={},now=Date.now()) {
    const rows=calendarEvents(plan,foods,options,now);if(!rows.length)throw Error('没有勾选可导出的食材。');
    const dt=stamp(plan.updatedAt||plan.createdAt),lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Fengwu//Seasonal Lottery 1.1//ZH','CALSCALE:GREGORIAN','X-WR-CALNAME:风物时令签'];
    for(const e of rows)lines.push('BEGIN:VEVENT',`UID:${e.uid}`,`DTSTAMP:${dt}`,`LAST-MODIFIED:${dt}`,`SEQUENCE:${plan.revision||0}`,`DTSTART:${stamp(e.start)}`,`DTEND:${stamp(e.end)}`,`SUMMARY:${escapeText(e.title)}`,`DESCRIPTION:${escapeText(e.description)}`,`URL:${e.url}`,'STATUS:TENTATIVE','TRANSP:TRANSPARENT','CLASS:PRIVATE','BEGIN:VALARM','TRIGGER:PT0S','ACTION:DISPLAY',`DESCRIPTION:${escapeText(e.title)}`,'END:VALARM','END:VEVENT');
    lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
  }
  return {DAY,ZONE,RESTRICTIONS,TASTES,TEXTURES,COOKING,hash,signature,random,dayAt,addDays,eventsFrom,nextSix,validatePrefs,resolveExclusions,eligible,candidateDays,poolFor,sensorySignature,senses,matchInfo,scoreFood,recommendationReason,draw,zonedTime,stamp,escapeText,fold,calendarEvents,makeICS};
});
