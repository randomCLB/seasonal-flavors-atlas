const foods=window.FOODS;
const byId=Object.fromEntries(foods.map(food=>[food.id,food]));
const seasonTitles={1:'寒风里的菜薹，等一口回甜。',2:'过霜的叶菜，留到冬末。',3:'山野开花，春天也能入口。',4:'嫩茎与花朵，趁春天正好。',5:'山林和水边，都在冒新芽。',6:'荷塘里的脆，刚刚抽出来。',7:'水乡新茎，酸辣一炒。',8:'果实变软，湖荡里也有鲜粒。',9:'秋水与山果，各有一口鲜。',10:'沿着秋山，找果实和菌香。',11:'水田与竹林，正准备入冬。',12:'霜后的菜薹，热锅里最香。'};
let selectedMonth=new Date().getMonth()+1;
foods.forEach(f=>f.places=f.id==='foshougua-miao'?[{name:'花莲',lat:24.00,lon:121.60,months:[4,5]},{name:'贵州普定',lat:26.33,lon:105.75,months:[7]}]:[{name:f.region,lat:f.lat,lon:f.lon,months:f.months}]);
let currentView='season';
let mapOnlySeason=true;
let previousFocus=null;
const $=id=>document.getElementById(id);
const featuredByMonth={1:'hongshan-caitai',2:'hongshan-caitai',4:'foshougua-miao',5:'foshougua-miao',6:'dier',7:'foshougua-miao',8:'bayuegua',9:'bayuegua',10:'bayuegua',11:'cigu',12:'hongshan-caitai'};
const monthFoods=month=>foods.filter(f=>f.months.includes(month)).sort((a,b)=>(b.id===featuredByMonth[month])-(a.id===featuredByMonth[month]));
const monthLabel=m=>`${String(m).padStart(2,'0')} 月`;
const imageStyle=food=>food.image?`style="background-image:linear-gradient(0deg,rgba(9,36,29,.84),rgba(9,36,29,.03) 75%),url('${food.image}')"`:'style="background-image:linear-gradient(0deg,rgba(9,36,29,.78),rgba(9,36,29,.12)),url(\'assets/terrain.webp\')"';
function renderMonths(){
  $('mapMonthSelect').innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===selectedMonth?'selected':''}>${i+1} 月</option>`).join('');
  $('months').innerHTML=Array.from({length:12},(_,i)=>{const m=i+1;return `<button class="${m===selectedMonth?'active':''}" data-month="${m}" aria-label="${m}月" aria-current="${m===selectedMonth?'date':'false'}">${String(m).padStart(2,'0')}</button>`}).join('');
  $('months').querySelectorAll('button').forEach(b=>b.onclick=()=>setMonth(Number(b.dataset.month)));
  $('mapMonthSelect').onchange=e=>setMonth(Number(e.target.value));
}
function setMonth(month){mapFocus=null;selectedMonth=month;renderMonths();renderSeason();renderMap();if(currentView==='map'){$('mapMonthLabel').textContent=monthLabel(month)} }
function renderSeason(){
  const list=monthFoods(selectedMonth);const lead=list[0];
  $('seasonKicker').textContent=`${monthLabel(selectedMonth)} · ${list.length} 味当季食材`;
  $('seasonHeading').textContent=seasonTitles[selectedMonth];
  $('seasonIntro').textContent='从一味开始，尝它的口感、学一种吃法，再沿着产地与风味继续逛。';
  $('hero').innerHTML=`<div class="eyebrow">${monthLabel(selectedMonth)} / ${lead.region}</div><h1>这一口<br><em>${lead.name}。</em></h1><p>${lead.description}</p><button class="hero-cta" data-food="${lead.id}">认识${lead.name} <span aria-hidden="true">↗</span></button><div class="hero-photo ${lead.image?'':'hero-terrain'}"><img src="${lead.image||'assets/terrain.webp'}" alt="${lead.imageAlt||'中国山川地形'}"></div><div class="hero-index">01 / ${String(list.length).padStart(2,'0')} <span>本月风物</span></div>`;
  $('seasonCards').innerHTML=list.map((f,i)=>`<article class="season-card card-${i+1}" ${imageStyle(f)}><small>${f.region} · ${f.months.map(m=>String(m).padStart(2,'0')).join(' / ')} 月</small><h3>${f.name}</h3><p>${f.short}</p><button data-food="${f.id}" aria-label="阅读${f.name}详情">看它怎么吃 <span aria-hidden="true">↗</span></button></article>`).join('');
  $('seasonCards').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food));
  $('hero').querySelector('[data-food]').onclick=()=>openFood(lead.id);
}
function setView(view){currentView=view;document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==`${view}View`);document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('is-active',b.dataset.view===view));if(view==='map')renderMap();if(view==='flavor')renderFlavor();window.scrollTo({top:0,behavior:'instant'});}
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('mapPrompt').onclick=()=>setView('map');
const world={west:72,east:136,south:16,north:54};
let mapFocus=null;
const geoPoint=(place,bounds)=>({x:(place.lon-bounds.west)/(bounds.east-bounds.west)*100,y:(bounds.north-place.lat)/(bounds.north-bounds.south)*100});
const anchors=[['北京',39.9,116.4],['上海',31.2,121.5],['武汉',30.6,114.3],['成都',30.7,104.1],['广州',23.1,113.3],['昆明',25.0,102.7],['苏州',31.3,120.6],['嘉兴',30.8,120.8]];
function clusterPlaces(places){
  const groups=[];
  for(const item of places){
    const hit=groups.find(group=>group.some(old=>{const a=geoPoint(item.place,world),b=geoPoint(old.place,world);return Math.abs(a.x-b.x)<4.8&&Math.abs(a.y-b.y)<4.0}));
    if(hit)hit.push(item);else groups.push([item]);
  }
  return groups;
}
function zoomMap(group){
  const lat=group.reduce((v,x)=>v+x.place.lat,0)/group.length,lon=group.reduce((v,x)=>v+x.place.lon,0)/group.length;
  const lonSpan=Math.max(...group.map(x=>x.place.lon))-Math.min(...group.map(x=>x.place.lon));
  const latSpan=Math.max(...group.map(x=>x.place.lat))-Math.min(...group.map(x=>x.place.lat));
  const width=Math.max(6.4,lonSpan+2,(latSpan+1.5)*64/38),height=width*38/64;
  mapFocus={west:lon-width/2,east:lon+width/2,south:lat-height/2,north:lat+height/2};
  renderMap();
}
function renderMap(){
  const bounds=mapFocus||world;
  $('mapMonthLabel').textContent=`${monthLabel(selectedMonth)} · ${monthFoods(selectedMonth).length} 味当季`;
  $('mapSeasonButton').textContent=mapOnlySeason?'查看全部食材':'只看本月';
  $('mapZoomBack').hidden=!mapFocus;
  document.querySelector('.map-image').classList.toggle('regional',!!mapFocus);
  const left=(bounds.west-72)/64*1920,top=(54-bounds.north)/38*1140,width=(bounds.east-bounds.west)/64*1920,height=(bounds.north-bounds.south)/38*1140;
  $('mapBase').setAttribute('viewBox',`${left} ${top} ${width} ${height}`);
  const list=mapOnlySeason?monthFoods(selectedMonth):foods;
  const places=list.flatMap(f=>f.places.filter(p=>!mapOnlySeason||p.months.includes(selectedMonth)).map(p=>({food:f,place:p})));
  const visible=places.filter(({place})=>place.lon>=bounds.west&&place.lon<=bounds.east&&place.lat>=bounds.south&&place.lat<=bounds.north);
  const groups=mapFocus?visible.map(x=>[x]):clusterPlaces(visible);
  $('mapPins').innerHTML=groups.map((group,i)=>{const lat=group.reduce((v,x)=>v+x.place.lat,0)/group.length,lon=group.reduce((v,x)=>v+x.place.lon,0)/group.length,p=geoPoint({lat,lon},bounds);const first=group[0],label=group.length>1?`${group.length} 味食材`:first.food.name;return `<button class="map-pin ${group.length>1?'map-cluster':''}" style="left:${p.x}%;top:${p.y}%" data-pin="${i}" aria-label="${label}${group.length>1?'，放大查看':''}"><span class="pin-dot"></span><span class="pin-label">${label}<small>${group.length>1?'点击放大':first.place.name}</small></span></button>`}).join('');
  $('mapPins').querySelectorAll('[data-pin]').forEach(button=>button.onclick=()=>{const group=groups[Number(button.dataset.pin)];if(group.length>1)zoomMap(group);else openFood(group[0].food.id)});
  $('mapAnchors').innerHTML=anchors.filter(([_,lat,lon])=>lat>=bounds.south&&lat<=bounds.north&&lon>=bounds.west&&lon<=bounds.east).map(([name,lat,lon])=>{const p=geoPoint({lat,lon},bounds);return `<span class="map-anchor" style="left:${p.x}%;top:${p.y}%">${name}</span>`}).join('');
  $('mapScale').textContent=mapFocus?'约 50 公里':'约 500 公里';
  const km=mapFocus?50:500;
  $('mapScale').style.width=`${Math.min(30,km/(111*Math.cos(((bounds.north+bounds.south)/2)*Math.PI/180)*(bounds.east-bounds.west))*100)}%`;
  $('mapList').innerHTML=places.map(({food:f,place})=>`<button data-food="${f.id}"><span>${place.name}</span><strong>${f.name}</strong><span>看吃法 ↗</span></button>`).join('');
  $('mapList').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food));
  if(window.innerWidth<=800){const wrap=document.querySelector('.map-wrap');const width=document.querySelector('.map-image').getBoundingClientRect().width;const mean=visible.length?visible.reduce((sum,item)=>sum+geoPoint(item.place,bounds).x,0)/visible.length:50;wrap.scrollLeft=width*mean/100-wrap.clientWidth/2}
}
$('mapSeasonButton').onclick=()=>{mapOnlySeason=!mapOnlySeason;renderMap()};
$('mapZoomBack').onclick=()=>{mapFocus=null;renderMap()};
function relatedFoods(f){return foods.filter(other=>other.id!==f.id).map(other=>({food:other,shared:other.flavor.filter(t=>f.flavor.includes(t))})).filter(x=>x.shared.length).sort((a,b)=>b.shared.length-a.shared.length||a.food.name.localeCompare(b.food.name,'zh')).slice(0,4).map(x=>({food:x.food,why:`同样有${x.shared.join('、')}口感`}))}
function detailHtml(f){
  const similar=relatedFoods(f);
  return `<div class="detail-hero"><div class="detail-topline">${f.region} · ${f.months.map(m=>`${m}月`).join(' / ')}</div><h1>${f.name}</h1><p>${f.description}</p><div class="detail-tags">${f.flavor.map(t=>`<span>${t}</span>`).join('')}</div></div>
  ${f.image?`<figure class="detail-photo"><img src="${f.image}" alt="${f.imageAlt}"><figcaption>${f.imageCaption}</figcaption></figure>`:''}
  <div class="detail-body"><section><p class="detail-num">01 / 何时遇见</p><h2>什么时候最好遇见它</h2><p>${f.season}</p></section>
  <section><p class="detail-num">02 / 怎么吃</p><h2>${f.recipeTitle}</h2>${f.safety?`<div class="safety"><strong>入口前先留意</strong><p>${f.safety}</p></div>`:''}<p>${f.recipe}</p><p class="pair-note">搭配的用意 · ${f.pair}</p></section>
  <section><p class="detail-num">03 / 怎么找</p><h2>挑到合适的这一味</h2><p>${f.buy}</p><button class="copy-button" data-copy="${f.search}">复制搜索词 <strong>${f.search}</strong> <span aria-hidden="true">↗</span></button></section>
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
let rotX=-.22,rotY=.35,starSelected='foshougua-miao',starDrag=null,projected=[];
function project(node,w,h){const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);const x=node.x*cy-node.z*sy,z=node.x*sy+node.z*cy,y=node.y*cx-z*sx,depth=node.y*sx+z*cx;const scale=Math.min(w,h)*.36*(1+depth*.22);return {x:w/2+x*scale,y:h/2+y*scale,z:depth}}
function drawStar(){const canvas=$('flavorCanvas');if(!canvas||currentView!=='flavor')return;const box=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const w=box.width,h=box.height;ctx.clearRect(0,0,w,h);const glow=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.min(w,h)*.52);glow.addColorStop(0,'#416659');glow.addColorStop(1,'#193d35');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  projected=starNodes.map(n=>({...project(n,w,h),id:n.id}));
  const linked=relatedFoods(byId[starSelected]).map(x=>x.food.id);
  linked.forEach(id=>{const A=projected.find(n=>n.id===starSelected),B=projected.find(n=>n.id===id);ctx.strokeStyle='#dac79199';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke()});
  projected.sort((a,b)=>a.z-b.z).forEach(n=>{const active=n.id===starSelected,related=linked.includes(n.id),r=active?8:related?6:4;ctx.beginPath();ctx.arc(n.x,n.y,r+7,0,Math.PI*2);ctx.fillStyle=active?'#d6c99644':'#e7e4d110';ctx.fill();ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=active?'#e6d7a8':related?'#f3eed9':'#b7c6b8';ctx.fill();if(active||related){ctx.fillStyle='#fffaf0';ctx.font=`${active?'600 ':''}14px sans-serif`;ctx.textAlign='center';ctx.fillText(byId[n.id].name,n.x,n.y-17)}})
}
function renderFlavor(){const selected=byId[starSelected];const linked=relatedFoods(selected);$('flavorAside').innerHTML=`<p class="kicker">已选择 / ${selected.region}</p><h2>${selected.name}</h2><p>${selected.description}</p><div class="aside-tags">${selected.flavor.map(t=>`<span>${t}</span>`).join('')}</div><button class="aside-primary" data-food="${selected.id}">读${selected.name}的吃法 ↗</button><h3>顺着风味继续</h3>${linked.length?linked.map(({food,why})=>`<button class="relation" data-select="${food.id}"><strong>${food.name}</strong><span>${why}</span></button>`).join(''):'<p class="no-relation">目前没有经过记录的相近风味。转动星图继续找。</p>'}`;$('flavorList').innerHTML=foods.map(f=>`<button data-select="${f.id}" class="${f.id===starSelected?'active':''}">${f.name}<span>${f.flavor.join(' · ')}</span></button>`).join('');document.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{starSelected=b.dataset.select;renderFlavor()});document.querySelector('#flavorAside [data-food]').onclick=()=>openFood(selected.id);drawStar()}
const canvas=$('flavorCanvas');canvas.addEventListener('pointerdown',e=>{starDrag={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!starDrag)return;const dx=e.clientX-starDrag.x,dy=e.clientY-starDrag.y;if(Math.abs(dx)+Math.abs(dy)>2)starDrag.moved=true;rotY+=dx*.009;rotX=Math.max(-1,Math.min(1,rotX+dy*.009));starDrag.x=e.clientX;starDrag.y=e.clientY;drawStar()});canvas.addEventListener('pointerup',e=>{if(!starDrag?.moved){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const hit=projected.find(n=>Math.hypot(n.x-x,n.y-y)<28);if(hit){starSelected=hit.id;renderFlavor()}}starDrag=null});window.addEventListener('resize',()=>{if(currentView==='flavor')drawStar()});
renderMonths();renderSeason();renderMap();const deepLink=new URL(location.href).searchParams.get('food');if(deepLink&&byId[deepLink])openFood(deepLink,false);
