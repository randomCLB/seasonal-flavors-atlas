const foods=window.FOODS;
const byId=Object.fromEntries(foods.map(food=>[food.id,food]));
const $=id=>document.getElementById(id);
const monthLabel=m=>`${String(m).padStart(2,'0')} 月`;
const formatMonths=months=>{
 if(!months.length)return '时令待核';
 if(months.length===12)return '全年';
 const continuous=months.length>1&&months.every((m,i)=>i===0||m===(months[i-1]===12?1:months[i-1]+1));
 if(continuous)return months.some((m,i)=>i>0&&m<months[i-1])?`${months[0]}月—次年${months[months.length-1]}月`:`${months[0]}—${months[months.length-1]}月`;
 return months.map(m=>`${m}月`).join(' / ');
};
const foodSeasonLabel=food=>(['season','plant-stage'].includes(food.seasonPrecision)||food.peakWindows?.length)&&food.seasonLabel?food.seasonLabel:formatMonths(food.peakMonths);
const foodSeasonMeta=(food,month,label=food.region)=>{
 if(food.placeSeasons.length>1){
  const active=food.placeSeasons.filter(place=>place.months.includes(month));
  return (active.length?active:food.placeSeasons).map(place=>`${place.name} · ${formatMonths(place.months)}`).join(' / ');
 }
 const place=label.replace(/\s*·\s*\d{1,2}(?:[—–-]\d{1,2})?月.*$/,'');
 return `${place} · ${foodSeasonLabel(food)}`;
};
const seasonPhaseLabel=(food,month)=>month===11&&food.seasonPhase?.label&&!/记录|线索|批次|节点/.test(food.seasonPhase.label)?`<span class="season-phase">${food.seasonPhase.label}</span>`:'';
const originDetails=food=>food.placeSeasons.length<2?'':`<div class="origin-details"><h3>一味风物，各地各时</h3>${food.placeSeasons.map(place=>`<article><h4>${place.name}</h4><p><strong>时令</strong> · ${place.seasonNote||formatMonths(place.months)}</p><p><strong>产区风味</strong> · ${place.flavorNote||'暂未确认这处产区独有的风味差异。'}</p><p class="state-note"><a href="${place.source}" target="_blank" rel="noopener">查看时令来源 ↗</a>${place.flavorSource?` · <a href="${place.flavorSource}" target="_blank" rel="noopener">查看风味来源 ↗</a>`:''}</p></article>`).join('')}</div>`;
const chinaParts=date=>Object.fromEntries(new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
const chinaNow=chinaParts(new Date());
const monthFoods=month=>foods.filter(f=>f.peakMonths.includes(month));
let selectedMonth=chinaNow.month,currentView='season',mapOnlySeason=true,mapFocus=null,mapCategory='all',previousFocus=null;
foods.forEach(f=>f.places=f.placeSeasons);
const nameWithIcon=food=>food.name;
const categoryNames={vegetable:'蔬菜',fruit:'水果',protein:'水产与肉',fungus:'菌菇',flower:'食用花',tea:'茶与饮品',seed:'坚果种子',spice:'香辛料',oilseed:'油茶与油料'};
// Display aliases preserve the original catalog categories used by the draw profiles.
const foodCategory=food=>({seafood:'protein',nuts:'seed'}[food.category]||food.category);
const foodCategoryLabel=food=>categoryNames[foodCategory(food)]||'其他风物';
let selectedCategory='all',viewScrollTops={season:0,map:0,flavor:0},featuredAssignments={};
const termSlugs=['xiaohan','dahan','lichun','yushui','jingzhe','chunfen','qingming','guyu','lixia','xiaoman','mangzhong','xiazhi','xiaoshu','dashu','liqiu','chushu','bailu','qiufen','hanlu','shuangjiang','lidong','xiaoxue','daxue','dongzhi'];
const termArtSubjects=["红梅初绽、霜针松枝、半冻山溪","厚冰裂纹、枯苇、严冬雪岸","芽苞初开、融雪、细流","细雨柳芽、水洼涟漪","桃花、苏醒的虫、春雷","燕子、春田、繁花","风筝、柳枝、踏青小径","茶芽、润雨、茶园","嫩荷、青蛙、水边鸢尾","渐满青麦穗、桑叶","金色芒麦、镰刀、插秧","烈日、荷花、短影","蝉、竹阴、暑气","繁荷、急雨、浓夏","初黄叶片、熟石榴","棉桃吐絮、暑退、候鸟","银露青草、白鹭、清晨","稻穗低垂、丰收谷篮","露珠、秋叶、黄菊、晨雾","叶缘白霜、红柿、秋尽","银杏落尽、藏菜木篮","薄雪南天竹、疏落雪花","厚雪松枝、积雪林径","低日长影、暖窗、冬枝"];
const termLines=['寒气深了，热锅里找一口清甜。','岁末的冷，衬得鲜味更近。','春从枝头起，也从餐桌起。','雨落下来，嫩芽开始有了滋味。','泥土醒了，尝一尝新生的脆。','白昼渐长，把春天端上桌。','清明前后，山野里有清鲜。','谷雨润物，嫩叶正当时。','初夏开场，寻找水边与山间的新绿。','籽粒将满，味道也渐渐丰盈。','忙着生长的时节，趁鲜下锅。','日光最长，吃一口轻快的鲜。','暑气初起，脆嫩最能醒口。','盛夏深处，清爽的滋味在水边。','风里有一点凉，山果将熟。','热意渐退，尝初秋的鲜。','露水落下，果实与水生菜都在长。','昼夜平分，秋水与山果各有一口鲜。','凉意更深，适合慢慢寻味。','霜将落下，秋味愈发沉稳。','入冬之前，收一篮水乡与山林。','初雪欲来，热锅最懂鲜嫩。','雪意渐浓，留住晚秋的甜。','最长的夜，等一口回甘。'];
const termIntros=["窗外有霜，锅里有热气。深绿的叶菜，炒出冬日的一口清甜。", "寒意到了深处，餐桌反而可以轻一些。白灼一盘嫩菜，细尝茎叶的甜。", "冰水初融，枝头渐绿。让一口鲜鱼，把餐桌带进春天。", "雨声细了，土香近了。一锅菌菇清汤，适合这个湿润的时节。", "春雷唤醒山野，花与嫩芽也有了滋味。尝鲜之前，先认清这一味。", "昼夜平分，春色渐浓。从枝头的酸甜小果，尝见春天的明亮。", "柳色新，山径青。把嫩芽处理妥当，再留住它的清香与脆。", "春雨润过枝叶，鲜果渐红。剖开一颗，把柔嫩的春味尝仔细。", "荷叶初展，山间仍有新绿。一盘嫩茎，让初夏的餐桌轻快起来。", "麦穗渐满，新麦还有青香。趁这一段鲜嫩，把谷物也端上桌。", "田间忙着收与种，枝头忙着成熟。一颗鲜果，是忙碌时节的小停顿。", "白昼最长，热意渐盛。少些厚重，多一点清鲜与爽口。", "蝉声渐起，果香正浓。剥开小果，让酸甜唤醒暑天的胃口。", "荷塘深绿，暑气正浓。水边的一口鲜，值得慢慢剥、细细尝。", "风里初有秋意，暑热还未退。一碗清甜，先把心绪放慢。", "热意渐收，海风更近。山野与水边的鲜味，都适合趁新鲜下锅。", "清晨露白，果实渐丰。切开小果，看看秋日藏在果肉里的颜色。", "稻穗低垂，昼夜平分。枝头的酸甜与秋水的鲜，都各有好滋味。", "露珠更凉，秋味更浓。剥一支秋笋，掰一颗熟柿，慢慢尝这一季。", "叶边添霜，熟果更显温柔。掰开一颗柿子，把深秋的甜留在舌尖。", "落叶渐多，餐桌添暖。一杯清饮、一盘热菜，接住入冬的凉意。", "薄雪将至，汤锅渐暖。清汤里的一口鱼鲜，适合慢慢喝、细细尝。", "雪意渐浓，锅里的香也浓了。让一盘热菜，把寒冷的夜晚暖起来。", "日影最长，夜色也长。剖开一颗冬果，让清甜陪你度过这一晚。"];
const termNames=window.SOLAR_TERM_NAMES;
const termEvents=[];
for(const [year,stamps] of Object.entries(window.SOLAR_TERM_TIMES))stamps.forEach((time,index)=>termEvents.push({year:Number(year),index,time}));
termEvents.sort((a,b)=>a.time-b.time);
const currentTerm=termEvents.reduce((found,event)=>event.time<=Date.now()?event:found,termEvents[0]);
const autumnEquinox=year=>termEvents.find(event=>event.year===year&&event.index===17);
const currentYear=chinaNow.year;
const cycleStart=autumnEquinox(currentTerm.index>=17?currentTerm.year:currentTerm.year-1)||autumnEquinox(currentYear);
const cycleEnd=autumnEquinox(cycleStart.year+1);
const termWindow=termEvents.filter(event=>event.time>=cycleStart.time&&event.time<cycleEnd.time);
let selectedTerm=currentTerm;
let seasonSelectionPlan;
const dateText=(time,withYear=false)=>{const d=chinaParts(new Date(time));return `${withYear?`${d.year}年`:''}${d.month}月${d.day}日`};
const termEnd=event=>termEvents[termEvents.indexOf(event)+1];
function rankSeasonFoods(month,event){
 const previous=termEvents[termEvents.indexOf(event)-1];
 const previousMonth=previous?chinaParts(new Date(previous.time+24*3600*1000)).month:month===1?12:month-1;
 const originalOrder=new Map(foods.map((food,index)=>[food.id,index]));
 const C=window.FengwuLottery,start=C.dayAt(event.time),ending=termEnd(event),end=ending?C.addDays(C.dayAt(ending.time),-1):start;
 const list=foods.filter(food=>{
  if(!seasonHasBegun(food,event))return false;
  if(food.sourceYears?.length&&!food.sourceYears.some(year=>start.slice(0,4)<=String(year)&&end.slice(0,4)>=String(year)))return false;
  if(food.peakTerms?.length)return food.peakTerms.includes(event.index);
  for(let day=start;day<=end;day=C.addDays(day,1)){
   if(food.peakWindows?.length?C.isPeakDay(food,day):food.peakMonths.includes(Number(day.slice(5,7))))return true;
  }
  return false;
 });
 const ranked=list.sort((a,b)=>{
  const aNew=a.entryTerms?.includes(event.index)||!a.peakMonths.includes(previousMonth),bNew=b.entryTerms?.includes(event.index)||!b.peakMonths.includes(previousMonth);
  return Number(bNew)-Number(aNew)||a.peakMonths.length-b.peakMonths.length||a.months.length-b.months.length||originalOrder.get(a.id)-originalOrder.get(b.id);
 });
 return window.SeasonSelection.select(ranked,event.index,food=>foodVisual(food));
}
function seasonHasBegun(food,event){
 const start=food.seasonStartTerm;
 if(!Number.isInteger(start))return true;
 const anchorYear=start>=17?(event.index<17?event.year-1:event.year):(event.index>=17?event.year+1:event.year);
 const anchor=termEvents.find(item=>item.year===anchorYear&&item.index===start);
 return Boolean(anchor&&event.time>=anchor.time);
}
function seasonFoodsFor(event){
 if(!seasonSelectionPlan){
  const pool=term=>rankSeasonFoods(chinaParts(new Date(term.time+86400000)).month,term);
  const previous=termEvents[termEvents.indexOf(termWindow[0])-1];
  const quarterKeys=termWindow.map(term=>{const {year,month}=chinaParts(new Date(term.time));return `${year}-Q${Math.ceil(month/3)}`});
  const featuredIds=termWindow.map(term=>window.SEASON_FEATURES?.[term.index]?.foodId);
  const lists=window.SeasonSelection.plan(termWindow.map(pool),previous?pool(previous):[],quarterKeys,featuredIds);
  seasonSelectionPlan=new Map(termWindow.map((term,index)=>[`${term.year}-${term.index}`,lists[index]]));
 }
 return seasonSelectionPlan.get(`${event.year}-${event.index}`)||[];
}
function featuredAssignment(category){
 const pools=termWindow.map(event=>seasonFoodsFor(event).filter(food=>category==='all'||foodCategory(food)===category));
 const owner=new Map(),assigned=new Array(pools.length).fill(null),order=pools.map((pool,index)=>index).sort((a,b)=>pools[a].length-pools[b].length||a-b);
 const curated=new Set();
 for(let index=0;index<pools.length;index++){
  const id=window.SEASON_FEATURES?.[termWindow[index].index]?.foodId;
  const food=pools[index].find(food=>food.id===id);
  if(food&&!owner.has(id)){owner.set(id,index);assigned[index]=food;curated.add(index);}
 }
 function place(index,seen){for(const food of pools[index]){if(seen.has(food.id))continue;seen.add(food.id);const previous=owner.get(food.id);if(previous===undefined||(!curated.has(previous)&&place(previous,seen))){owner.set(food.id,index);assigned[index]=food;return true}}return false}
 for(const index of order)if(!curated.has(index))place(index,new Set());
 return new Map(termWindow.map((event,index)=>[`${event.year}-${event.index}`,assigned[index]]));
}
// Curated image roles affect presentation only; food facts and draw rules stay in the source data.
const wholeSubjects=new Set(['lyg-shaguang-fish','ninghai-changjie-razor-clam','jintang-fresh-morel','shajiguo','lintong-huojing-shizi','juema','cizhousun']);
const imageDimensions={'assets/shajiguo-cut.jpg':[720,405],'assets/lintong-huojing.webp':[600,450],'assets/juema-roots-enhanced.webp':[750,481],'assets/cizhousun-salad.jpg':[1400,929]};
const shajiguoSrcset='assets/shajiguo-400.webp 400w, assets/shajiguo-800.webp 800w, assets/shajiguo-1280.webp 1280w, assets/shajiguo-1600.webp 1600w';
const shootSrcset='assets/cizhousun-shoot-400.webp 400w, assets/cizhousun-shoot-800.webp 800w, assets/cizhousun-shoot-1200.webp 1200w';
function foodImageAttrs(src,slot='card'){
 if(src==='assets/shajiguo-400.webp'){
  const sizes={hero:'(max-width:520px) 86vw, (max-width:800px) 90vw, (max-width:1400px) 43vw, 603px','feature-card':'(max-width:520px) 110vw, (max-width:800px) 100vw, (max-width:1400px) 43vw, 603px',card:'(max-width:520px) 31vw, 16vw',recognition:'(max-width:520px) 86vw, (max-width:800px) 80vw, 405px',aside:'350px'};
  return `srcset="${shajiguoSrcset}" sizes="${sizes[slot]||'100vw'}" width="400" height="598" decoding="async"`;
 }
 if(src==='assets/cizhousun-shoot-400.webp')return `srcset="${shootSrcset}" sizes="${slot==='recognition'?'(max-width:800px) 80vw, 405px':slot==='hero'?'(max-width:520px) 86vw, (max-width:800px) 90vw, (max-width:1400px) 43vw, 603px':'(max-width:520px) 31vw, 16vw'}" width="400" height="533" decoding="async"`;
 const dimensions=imageDimensions[src];
 return dimensions?`width="${dimensions[0]}" height="${dimensions[1]}" decoding="async"`:'';
}
const homeVisualOverrides={
 cizhousun:{src:'assets/cizhousun-whole-edited-generated.webp',alt:'整支带壳鲜笋的照片质感编辑示意',note:'编辑生成示意 · 非腾冲刺竹品种实拍',fit:'cover'},
 cinenya:{src:'assets/cinenya.webp',alt:'龙牙楤木嫩芽，嫩茎与初展叶片清晰可见',note:'龙牙楤木嫩芽 · 非产地实拍'},
 'houtui-cai':{src:'assets/houtui-pork-edited-generated.webp',alt:'浅色桌面上嫩蕨茎与肉片炒熟装盘的编辑示意',note:'编辑生成示意 · 通用成菜参考'},
 yangnaiguo:{src:'assets/yangnaiguo-official.jpg',alt:'施甸枝叶间成熟的橙红至深红羊奶果',note:'施甸融媒体中心 · 枝头熟果'},
 'rugao-takecai':{src:'assets/tatsoi-daylight-edited-generated.webp',alt:'浅色白盘上炒熟塌棵菜与蒜片的编辑示意',note:'编辑生成示意 · 通用成菜参考'},
 'gaochun-liuyuehuang':{src:'assets/crab-daylight-edited-generated.webp',alt:'浅色亚麻桌面上蒸熟中华绒螯蟹的编辑示意',note:'编辑生成示意 · 通用成菜参考'}
};
function foodVisual(food,role='appetite'){
 const reviewed=window.PhotoReview?.records?.[food.id];
 if(reviewed)return {...reviewed,fit:role==='recognition'&&wholeSubjects.has(food.id)?'contain':'cover',heroFit:'cover'};
 const home=role==='appetite'&&homeVisualOverrides[food.id];
 if(home)return {...home,fit:home.fit||'cover',heroFit:home.fit||'cover'};
 const homeFruitPhoto=role==='appetite'&&food.id==='shajiguo';
 const homeShootPhoto=role==='appetite'&&food.id==='cizhousun';
 const edible=role==='appetite'&&!homeFruitPhoto&&!homeShootPhoto&&(food.dishImage||food.cutImage);
 const originalSrc=homeFruitPhoto||homeShootPhoto?food.image:edible||(role==='recognition'?food.image:food.cardImage)||food.image||food.cardImage;
 const src=originalSrc==='assets/shajiguo.jpg'?'assets/shajiguo-400.webp':originalSrc;
 const alt=homeFruitPhoto||homeShootPhoto?food.imageAlt:edible?(food.dishImage?food.dishImageAlt:food.cutImageAlt):(role==='recognition'?food.imageAlt:food.cardImageAlt)||food.imageAlt||food.name;
 const generated=/generated|示意/.test(`${src} ${alt}`);
 return {src,alt,fit:role==='recognition'&&wholeSubjects.has(food.id)?'contain':'cover',heroFit:homeShootPhoto?'contain':'cover',note:generated?'生成示意 · 非实物摄影，非品种鉴别':homeFruitPhoto?food.imageCaption:homeShootPhoto?food.cardNote:edible?(food.dishImage?'成菜参考':'鲜果可食状态'):food.cardNote||food.imageCaption||'形态参考 · 非产地鉴别'};
}
function renderTermRail(){
 $('terms').innerHTML=termWindow.map((event,index)=>`<button class="${event===selectedTerm?'active':''}" data-term="${index}" aria-current="${event===selectedTerm?'date':'false'}"><small>${dateText(event.time,true)}</small><strong>${termNames[event.index]}</strong></button>`).join('');
 $('terms').querySelectorAll('button').forEach(button=>button.onclick=()=>{selectedTerm=termWindow[Number(button.dataset.term)];renderTermRail();renderSeason()});
 $('terms').querySelector('.active')?.scrollIntoView({block:'nearest',inline:'center'});
}
function renderCategoryFilter(list){
 const choices=[['all','全部',list.length],...Object.entries(categoryNames).map(([key,label])=>[key,label,list.filter(food=>foodCategory(food)===key).length])];
 $('categoryFilter').innerHTML=choices.map(([key,label,count])=>`<button type="button" data-category="${key}" class="${selectedCategory===key?'active':''}" aria-pressed="${selectedCategory===key}">${label}<span>${count}</span></button>`).join('');
 $('categoryFilter').querySelectorAll('[data-category]').forEach(button=>button.onclick=()=>{selectedCategory=button.dataset.category;renderSeason()});
}
function renderSeason(){
 const isNow=selectedTerm===currentTerm;
 const foodMonth=isNow?chinaNow.month:chinaParts(new Date(selectedTerm.time+24*3600*1000)).month;
 selectedMonth=foodMonth;
 const list=seasonFoodsFor(selectedTerm).slice();
 const ending=termEnd(selectedTerm);
 const range=`${dateText(selectedTerm.time,true)}—${ending?dateText(ending.time,true):'下一节气'}`;
 $('hero').style.backgroundImage=`url("assets/jieqi/${termSlugs[selectedTerm.index]}-v2.webp")`;
 $('hero').classList.toggle('term-panels-left',[5,6,16,23].includes(selectedTerm.index));
 $('termBookmark').textContent=termNames[selectedTerm.index];
 const termKey=`${selectedTerm.year}-${selectedTerm.index}`;
 const assignment=featuredAssignments.all||(featuredAssignments.all=featuredAssignment('all'));
 const featured=assignment.get(termKey)||null;
 const feature=window.SEASON_FEATURES?.[selectedTerm.index];
 const termLine=feature?.line||termLines[selectedTerm.index];
 if(featured)list.sort((a,b)=>Number(b===featured)-Number(a===featured));
 const visibleList=selectedCategory==='all'?list:list.filter(food=>foodCategory(food)===selectedCategory);
 const visual=featured&&foodVisual(featured);
 const image=visual?.src,imageAlt=visual?.alt;
 $('hero').innerHTML=`<div class="season-hero-overlay"><div class="season-hero-heading"><div class="season-hero-caption"><div class="season-feature-date">${isNow?'此刻可尝 · ':''}${dateText(selectedTerm.time)}${ending?`—${dateText(ending.time)}`:''}</div><p class="season-hero-name">${termNames[selectedTerm.index]}</p><p class="season-feature-term">${termLine}</p></div></div>${featured?`<div class="season-feature-card"><div class="season-feature-copy"><p class="season-feature-label">${feature?.eyebrow||'这一味，当季'}</p><h1><button class="season-feature-name${featured.name.length>=8?' is-long':''}" data-food="${featured.id}">${nameWithIcon(featured)}</button></h1><p class="season-feature-summary">${featured.id===feature?.foodId?feature.reason:featured.short}</p><p class="season-feature-meta">${foodSeasonMeta(featured,foodMonth)} ${seasonPhaseLabel(featured,foodMonth)}</p><button class="season-feature-cta" data-food="${featured.id}" data-recipe="true">看它怎么吃 <span aria-hidden="true">↗</span></button></div><figure class="season-feature-photo${featured.comparison?' has-image-note':''}">${image?`<button class="season-feature-image-button" data-food="${featured.id}" aria-label="查看${featured.name}详情"><img src="${image}" alt="${imageAlt}" style="object-fit:${visual.heroFit}" ${foodImageAttrs(image,'hero')} loading="eager" fetchpriority="high"></button><figcaption class="feature-caption">${visual.note} · <a href="credits.html">图片出处 ↗</a></figcaption>`:'<div class="season-feature-fallback" aria-hidden="true">当季风物</div>'}</figure></div>`:`<div class="season-feature-empty"><p class="season-feature-date">${termNames[selectedTerm.index]} · ${range}</p><h1>这段时节，慢慢寻找新风味。</h1><p>${termLine}</p></div>`}</div>`;
 $('seasonKicker').textContent=`${termNames[selectedTerm.index]} · ${range}`;
 $('seasonHeading').textContent=`${termNames[selectedTerm.index]}的当季精选 · ${visibleList.length} 味`;
 renderCategoryFilter(list);
 $('seasonIntro').textContent=visibleList.length?(feature?.intro||termIntros[selectedTerm.index]):`这一段时令，精选里还没有${categoryNames[selectedCategory]||'这一类'}。换个类别，或翻到下一节气看看。`;
 $('seasonCards').innerHTML=visibleList.length?visibleList.map((food,index)=>{
 const media=foodVisual(food);
 return `<article class="season-list-card ${index===0?'editorial-feature':index<3?'editorial-side':'editorial-brief'}"><figure class="season-list-photo${food.comparison?' has-image-note':''}">${media.src?`<button data-food="${food.id}" class="season-list-image-button" aria-label="查看${food.name}详情"><img src="${media.src}" alt="${media.alt}" ${foodImageAttrs(media.src,index===0?'feature-card':'card')} style="object-fit:${media.fit}" loading="lazy" decoding="async"></button>`:'<div class="season-list-image-empty" aria-label="实拍待补" role="img"></div>'}<figcaption class="photo-credit">${media.note}</figcaption></figure><div><small>${foodSeasonMeta(food,foodMonth,food.cardLabel||food.region)}</small> ${seasonPhaseLabel(food,foodMonth)}<h3><button data-food="${food.id}" class="season-list-name">${nameWithIcon(food)}</button></h3><p>${food.short}</p><button data-food="${food.id}" data-recipe="true" aria-label="直接看${food.name}做法">看它怎么吃 <span aria-hidden="true">↗</span></button></div></article>`;
 }).join(''):`<div class="empty-month category-empty"><p>换一条路，继续寻味。</p><button type="button" id="showAllSeasonFoods">看看本节气的全部风物</button></div>`;
 if(!visibleList.length)$('showAllSeasonFoods').onclick=()=>{selectedCategory='all';renderSeason()};
  document.querySelectorAll('#hero [data-food],#seasonCards [data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food,true,b.dataset.recipe==='true'));
}
$('termPrev').onclick=()=>{selectedTerm=termWindow[Math.max(0,termWindow.indexOf(selectedTerm)-1)];renderTermRail();renderSeason()};
$('termNext').onclick=()=>{selectedTerm=termWindow[Math.min(termWindow.length-1,termWindow.indexOf(selectedTerm)+1)];renderTermRail();renderSeason()};
function setView(view){if(view===currentView)return;viewScrollTops[currentView]=window.scrollY;currentView=view;if(view!=='map'){mapInteractionEnabled=false;document.querySelector('.map-image').classList.remove('is-interactive');$('mapHint').textContent='电脑点一下地图后可滚轮缩放、按住拖动；手机直接单指拖动或双指缩放。地图外照常滚动页面。'}document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==`${view}View`);document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('is-active',b.dataset.view===view));if(view==='map')renderMap();if(view==='flavor')renderFlavor();requestAnimationFrame(()=>window.scrollTo({top:viewScrollTops[view]||0,behavior:'instant'}))}
document.querySelectorAll('.nav-item[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('mapPrompt').onclick=()=>setView('map');
const meta=window.MAP_META,mapAspect=meta.width/meta.height;
function mapProject(place){const rad=Math.PI/180,rho=meta.F/Math.pow(Math.tan(Math.PI/4+place.lat*rad/2),meta.n),theta=meta.n*(place.lon*rad-meta.lambda0);return {x:meta.width/2+(rho*Math.sin(theta)-meta.centerX)*meta.scale,y:meta.height/2-(meta.rho0-rho*Math.cos(theta)-meta.centerY)*meta.scale}}
function inView(p,b){return p.x>=b.left&&p.x<=b.left+b.width&&p.y>=b.top&&p.y<=b.top+b.height}
function mapPoint(p,b){return {x:(p.x-b.left)/b.width*100,y:(p.y-b.top)/b.height*100}}
const allFoodPoints=foods.flatMap(food=>food.places.map(place=>mapProject(place)));
const foodXs=allFoodPoints.map(point=>point.x),foodYs=allFoodPoints.map(point=>point.y);
const homeHeight=Math.max(420,Math.max(...foodYs)-Math.min(...foodYs)+190),homeWidth=homeHeight*mapAspect;
const homeView={left:(Math.min(...foodXs)+Math.max(...foodXs)-homeWidth)/2,top:(Math.min(...foodYs)+Math.max(...foodYs)-homeHeight)/2,width:homeWidth,height:homeHeight};
const shortPlace=name=>name.replace(/^(内蒙古|黑龙江|浙江|江苏|湖北|湖南|陕西|贵州|北京|天津|上海|重庆|云南|四川|广东|广西|福建|江西|山东|山西|河南|河北|辽宁|吉林|安徽|海南|新疆|青海|宁夏|甘肃|西藏)/,'').replace(/[·\s]/g,'');
const anchors=[['北京',39.9,116.4],['上海',31.2,121.5],['武汉',30.6,114.3],['成都',30.7,104.1],['广州',23.1,113.3],['昆明',25,102.7],['苏州',31.3,120.6],['嘉兴',30.8,120.8]];
let mapGroups=[],popupTimer,mapInteractionEnabled=false,mapPointers=new Map(),mapGesture=null,mapGestureMoved=false,mapWheelTimer=null,mapPointerOnPin=false;
function clusterPlaces(places){const groups=[];for(const item of places){const p=mapProject(item.place),hit=groups.find(group=>group.some(old=>{const q=mapProject(old.place);return Math.abs(p.x-q.x)<48&&Math.abs(p.y-q.y)<40}));if(hit)hit.push(item);else groups.push([item])}return groups}
function renderMapMonths(){
 $('mapMonths').innerHTML=Array.from({length:12},(_,i)=>`<button class="${selectedMonth===i+1&&mapOnlySeason?'active':''}" data-month="${i+1}" aria-current="${selectedMonth===i+1&&mapOnlySeason?'date':'false'}">${String(i+1).padStart(2,'0')}月</button>`).join('');
 $('mapMonths').querySelectorAll('button').forEach(b=>b.onclick=()=>setMapMonth(Number(b.dataset.month)));
 const months=$('mapMonths'),active=months.querySelector('.active');if(active){const item=active.getBoundingClientRect(),rail=months.getBoundingClientRect();months.scrollLeft+=item.left-rail.left-(months.clientWidth-item.width)/2}
}
function setMapMonth(month){selectedMonth=month;mapOnlySeason=true;mapFocus=null;renderMap()}
$('mapMonthPrev').onclick=()=>setMapMonth(selectedMonth===1?12:selectedMonth-1);
$('mapMonthNext').onclick=()=>setMapMonth(selectedMonth===12?1:selectedMonth+1);
$('mapMonths').addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();setMapMonth((selectedMonth-1+(e.deltaY>0?1:11))%12+1)}},{passive:false});
$('mapSeasonButton').onclick=()=>{mapOnlySeason=!mapOnlySeason;mapFocus=null;renderMap()};
$('mapCategory').innerHTML='<option value="all">全部食材</option>'+Object.entries(categoryNames).map(([key,label])=>`<option value="${key}">${label}</option>`).join('');
$('mapCategory').onchange=e=>{mapCategory=e.target.value;mapFocus=null;renderMap()};
$('mapZoomBack').onclick=()=>{mapFocus=null;renderMap()};
function clampMapView(view){const width=Math.min(homeView.width,Math.max(homeView.width*.28,view.width)),height=width/mapAspect;return {left:Math.min(homeView.left+homeView.width-width,Math.max(homeView.left,view.left)),top:Math.min(homeView.top+homeView.height-height,Math.max(homeView.top,view.top)),width,height}}
function activateMap(){mapInteractionEnabled=true;const image=document.querySelector('.map-image');image.classList.add('is-interactive');image.focus({preventScroll:true});$('mapHint').textContent='滚轮缩放，按住拖动；手机单指拖动或双指缩放。地图外滚动页面。'}
function zoomMap(group){activateMap();const points=group.map(x=>mapProject(x.place)),xs=points.map(p=>p.x),ys=points.map(p=>p.y),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2,width=Math.max(homeView.width*.28,Math.max(...xs)-Math.min(...xs)+160,(Math.max(...ys)-Math.min(...ys)+130)*mapAspect);mapFocus=clampMapView({left:cx-width/2,top:cy-width/mapAspect/2,width});renderMap()}
function hideMapPopup(){clearTimeout(popupTimer);$('mapPopover').hidden=true}
function foodThumbnail(food){return food.cardImage||food.image||''}
function openMapPopup(index){clearTimeout(popupTimer);const group=mapGroups[index],pin=$('mapPins').querySelector(`[data-pin="${index}"]`);if(!group||!pin)return;const pop=$('mapPopover');const unique=[...new Map(group.map(x=>[`${x.food.id}|${x.place.name}`,x])).values()];pop.innerHTML=`<div class="map-popover-title">${group.map(x=>shortPlace(x.place.name)).filter((x,i,a)=>a.indexOf(x)===i).join(' · ')}<button class="map-popover-close" aria-label="关闭">×</button></div><div class="map-popover-foods">${unique.map(x=>`<button data-food="${x.food.id}">${foodThumbnail(x.food)?`<img class="map-food-photo" src="${foodThumbnail(x.food)}" alt="" loading="lazy" decoding="async">`:''}<span><strong>${x.food.name}</strong><small>${x.place.name} · ${formatMonths(x.place.months)} · 查看详情 ↗</small>${x.food.placeSeasons.length>1?`<small>${x.place.flavorNote||'产区风味差异待补充'}</small>`:''}</span></button>`).join('')}</div><button class="map-popover-zoom">放大这一带 ↗</button>`;const x=parseFloat(pin.style.left),y=parseFloat(pin.style.top);pop.style.left=`${Math.min(78,Math.max(6,x))}%`;pop.style.top=`${Math.min(76,Math.max(12,y))}%`;pop.hidden=false;pop.querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{hideMapPopup();openFood(b.dataset.food)});pop.querySelector('.map-popover-zoom').onclick=()=>{hideMapPopup();zoomMap(group)};pop.querySelector('.map-popover-close').onclick=hideMapPopup}
$('mapPopover').onmouseenter=()=>clearTimeout(popupTimer);
$('mapPopover').onmouseleave=()=>{popupTimer=setTimeout(hideMapPopup,240)};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#mapPopover,.map-pin'))hideMapPopup()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideMapPopup()});
function renderMap(){
 hideMapPopup();renderMapMonths();const bounds=mapFocus||homeView;
 const monthList=mapOnlySeason?monthFoods(selectedMonth):foods;
 const list=mapCategory==='all'?monthList:monthList.filter(food=>foodCategory(food)===mapCategory);
 $('mapCategory').value=mapCategory;
 $('mapMonthLabel').textContent=`${mapOnlySeason?monthLabel(selectedMonth):'全年'} · ${list.length} 味${mapCategory==='all'?'食材':categoryNames[mapCategory]}`;
 $('mapSeasonButton').textContent=mapOnlySeason?'查看全年':'只看单月';
 $('mapZoomBack').hidden=!mapFocus;
 document.querySelector('.map-image').classList.toggle('regional',!!mapFocus);
 $('mapBase').setAttribute('viewBox',`${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`);
 const places=list.flatMap(f=>f.places.filter(p=>!mapOnlySeason||p.months.includes(selectedMonth)).map(p=>({food:f,place:p})));
 const visible=places.filter(x=>inView(mapProject(x.place),bounds));
 mapGroups=mapFocus?visible.map(x=>[x]):clusterPlaces(visible);
 $('mapPins').innerHTML=mapGroups.map((group,i)=>{const positions=group.map(x=>mapProject(x.place)),p=mapPoint({x:positions.reduce((n,v)=>n+v.x,0)/positions.length,y:positions.reduce((n,v)=>n+v.y,0)/positions.length},bounds),name=group.length>1?`${new Set(group.map(x=>x.food.id)).size} 味食材`:group[0].food.name,city=group.length>1?[...new Set(group.map(x=>shortPlace(x.place.name)))].slice(0,2).join(' · '):shortPlace(group[0].place.name),thumbnail=foodThumbnail(group[0].food);return `<button class="map-pin ${group.length>1?'map-cluster':''}" style="left:${p.x}%;top:${p.y}%" data-pin="${i}" aria-label="${city}，${name}">${group.length===1&&thumbnail?`<span class="pin-photo"><img src="${thumbnail}" alt="" loading="lazy" decoding="async"></span>`:''}<span class="pin-dot"></span><span class="pin-label">${name}<small>${city}</small></span></button>`}).join('');
 $('mapPins').querySelectorAll('[data-pin]').forEach(button=>{const index=Number(button.dataset.pin),group=mapGroups[index];button.onclick=()=>group.length>1?openMapPopup(index):openFood(group[0].food.id);if(group.length>1){button.onmouseenter=()=>{if(!mapPointers.size)openMapPopup(index)};button.onmouseleave=()=>{popupTimer=setTimeout(hideMapPopup,240)};button.onfocus=()=>openMapPopup(index)}});
 $('mapAnchors').innerHTML=anchors.map(([name,lat,lon])=>({name,p:mapProject({lat,lon})})).filter(x=>inView(x.p,bounds)).map(({name,p})=>{const q=mapPoint(p,bounds);return `<span class="map-anchor" data-x="${p.x}" data-y="${p.y}" style="left:${q.x}%;top:${q.y}%">${name}</span>`}).join('');
  const center=mapFocus?(visible[0]?.place||{lat:32,lon:105}):{lat:32,lon:105};const km=mapFocus?50:500,delta=km/(111.32*Math.cos(center.lat*Math.PI/180));const p1=mapProject(center),p2=mapProject({...center,lon:center.lon+delta});$('mapScale').style.width=`${Math.min(35,Math.abs(p2.x-p1.x)/bounds.width*100)}%`;$('mapScale').textContent=`约 ${km} 公里`;
}
function updateMapViewport(bounds){
 $('mapBase').setAttribute('viewBox',`${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`);
 $('mapPins').querySelectorAll('.map-pin').forEach((pin,i)=>{const group=mapGroups[i],points=group.map(x=>mapProject(x.place)),p=mapPoint({x:points.reduce((n,v)=>n+v.x,0)/points.length,y:points.reduce((n,v)=>n+v.y,0)/points.length},bounds);pin.style.left=`${p.x}%`;pin.style.top=`${p.y}%`});
 $('mapAnchors').querySelectorAll('.map-anchor').forEach(anchor=>{const p=mapPoint({x:Number(anchor.dataset.x),y:Number(anchor.dataset.y)},bounds);anchor.style.left=`${p.x}%`;anchor.style.top=`${p.y}%`});
  const place=mapGroups[0]?.[0]?.place||{lat:32,lon:105},km=mapFocus?50:500,delta=km/(111.32*Math.cos(place.lat*Math.PI/180)),p1=mapProject(place),p2=mapProject({...place,lon:place.lon+delta});$('mapScale').style.width=`${Math.min(35,Math.abs(p2.x-p1.x)/bounds.width*100)}%`;
}
const mapImage=document.querySelector('.map-image');
function normalizedMapPoint(point,rect){return {x:(point.x-rect.left)/Math.max(1,rect.width),y:(point.y-rect.top)/Math.max(1,rect.height)}}
function setMapViewport(view){const bounded=clampMapView(view);mapFocus=bounded.width>=homeView.width*.995?null:bounded;mapImage.classList.toggle('regional',!!mapFocus);$('mapZoomBack').hidden=!mapFocus;updateMapViewport(mapFocus||homeView)}
function startMapGesture(){const entries=[...mapPointers.entries()].slice(0,2),view={...(mapFocus||homeView)};if(entries.length===1){mapGesture={type:'pan',pointerId:entries[0][0],start:{...entries[0][1]},view};return}if(entries.length===2){const [a,b]=entries.map(([,point])=>point),rect=mapImage.getBoundingClientRect(),mid=normalizedMapPoint({x:(a.x+b.x)/2,y:(a.y+b.y)/2},rect),distance=Math.hypot(a.x-b.x,a.y-b.y);mapGesture={type:'pinch',ids:entries.map(([id])=>id),distance:Math.max(1,distance),midpoint:mid,anchor:{x:view.left+mid.x*view.width,y:view.top+mid.y*view.height},view}}}
mapImage.addEventListener('pointerdown',event=>{if(event.target.closest('#mapPopover')||event.button!==0)return;if(!mapPointers.size){mapGestureMoved=false;mapPointerOnPin=!!event.target.closest('.map-pin')}activateMap();hideMapPopup();mapPointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(!mapPointerOnPin)mapImage.setPointerCapture(event.pointerId);startMapGesture()});
mapImage.addEventListener('pointermove',event=>{if(!mapPointers.has(event.pointerId)||!mapGesture)return;mapPointers.set(event.pointerId,{x:event.clientX,y:event.clientY});const rect=mapImage.getBoundingClientRect();if(mapGesture.type==='pan'){const point=mapPointers.get(event.pointerId),travel=Math.hypot(point.x-mapGesture.start.x,point.y-mapGesture.start.y);if(!mapGestureMoved&&travel<5)return;mapGestureMoved=true;if(!mapImage.hasPointerCapture(event.pointerId))mapImage.setPointerCapture(event.pointerId);const current=normalizedMapPoint(point,rect),origin=normalizedMapPoint(mapGesture.start,rect),dx=current.x-origin.x,dy=current.y-origin.y;setMapViewport({left:mapGesture.view.left-dx*mapGesture.view.width,top:mapGesture.view.top-dy*mapGesture.view.height,width:mapGesture.view.width});return}const [a,b]=mapGesture.ids.map(id=>mapPointers.get(id));if(!a||!b)return;const midpoint=normalizedMapPoint({x:(a.x+b.x)/2,y:(a.y+b.y)/2},rect),distance=Math.hypot(a.x-b.x,a.y-b.y),width=mapGesture.view.width*mapGesture.distance/Math.max(1,distance);if(!mapGestureMoved&&Math.abs(distance-mapGesture.distance)<5&&Math.abs(midpoint.x-mapGesture.midpoint.x)*rect.width+Math.abs(midpoint.y-mapGesture.midpoint.y)*rect.height<5)return;mapGestureMoved=true;for(const id of mapGesture.ids)if(!mapImage.hasPointerCapture(id))mapImage.setPointerCapture(id);setMapViewport({left:mapGesture.anchor.x-midpoint.x*width,top:mapGesture.anchor.y-midpoint.y*(width/mapAspect),width})});
function endMapPointer(event){if(!mapPointers.has(event.pointerId))return;mapPointers.delete(event.pointerId);if(mapImage.hasPointerCapture(event.pointerId))mapImage.releasePointerCapture(event.pointerId);if(mapPointers.size){startMapGesture();return}mapGesture=null;if(mapGestureMoved)renderMap()}
mapImage.addEventListener('pointerup',endMapPointer);mapImage.addEventListener('pointercancel',endMapPointer);
mapImage.addEventListener('click',event=>{if(!mapGestureMoved)return;event.preventDefault();event.stopImmediatePropagation();mapGestureMoved=false},true);
mapImage.addEventListener('wheel',event=>{if(!mapInteractionEnabled)return;event.preventDefault();hideMapPopup();const rect=event.currentTarget.getBoundingClientRect(),x=Math.min(1,Math.max(0,(event.clientX-rect.left)/rect.width)),y=Math.min(1,Math.max(0,(event.clientY-rect.top)/rect.height)),bounds=mapFocus||homeView,unit=event.deltaMode===1?16:event.deltaMode===2?rect.height:1,delta=Math.max(-.5,Math.min(.5,event.deltaY*unit*.0015)),factor=Math.exp(delta),width=Math.min(homeView.width,Math.max(homeView.width*.28,bounds.width*factor)),cx=bounds.left+x*bounds.width,cy=bounds.top+y*bounds.height;setMapViewport({left:cx-x*width,top:cy-y*(width/mapAspect),width});clearTimeout(mapWheelTimer);mapWheelTimer=setTimeout(()=>{mapWheelTimer=null;renderMap()},140)},{passive:false});
const flavorTagFrequency=new Map();foods.forEach(f=>(f.flavor||[]).forEach(tag=>flavorTagFrequency.set(tag,(flavorTagFrequency.get(tag)||0)+1)));
const flavorFilterTags=[...flavorTagFrequency].filter(([,count])=>count>=3).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'zh')).slice(0,8).map(([tag])=>tag);
let starTagFilter='all';
function relatedFoods(f){return foods.filter(other=>other.id!==f.id).map(food=>({food,shared:food.flavor.filter(tag=>f.flavor.includes(tag)),other:food.flavor.filter(tag=>!f.flavor.includes(tag))})).filter(x=>x.shared.length).sort((a,b)=>b.shared.reduce((n,tag)=>n+1/(flavorTagFrequency.get(tag)||1),0)-a.shared.reduce((n,tag)=>n+1/(flavorTagFrequency.get(tag)||1),0)||b.shared.length-a.shared.length||a.food.name.localeCompare(b.food.name,'zh')).slice(0,4).map(x=>({food:x.food,why:`共同风味：${x.shared.join('、')}${x.other.length?`；这味还带${x.other.slice(0,2).join('、')}`:''}`}))}
function detailHtml(f){
 const recognition=foodVisual(f,'recognition');
 if(f.recognitionNote)recognition.note=f.recognitionNote;
 return window.FoodDetail.html(f,{recognition,seasonLabel:foodSeasonLabel(f),category:foodCategoryLabel(f),originHtml:originDetails(f),similar:relatedFoods(f),imageAttrs:recognition.src?foodImageAttrs(recognition.src,'recognition'):''});
}
const detailShare=window.FoodShare.bind({button:$('detailShare'),status:$('detailShareStatus'),fallback:$('detailShareFallback'),input:$('detailShareLink'),copy:$('detailCopyLink'),navigator,href:()=>location.href});
function scrollFoodRecipe(){requestAnimationFrame(()=>{const dialog=$('detailDialog'),target=$('foodRecipe');if(!target)return;target.open=true;const top=target.getBoundingClientRect().top-dialog.getBoundingClientRect().top+dialog.scrollTop-document.querySelector('.detail-actions').offsetHeight-18;dialog.scrollTo({top,behavior:'instant'});target.querySelector('summary').focus({preventScroll:true})})}
function openFood(id,push=true,jumpRecipe=false){const f=byId[id];if(!f)return;detailShare.setFood(f);if(!$('detailDialog').open)previousFocus=document.activeElement;$('detailContent').innerHTML=detailHtml(f);if(!$('detailDialog').open)$('detailDialog').showModal();$('detailDialog').scrollTop=0;$('detailContent').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>b.dataset.recipe==='true'?scrollFoodRecipe():openFood(b.dataset.food));window.FoodPurchase.bind($('detailContent'));window.FoodRecords.bind();if(push){const url=new URL(location.href);url.searchParams.set('food',id);history.pushState({food:id},'',url)}if(jumpRecipe)scrollFoodRecipe()}
function closeFood(push=true){if(!$('detailDialog').open)return;detailShare.setFood(null);$('detailDialog').close();if(push){const url=new URL(location.href);url.searchParams.delete('food');history.pushState({},'',url)}previousFocus?.focus?.()}
$('detailClose').onclick=()=>closeFood();$('detailDialog').addEventListener('click',e=>{if(e.target===$('detailDialog'))closeFood()});$('detailDialog').addEventListener('cancel',e=>{e.preventDefault();closeFood()});window.addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('food');if(id&&byId[id])openFood(id,false);else closeFood(false)});
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2300)}
function renderSearch(query=''){
  const q=query.trim().toLowerCase();const matches=q?foods.filter(f=>[f.name,...f.alias,f.region,f.intro,f.description,f.short,f.season,f.taste,f.aroma,f.texture,f.state,f.recipeTitle,f.ingredients,...(f.steps||[]),f.buy,f.pair,foodCategoryLabel(f)].filter(Boolean).some(value=>value.toLowerCase().includes(q))):foods;
  $('searchResults').innerHTML=matches.length?matches.map(f=>`<button data-food="${f.id}"><span><strong>${f.name}</strong><small>${f.alias.join(' · ')} · ${f.taste}</small></span><em>${foodCategoryLabel(f)} · ${f.region} ↗</em></button>`).join(''):`<div class="search-empty"><p>没有找到匹配的食材。也可以按口感或香气试试：</p><div>${['脆嫩','清甜','酸爽','草本'].map(term=>`<button type="button" data-query="${term}">${term}</button>`).join('')}</div></div>`;
  $('searchResults').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{$('searchDialog').close();openFood(b.dataset.food)});
  $('searchResults').querySelectorAll('[data-query]').forEach(b=>b.onclick=()=>{$('searchInput').value=b.dataset.query;renderSearch(b.dataset.query)});
}
$('searchTrigger').onclick=()=>{renderSearch();$('searchDialog').showModal();$('searchInput').value='';$('searchInput').focus()};$('searchClose').onclick=()=>$('searchDialog').close();$('searchInput').oninput=e=>renderSearch(e.target.value);$('searchDialog').addEventListener('click',e=>{if(e.target===$('searchDialog'))$('searchDialog').close()});
const starNodes=foods.map((f,i)=>{const phi=Math.acos(1-2*(i+.5)/foods.length),theta=i*Math.PI*(3-Math.sqrt(5));return {id:f.id,x:Math.sin(phi)*Math.cos(theta),y:Math.cos(phi),z:Math.sin(phi)*Math.sin(theta)}});
let rotX=-.22,rotY=.35,starSelected='foshougua-miao',starDrag=null,starHover=null,projected=[];
function project(node,w,h){const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);const x=node.x*cy-node.z*sy,z=node.x*sy+node.z*cy,y=node.y*cx-z*sx,depth=node.y*sx+z*cx;const scale=Math.min(w,h)*.36*(1+depth*.22);return {x:w/2+x*scale,y:h/2+y*scale,z:depth}}
function drawStar(){const canvas=$('flavorCanvas');if(!canvas||currentView!=='flavor')return;const box=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const w=box.width,h=box.height;ctx.clearRect(0,0,w,h);const glow=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.min(w,h)*.52);glow.addColorStop(0,'#416659');glow.addColorStop(1,'#193d35');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  projected=starNodes.map(n=>({...project(n,w,h),id:n.id}));
  const linked=relatedFoods(byId[starSelected]).filter(x=>starTagFilter==='all'||x.food.flavor.includes(starTagFilter)).map(x=>x.food.id);
  linked.forEach(id=>{const A=projected.find(n=>n.id===starSelected),B=projected.find(n=>n.id===id);ctx.strokeStyle='#dac79199';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke()});
  projected.sort((a,b)=>a.z-b.z).forEach(n=>{const active=n.id===starSelected,related=linked.includes(n.id),r=active?8:related?6:4;ctx.beginPath();ctx.arc(n.x,n.y,r+7,0,Math.PI*2);ctx.fillStyle=active?'#d6c99644':'#e7e4d110';ctx.fill();ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=active?'#e6d7a8':related?'#f3eed9':'#718f7e';ctx.fill();if(active||related){ctx.fillStyle='#fffaf0';ctx.font=`${active?'600 ':''}14px sans-serif`;ctx.textAlign='center';ctx.fillText(byId[n.id].name,n.x,n.y-17)}})
}
function renderFlavor(){const selected=byId[starSelected],visual=foodVisual(selected),matches=starTagFilter==='all'?foods:foods.filter(f=>f.flavor.includes(starTagFilter)),linked=relatedFoods(selected).filter(x=>starTagFilter==='all'||x.food.flavor.includes(starTagFilter));$('flavorFilters').innerHTML=`<button type="button" data-flavor-filter="all" aria-pressed="${starTagFilter==='all'}">全部风味</button>${flavorFilterTags.map(tag=>`<button type="button" data-flavor-filter="${tag}" aria-pressed="${starTagFilter===tag}">${tag}<small>${flavorTagFrequency.get(tag)}</small></button>`).join('')}`;$('flavorFilters').querySelectorAll('[data-flavor-filter]').forEach(button=>button.onclick=()=>{starTagFilter=button.dataset.flavorFilter;renderFlavor()});$('flavorAside').innerHTML=`${visual.src?`<img class="flavor-selected-photo" src="${visual.src}" alt="${visual.alt}" ${foodImageAttrs(visual.src,'aside')}>`:'<div class="flavor-selected-empty" role="img" aria-label="实拍待补"></div>'}<p class="kicker">已选择 / ${selected.region}</p><h2>${nameWithIcon(selected)}</h2><p>${selected.description}</p><div class="aside-tags">${selected.flavor.map(t=>`<span>${t}</span>`).join('')}</div><button class="aside-primary" data-food="${selected.id}">读${selected.name}的吃法 ↗</button><h3>沿共同标签继续</h3>${linked.length?linked.map(({food,why})=>`<button class="relation" data-select="${food.id}"><strong>${nameWithIcon(food)}</strong><span>${why}</span></button>`).join(''):'<p class="no-relation">这个筛选下没有与当前风物共享标签的条目；可以换一枚标签。</p>'}`;$('flavorList').innerHTML=matches.map(f=>`<button data-select="${f.id}" class="${f.id===starSelected?'active':''}">${nameWithIcon(f)}<span>${f.flavor.join(' · ')}</span></button>`).join('');document.querySelectorAll('#flavorList [data-select],#flavorAside [data-select]').forEach(b=>b.onclick=()=>{starSelected=b.dataset.select;renderFlavor()});document.querySelector('#flavorAside [data-food]').onclick=()=>openFood(selected.id);drawStar()}
function showStarHover(node,e){const target=$('flavorHover');if(!node){target.hidden=true;return}const food=byId[node.id],box=$('flavorCanvas').getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;target.innerHTML=`${foodThumbnail(food)?`<img src="${foodThumbnail(food)}" alt="">`:''}<span>${food.name}</span>`;target.style.left=`${Math.min(box.width-150,Math.max(8,x+18))}px`;target.style.top=`${Math.min(box.height-70,Math.max(8,y-60))}px`;target.hidden=false}
const canvas=$('flavorCanvas');canvas.addEventListener('pointerdown',e=>{starHover=null;$('flavorHover').hidden=true;starDrag={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!starDrag){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const hit=projected.find(n=>Math.hypot(n.x-x,n.y-y)<28)||null;if(hit?.id!==starHover?.id){starHover=hit;showStarHover(hit,e)}else if(hit)showStarHover(hit,e);return}const dx=e.clientX-starDrag.x,dy=e.clientY-starDrag.y;if(Math.abs(dx)+Math.abs(dy)>2)starDrag.moved=true;rotY+=dx*.009;rotX=Math.max(-1,Math.min(1,rotX+dy*.009));starDrag.x=e.clientX;starDrag.y=e.clientY;drawStar()});canvas.addEventListener('pointerleave',()=>{if(!starDrag){starHover=null;$('flavorHover').hidden=true}});canvas.addEventListener('pointerup',e=>{if(!starDrag?.moved){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const hit=projected.find(n=>Math.hypot(n.x-x,n.y-y)<28);if(hit){starSelected=hit.id;renderFlavor()}}starDrag=null});window.addEventListener('resize',()=>{if(currentView==='flavor')drawStar()});
renderTermRail();renderSeason();const deepLink=new URL(location.href).searchParams.get('food');if(deepLink&&byId[deepLink])openFood(deepLink,false);
