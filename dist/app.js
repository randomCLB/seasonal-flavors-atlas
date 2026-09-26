const foods=window.FOODS;
const byId=Object.fromEntries(foods.map(food=>[food.id,food]));
const $=id=>document.getElementById(id);
const monthLabel=m=>`${String(m).padStart(2,'0')} 月`;
const chinaParts=date=>Object.fromEntries(new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
const chinaNow=chinaParts(new Date());
const monthFoods=month=>foods.filter(f=>f.months.includes(month));
let selectedMonth=chinaNow.month,currentView='season',mapOnlySeason=true,mapFocus=null,previousFocus=null;
foods.forEach(f=>f.places=f.placeSeasons);
const imageStyle=food=>food.cardImage||food.image?`style="background-image:linear-gradient(0deg,rgba(9,36,29,.84),rgba(9,36,29,.03) 75%),url('${food.cardImage||food.image}')"`:'style="background-image:linear-gradient(145deg,#365b4e,#16372e)"';
const nameWithIcon=food=>`${food.name}<img class="food-name-icon" src="${food.icon||food.cardImage||food.image||''}" alt="" aria-hidden="true">`;
const termSlugs=['xiaohan','dahan','lichun','yushui','jingzhe','chunfen','qingming','guyu','lixia','xiaoman','mangzhong','xiazhi','xiaoshu','dashu','liqiu','chushu','bailu','qiufen','hanlu','shuangjiang','lidong','xiaoxue','daxue','dongzhi'];
const termLines=['寒气深了，热锅里找一口清甜。','岁末的冷，衬得鲜味更近。','春从枝头起，也从餐桌起。','雨落下来，嫩芽开始有了滋味。','泥土醒了，尝一尝新生的脆。','白昼渐长，把春天端上桌。','清明前后，山野里有清鲜。','谷雨润物，嫩叶正当时。','初夏开场，寻找水边与山间的新绿。','籽粒将满，味道也渐渐丰盈。','忙着生长的时节，趁鲜下锅。','日光最长，吃一口轻快的鲜。','暑气初起，脆嫩最能醒口。','盛夏深处，清爽的滋味在水边。','风里有一点凉，山果将熟。','热意渐退，尝初秋的鲜。','露水落下，果实与水生菜都在长。','昼夜平分，秋水与山果各有一口鲜。','凉意更深，适合慢慢寻味。','霜将落下，秋味愈发沉稳。','入冬之前，收一篮水乡与山林。','初雪欲来，热锅最懂鲜嫩。','雪意渐浓，留住晚秋的甜。','最长的夜，等一口回甘。'];
const termNames=window.SOLAR_TERM_NAMES;
const termEvents=[];
for(const [year,stamps] of Object.entries(window.SOLAR_TERM_TIMES))stamps.forEach((time,index)=>termEvents.push({year:Number(year),index,time}));
termEvents.sort((a,b)=>a.time-b.time);
const currentTerm=termEvents.reduce((found,event)=>event.time<=Date.now()?event:found,termEvents[0]);
const autumnEquinox=year=>termEvents.find(event=>event.year===year&&event.index===17);
const currentYear=chinaNow.year;
const cycleStart=autumnEquinox(currentTerm.index>=17?currentTerm.year:currentTerm.year-1)||autumnEquinox(currentYear);
const cycleEnd=autumnEquinox(cycleStart.year+1);
const termWindow=termEvents.filter(event=>event.time>=cycleStart.time&&event.time<=cycleEnd.time);
let selectedTerm=currentTerm;
const dateText=(time,withYear=false)=>{const d=chinaParts(new Date(time));return `${withYear?`${d.year}年`:''}${d.month}月${d.day}日`};
const termEnd=event=>termWindow[termWindow.indexOf(event)+1];
function renderTermRail(){
 $('terms').innerHTML=termWindow.map((event,index)=>`<button class="${event===selectedTerm?'active':''}" data-term="${index}" aria-current="${event===selectedTerm?'date':'false'}"><small>${dateText(event.time,true)}</small><strong>${termNames[event.index]}</strong></button>`).join('');
 $('terms').querySelectorAll('button').forEach(button=>button.onclick=()=>{selectedTerm=termWindow[Number(button.dataset.term)];renderTermRail();renderSeason()});
 $('terms').querySelector('.active')?.scrollIntoView({block:'nearest',inline:'center'});
}
function renderSeason(){
 const isNow=selectedTerm===currentTerm;
 const foodMonth=isNow?chinaNow.month:chinaParts(new Date(selectedTerm.time+24*3600*1000)).month;
 const list=monthFoods(foodMonth);
 const ending=termEnd(selectedTerm);
 const range=`${dateText(selectedTerm.time,true)}—${ending?dateText(ending.time,true):'下一节气'}`;
 $('hero').style.backgroundImage=`linear-gradient(90deg,rgba(17,43,39,.82),rgba(17,43,39,.30)),url('assets/jieqi/${termSlugs[selectedTerm.index]}.svg')`;
 $('hero').innerHTML=`<div class="eyebrow">${isNow?'此时此刻 · ':''}${selectedTerm.year} 年 · ${range}</div><h1>${termNames[selectedTerm.index]}<span class="term-year"> / 二十四节气</span></h1><p>${termLines[selectedTerm.index]}</p><div class="hero-food-heading">${isNow?'现在可以尝的食材':'这一节气附近的食材'} · ${list.length} 味</div><div class="hero-food-list">${list.map(f=>`<button data-food="${f.id}">${nameWithIcon(f)}<span>↗</span></button>`).join('')}</div>`;
 $('seasonKicker').textContent=`${termNames[selectedTerm.index]} · ${range}`;
 $('seasonHeading').textContent=isNow?'此时此刻，可以尝这些。':`沿着${termNames[selectedTerm.index]}找当季风物。`;
 $('seasonIntro').textContent=`${foodMonth}月可尝的${list.length}味食材。点开看它的产地、上市时间和吃法。`;
 $('seasonCards').innerHTML=list.map((f,i)=>`<article class="season-card card-${i+1}" ${imageStyle(f)}><small>${f.cardLabel||`${f.region} · ${f.months.map(m=>String(m).padStart(2,'0')).join(' / ')} 月`}</small><h3>${f.name}</h3><p>${f.short}</p><button data-food="${f.id}" aria-label="阅读${f.name}详情">看它怎么吃 <span aria-hidden="true">↗</span></button></article>`).join('');
 document.querySelectorAll('#hero [data-food],#seasonCards [data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food));
}
$('termPrev').onclick=()=>{selectedTerm=termWindow[Math.max(0,termWindow.indexOf(selectedTerm)-1)];renderTermRail();renderSeason()};
$('termNext').onclick=()=>{selectedTerm=termWindow[Math.min(termWindow.length-1,termWindow.indexOf(selectedTerm)+1)];renderTermRail();renderSeason()};
function setView(view){currentView=view;if(view!=='map'){mapInteractionEnabled=false;document.querySelector('.map-image').classList.remove('is-interactive');$('mapHint').textContent='点击地图启用缩放和拖动；移到地图外，滚动页面。'}document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==`${view}View`);document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('is-active',b.dataset.view===view));if(view==='map')renderMap();if(view==='flavor')renderFlavor();window.scrollTo({top:0,behavior:'instant'})}
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>setView(b.dataset.view));
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
let mapGroups=[],popupTimer,mapInteractionEnabled=false,mapDrag=null;
function clusterPlaces(places){const groups=[];for(const item of places){const p=mapProject(item.place),hit=groups.find(group=>group.some(old=>{const q=mapProject(old.place);return Math.abs(p.x-q.x)<48&&Math.abs(p.y-q.y)<40}));if(hit)hit.push(item);else groups.push([item])}return groups}
function renderMapMonths(){
 $('mapMonths').innerHTML=Array.from({length:12},(_,i)=>`<button class="${selectedMonth===i+1&&mapOnlySeason?'active':''}" data-month="${i+1}" aria-current="${selectedMonth===i+1&&mapOnlySeason?'date':'false'}">${String(i+1).padStart(2,'0')}月</button>`).join('');
 $('mapMonths').querySelectorAll('button').forEach(b=>b.onclick=()=>setMapMonth(Number(b.dataset.month)));
 $('mapMonths').querySelector('.active')?.scrollIntoView({block:'nearest',inline:'center'});
}
function setMapMonth(month){selectedMonth=month;mapOnlySeason=true;mapFocus=null;renderMap()}
$('mapMonthPrev').onclick=()=>setMapMonth(selectedMonth===1?12:selectedMonth-1);
$('mapMonthNext').onclick=()=>setMapMonth(selectedMonth===12?1:selectedMonth+1);
$('mapMonths').addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();setMapMonth((selectedMonth-1+(e.deltaY>0?1:11))%12+1)}},{passive:false});
$('mapSeasonButton').onclick=()=>{mapOnlySeason=!mapOnlySeason;mapFocus=null;renderMap()};
$('mapZoomBack').onclick=()=>{mapFocus=null;renderMap()};
function clampMapView(view){const width=Math.min(homeView.width,Math.max(homeView.width*.28,view.width)),height=width/mapAspect;return {left:Math.min(homeView.left+homeView.width-width,Math.max(homeView.left,view.left)),top:Math.min(homeView.top+homeView.height-height,Math.max(homeView.top,view.top)),width,height}}
function activateMap(){mapInteractionEnabled=true;const image=document.querySelector('.map-image');image.classList.add('is-interactive');image.focus();$('mapHint').textContent='按住地图拖动，滚轮缩放；移到地图外可滚动页面。'}
function zoomMap(group){activateMap();const points=group.map(x=>mapProject(x.place)),xs=points.map(p=>p.x),ys=points.map(p=>p.y),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2,width=Math.max(homeView.width*.28,Math.max(...xs)-Math.min(...xs)+160,(Math.max(...ys)-Math.min(...ys)+130)*mapAspect);mapFocus=clampMapView({left:cx-width/2,top:cy-width/mapAspect/2,width});renderMap()}
function hideMapPopup(){clearTimeout(popupTimer);$('mapPopover').hidden=true}
function foodLogo(food){return food.icon||food.cardImage||food.image||''}
function openMapPopup(index){clearTimeout(popupTimer);const group=mapGroups[index],pin=$('mapPins').querySelector(`[data-pin="${index}"]`);if(!group||!pin)return;const pop=$('mapPopover');const unique=[...new Map(group.map(x=>[x.food.id,x])).values()];pop.innerHTML=`<div class="map-popover-title">${group.map(x=>shortPlace(x.place.name)).filter((x,i,a)=>a.indexOf(x)===i).join(' · ')}<button class="map-popover-close" aria-label="关闭">×</button></div><div class="map-popover-foods">${unique.map(x=>`<button data-food="${x.food.id}"><img class="map-food-logo" src="${foodLogo(x.food)}" alt=""><span><strong>${x.food.name}</strong><small>${x.place.name} · 看吃法 ↗</small></span></button>`).join('')}</div><button class="map-popover-zoom">放大这一带 ↗</button>`;const x=parseFloat(pin.style.left),y=parseFloat(pin.style.top);pop.style.left=`${Math.min(78,Math.max(6,x))}%`;pop.style.top=`${Math.min(76,Math.max(12,y))}%`;pop.hidden=false;pop.querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{hideMapPopup();openFood(b.dataset.food)});pop.querySelector('.map-popover-zoom').onclick=()=>{hideMapPopup();zoomMap(group)};pop.querySelector('.map-popover-close').onclick=hideMapPopup}
$('mapPopover').onmouseenter=()=>clearTimeout(popupTimer);
$('mapPopover').onmouseleave=()=>{popupTimer=setTimeout(hideMapPopup,240)};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#mapPopover,.map-pin'))hideMapPopup()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideMapPopup()});
function renderMap(){
 hideMapPopup();renderMapMonths();const bounds=mapFocus||homeView;
 $('mapMonthLabel').textContent=mapOnlySeason?`${monthLabel(selectedMonth)} · ${monthFoods(selectedMonth).length} 味食材`:`全年 · ${foods.length} 味食材`;
 $('mapSeasonButton').textContent=mapOnlySeason?'查看全年':'只看单月';
 $('mapZoomBack').hidden=!mapFocus;
 document.querySelector('.map-image').classList.toggle('regional',!!mapFocus);
 $('mapBase').setAttribute('viewBox',`${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`);
 const list=mapOnlySeason?monthFoods(selectedMonth):foods;
 const places=list.flatMap(f=>f.places.filter(p=>!mapOnlySeason||p.months.includes(selectedMonth)).map(p=>({food:f,place:p})));
 const visible=places.filter(x=>inView(mapProject(x.place),bounds));
 mapGroups=mapFocus?visible.map(x=>[x]):clusterPlaces(visible);
 $('mapPins').innerHTML=mapGroups.map((group,i)=>{const positions=group.map(x=>mapProject(x.place)),p=mapPoint({x:positions.reduce((n,v)=>n+v.x,0)/positions.length,y:positions.reduce((n,v)=>n+v.y,0)/positions.length},bounds),name=group.length>1?`${group.length} 味食材`:group[0].food.name,city=group.length>1?[...new Set(group.map(x=>shortPlace(x.place.name)))].slice(0,2).join(' · '):shortPlace(group[0].place.name),logo=foodLogo(group[0].food);return `<button class="map-pin ${group.length>1?'map-cluster':''}" style="left:${p.x}%;top:${p.y}%" data-pin="${i}" aria-label="${city}，${name}">${group.length===1?`<span class="pin-logo"><img src="${logo}" alt=""></span>`:''}<span class="pin-dot"></span><span class="pin-label">${name}<small>${city}</small></span></button>`}).join('');
 $('mapPins').querySelectorAll('[data-pin]').forEach(button=>{const index=Number(button.dataset.pin),group=mapGroups[index];button.onclick=()=>group.length>1?openMapPopup(index):openFood(group[0].food.id);if(group.length>1){button.onmouseenter=()=>openMapPopup(index);button.onmouseleave=()=>{popupTimer=setTimeout(hideMapPopup,240)};button.onfocus=()=>openMapPopup(index)}});
 $('mapAnchors').innerHTML=anchors.map(([name,lat,lon])=>({name,p:mapProject({lat,lon})})).filter(x=>inView(x.p,bounds)).map(({name,p})=>{const q=mapPoint(p,bounds);return `<span class="map-anchor" data-x="${p.x}" data-y="${p.y}" style="left:${q.x}%;top:${q.y}%">${name}</span>`}).join('');
 const center=mapFocus?visible[0]?.place:{lat:32,lon:105};const km=mapFocus?50:500,delta=km/(111.32*Math.cos(center.lat*Math.PI/180));const p1=mapProject(center),p2=mapProject({...center,lon:center.lon+delta});$('mapScale').style.width=`${Math.min(35,Math.abs(p2.x-p1.x)/bounds.width*100)}%`;$('mapScale').textContent=`约 ${km} 公里`;
}
function updateMapViewport(bounds){
 $('mapBase').setAttribute('viewBox',`${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`);
 $('mapPins').querySelectorAll('.map-pin').forEach((pin,i)=>{const group=mapGroups[i],points=group.map(x=>mapProject(x.place)),p=mapPoint({x:points.reduce((n,v)=>n+v.x,0)/points.length,y:points.reduce((n,v)=>n+v.y,0)/points.length},bounds);pin.style.left=`${p.x}%`;pin.style.top=`${p.y}%`});
 $('mapAnchors').querySelectorAll('.map-anchor').forEach(anchor=>{const p=mapPoint({x:Number(anchor.dataset.x),y:Number(anchor.dataset.y)},bounds);anchor.style.left=`${p.x}%`;anchor.style.top=`${p.y}%`});
  const place=mapGroups[0]?.[0]?.place||{lat:32,lon:105},km=mapFocus?50:500,delta=km/(111.32*Math.cos(place.lat*Math.PI/180)),p1=mapProject(place),p2=mapProject({...place,lon:place.lon+delta});$('mapScale').style.width=`${Math.min(35,Math.abs(p2.x-p1.x)/bounds.width*100)}%`;
}
const mapImage=document.querySelector('.map-image');
mapImage.addEventListener('pointerdown',event=>{if(event.button!==0||event.target.closest('button'))return;activateMap();hideMapPopup();mapDrag={pointerId:event.pointerId,x:event.clientX,y:event.clientY,moved:false};mapImage.setPointerCapture(event.pointerId)});
mapImage.addEventListener('pointermove',event=>{if(!mapDrag||event.pointerId!==mapDrag.pointerId)return;const dx=event.clientX-mapDrag.x,dy=event.clientY-mapDrag.y;mapDrag.x=event.clientX;mapDrag.y=event.clientY;if(!dx&&!dy)return;mapDrag.moved=true;const bounds=mapFocus||homeView;mapFocus=clampMapView({left:bounds.left-dx/Math.max(1,mapImage.clientWidth)*bounds.width,top:bounds.top-dy/Math.max(1,mapImage.clientHeight)*bounds.height,width:bounds.width});if(mapFocus.width>=homeView.width*.995)mapFocus=null;updateMapViewport(mapFocus||homeView)});
function endMapDrag(event){if(!mapDrag||event.pointerId!==mapDrag.pointerId)return;const moved=mapDrag.moved;mapDrag=null;if(mapImage.hasPointerCapture(event.pointerId))mapImage.releasePointerCapture(event.pointerId);if(moved)renderMap()}
mapImage.addEventListener('pointerup',endMapDrag);mapImage.addEventListener('pointercancel',endMapDrag);
mapImage.addEventListener('wheel',event=>{if(!mapInteractionEnabled)return;event.preventDefault();const rect=event.currentTarget.getBoundingClientRect(),x=Math.min(1,Math.max(0,(event.clientX-rect.left)/rect.width)),y=Math.min(1,Math.max(0,(event.clientY-rect.top)/rect.height)),bounds=mapFocus||homeView,factor=event.deltaY<0?.82:1.22,width=Math.min(homeView.width,Math.max(homeView.width*.28,bounds.width*factor)),height=width/mapAspect,cx=bounds.left+x*bounds.width,cy=bounds.top+y*bounds.height;mapFocus=width>=homeView.width*.995?null:clampMapView({left:cx-x*width,top:cy-y*height,width});renderMap()},{passive:false});
const relationReasons={清甜:'都带轻微甜味',紧实:'咬起来都较紧实',软糯:'熟后都有软糯质地',粉糯:'熟后都有粉糯质地',草本:'都带明显草本香',脆嫩:'做熟后仍有脆嫩的一口',微苦:'都保留一点微苦',花香:'都能尝到花的气味',柔滑:'入口都偏柔滑',清淡:'味道都较淡',清酸:'都适合用酸味提亮',清香:'香气都偏轻',柔韧:'咬起来都略有韧性',柔软:'熟软或成熟后都很柔软',酸爽:'酸味都很鲜明',果香:'都带熟果香',微涩:'都能尝到些许涩感',鲜香:'熟后都有鲜味',柔嫩:'做熟后都柔嫩'};
function relatedFoods(f){return foods.filter(other=>other.id!==f.id).map(other=>({food:other,shared:other.flavor.filter(t=>f.flavor.includes(t))})).filter(x=>x.shared.length).sort((a,b)=>b.shared.length-a.shared.length||a.food.name.localeCompare(b.food.name,'zh')).slice(0,4).map(x=>({food:x.food,why:relationReasons[x.shared[0]]||`都带${x.shared[0]}`}))}
function detailHtml(f){
  const similar=relatedFoods(f);
  return `<div class="detail-hero"><div class="detail-topline">${f.region} · ${f.months.map(m=>`${m}月`).join(' / ')}</div><h1>${nameWithIcon(f)}</h1><p>${f.intro||f.description}</p><div class="detail-tags">${f.flavor.map(t=>`<span>${t}</span>`).join('')}</div></div>
  ${f.image?`<figure class="detail-photo"><img src="${f.image}" alt="${f.imageAlt}"><figcaption>${f.recipeTitle}</figcaption></figure>`:''}${(f.images||[]).map(p=>`<figure class="detail-photo secondary-photo"><img src="${p.src}" alt="${p.alt}"><figcaption>${f.recipeTitle}</figcaption></figure>`).join('')}
  <div class="detail-body"><section><p class="detail-num">01 / 认一认</p><h2>吃起来是什么样</h2><dl class="sensory"><div><dt>味道</dt><dd>${f.taste}</dd></div><div><dt>香气</dt><dd>${f.aroma}</dd></div><div><dt>质地</dt><dd>${f.texture}</dd></div></dl><p class="state-note">以上描述对应：${f.state}。</p></section>
  <section><p class="detail-num">02 / 何时遇见</p><h2>什么时候最好遇见它</h2><p>${f.season}</p>${f.place?`<p>${f.place}</p>`:''}${f.context?`<p>${f.context}</p>`:''}${(f.articleImages||[]).map(p=>`<figure class="article-photo"><img src="${p.src}" alt="${p.alt}"><figcaption>${f.recipeTitle}</figcaption></figure>`).join('')}</section>
  <section><p class="detail-num">03 / 怎么吃 · 2 人份</p><h2>${f.recipeTitle}</h2>${f.safety?`<div class="safety"><strong>入口前先留意</strong><p>${f.safety}</p></div>`:''}<p><strong>准备</strong> · ${f.ingredients}</p><ol class="recipe-steps">${f.steps.map(s=>`<li>${s}</li>`).join('')}</ol><p><strong>做到什么程度</strong> · ${f.finish}</p><p><strong>最容易失手</strong> · ${f.pitfall}</p>${f.kitchen?`<p>${f.kitchen}</p>`:''}<p class="pair-note">搭配的用意 · ${f.pair}</p><a class="bilibili-recipe-link" href="https://search.bilibili.com/all?keyword=${encodeURIComponent(`${f.name} ${f.recipeTitle}`)}" target="_blank" rel="noopener noreferrer">去 B 站搜这道做法 ↗</a></section>
  <section><p class="detail-num">04 / 怎么找</p><h2>挑到合适的这一味</h2><p>${f.buy}</p>${f.buyDetail?`<p>${f.buyDetail}</p>`:''}${f.market?`<p>${f.market}</p>`:''}<p><strong>带回家后</strong> · ${f.storage}</p><button class="copy-button" data-copy="${f.search}">复制搜索词 <strong>${f.search}</strong> <span aria-hidden="true">↗</span></button></section>
  <section class="detail-sources"><p class="detail-num">继续查阅</p><ol>${f.sources.map(([title,url])=>`<li><a href="${url}" target="_blank" rel="noopener">${title} ↗</a></li>`).join('')}</ol></section>
  <section class="detail-next"><p class="detail-num">换个口味</p><h2>喜欢这一口，还可以尝什么？</h2><div>${similar.map(({food,why})=>`<button data-food="${food.id}"><strong>${food.name}</strong><span>${why} ↗</span></button>`).join('')}</div></section></div>`;
}
function openFood(id,push=true){const f=byId[id];if(!f)return;previousFocus=document.activeElement;$('detailContent').innerHTML=detailHtml(f);if(!$('detailDialog').open)$('detailDialog').showModal();$('detailDialog').scrollTop=0;$('detailContent').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food));$('detailContent').querySelector('[data-copy]').onclick=async e=>{const value=e.currentTarget.dataset.copy;try{await navigator.clipboard.writeText(value);toast('搜索词已复制')}catch{toast(`搜索词：${value}`)}};if(push){const url=new URL(location.href);url.searchParams.set('food',id);history.pushState({food:id},'',url)}}
function closeFood(push=true){if(!$('detailDialog').open)return;$('detailDialog').close();if(push){const url=new URL(location.href);url.searchParams.delete('food');history.pushState({},'',url)}previousFocus?.focus?.()}
$('detailClose').onclick=()=>closeFood();$('detailDialog').addEventListener('click',e=>{if(e.target===$('detailDialog'))closeFood()});$('detailDialog').addEventListener('cancel',e=>{e.preventDefault();closeFood()});window.addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('food');if(id&&byId[id])openFood(id,false);else closeFood(false)});
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2300)}
function renderSearch(query=''){
  const q=query.trim().toLowerCase();const matches=q?foods.filter(f=>[f.name,...f.alias,f.region].some(v=>v.toLowerCase().includes(q))):foods;
  $('searchResults').innerHTML=matches.length?matches.map(f=>`<button data-food="${f.id}"><span><strong>${f.name}</strong><small>${f.alias.join(' · ')}</small></span><em>${f.region} ↗</em></button>`).join(''):'<p class="search-empty">还没有找到这味食材，试试它的别名。</p>';
  $('searchResults').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{$('searchDialog').close();openFood(b.dataset.food)});
}
$('searchTrigger').onclick=()=>{renderSearch();$('searchDialog').showModal();$('searchInput').value='';$('searchInput').focus()};$('searchClose').onclick=()=>$('searchDialog').close();$('searchInput').oninput=e=>renderSearch(e.target.value);$('searchDialog').addEventListener('click',e=>{if(e.target===$('searchDialog'))$('searchDialog').close()});
const starNodes=foods.map((f,i)=>{const phi=Math.acos(1-2*(i+.5)/foods.length),theta=i*Math.PI*(3-Math.sqrt(5));return {id:f.id,x:Math.sin(phi)*Math.cos(theta),y:Math.cos(phi),z:Math.sin(phi)*Math.sin(theta)}});
let rotX=-.22,rotY=.35,starSelected='foshougua-miao',starDrag=null,starHover=null,projected=[];
function project(node,w,h){const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);const x=node.x*cy-node.z*sy,z=node.x*sy+node.z*cy,y=node.y*cx-z*sx,depth=node.y*sx+z*cx;const scale=Math.min(w,h)*.36*(1+depth*.22);return {x:w/2+x*scale,y:h/2+y*scale,z:depth}}
function drawStar(){const canvas=$('flavorCanvas');if(!canvas||currentView!=='flavor')return;const box=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const w=box.width,h=box.height;ctx.clearRect(0,0,w,h);const glow=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.min(w,h)*.52);glow.addColorStop(0,'#416659');glow.addColorStop(1,'#193d35');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  projected=starNodes.map(n=>({...project(n,w,h),id:n.id}));
  const linked=relatedFoods(byId[starSelected]).map(x=>x.food.id);
  linked.forEach(id=>{const A=projected.find(n=>n.id===starSelected),B=projected.find(n=>n.id===id);ctx.strokeStyle='#dac79199';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke()});
  projected.sort((a,b)=>a.z-b.z).forEach(n=>{const active=n.id===starSelected,related=linked.includes(n.id),r=active?8:related?6:4;ctx.beginPath();ctx.arc(n.x,n.y,r+7,0,Math.PI*2);ctx.fillStyle=active?'#d6c99644':'#e7e4d110';ctx.fill();ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=active?'#e6d7a8':related?'#f3eed9':'#b7c6b8';ctx.fill();if(active||related){ctx.fillStyle='#fffaf0';ctx.font=`${active?'600 ':''}14px sans-serif`;ctx.textAlign='center';ctx.fillText(byId[n.id].name,n.x,n.y-17)}})
}
function renderFlavor(){const selected=byId[starSelected];const linked=relatedFoods(selected);$('flavorAside').innerHTML=`<p class="kicker">已选择 / ${selected.region}</p><h2>${nameWithIcon(selected)}</h2><p>${selected.description}</p><div class="aside-tags">${selected.flavor.map(t=>`<span>${t}</span>`).join('')}</div><button class="aside-primary" data-food="${selected.id}">读${selected.name}的吃法 ↗</button><h3>顺着风味继续</h3>${linked.length?linked.map(({food,why})=>`<button class="relation" data-select="${food.id}"><strong>${nameWithIcon(food)}</strong><span>${why}</span></button>`).join(''):'<p class="no-relation">目前没有经过记录的相近风味。转动星图继续找。</p>'}`;$('flavorList').innerHTML=foods.map(f=>`<button data-select="${f.id}" class="${f.id===starSelected?'active':''}">${nameWithIcon(f)}<span>${f.flavor.join(' · ')}</span></button>`).join('');document.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{starSelected=b.dataset.select;renderFlavor()});document.querySelector('#flavorAside [data-food]').onclick=()=>openFood(selected.id);drawStar()}
function showStarHover(node,e){const target=$('flavorHover');if(!node){target.hidden=true;return}const food=byId[node.id],box=$('flavorCanvas').getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;target.innerHTML=`<img src="${foodLogo(food)}" alt=""><span>${food.name}</span>`;target.style.left=`${Math.min(box.width-150,Math.max(8,x+18))}px`;target.style.top=`${Math.min(box.height-70,Math.max(8,y-60))}px`;target.hidden=false}
const canvas=$('flavorCanvas');canvas.addEventListener('pointerdown',e=>{starHover=null;$('flavorHover').hidden=true;starDrag={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!starDrag){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const hit=projected.find(n=>Math.hypot(n.x-x,n.y-y)<28)||null;if(hit?.id!==starHover?.id){starHover=hit;showStarHover(hit,e)}else if(hit)showStarHover(hit,e);return}const dx=e.clientX-starDrag.x,dy=e.clientY-starDrag.y;if(Math.abs(dx)+Math.abs(dy)>2)starDrag.moved=true;rotY+=dx*.009;rotX=Math.max(-1,Math.min(1,rotX+dy*.009));starDrag.x=e.clientX;starDrag.y=e.clientY;drawStar()});canvas.addEventListener('pointerleave',()=>{if(!starDrag){starHover=null;$('flavorHover').hidden=true}});canvas.addEventListener('pointerup',e=>{if(!starDrag?.moved){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const hit=projected.find(n=>Math.hypot(n.x-x,n.y-y)<28);if(hit){starSelected=hit.id;renderFlavor()}}starDrag=null});window.addEventListener('resize',()=>{if(currentView==='flavor')drawStar()});
renderTermRail();renderSeason();renderMap();const deepLink=new URL(location.href).searchParams.get('food');if(deepLink&&byId[deepLink])openFood(deepLink,false);
