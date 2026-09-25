const foods = [
  {
    id:'nanhu-ling',name:'南湖菱',alias:['菱角'],region:'浙江嘉兴 · 南湖',lat:30.76,lon:120.76,months:[9,10],season:'嘉兴南湖一带，秋季、约中秋前后；具体上市日随年景变化。',
    description:'长着两只弯角的水生果实。先煮透、再剥壳，才能安心感受这份秋味。',short:'带棱角的水乡果实，煮透后慢慢剥壳。',flavor:['清淡','紧实'],state:'煮熟后',image:'/assets/water-chestnut.jpg',imageAlt:'嫩菱角品类参考照片',imageCaption:'图为嫩菱角品类参考，未作南湖菱品种鉴定；食用时请煮熟。',
    recipeTitle:'煮透后，剥壳直接吃',recipe:'洗净菱角，连壳下锅煮至完全熟透，再剥壳取肉。第一次认识它，先不叠加太多调味，留意果肉的质地。喜欢更柔和的吃法，可以把熟菱肉放进粥里。',pair:'与粥同煮时，米的柔软衬出菱肉的紧实；这是本站的搭配建议。',buy:'搜索“嘉兴 南湖菱 鲜菱角”。买前向卖家确认品种、采收时间与寄送状态。',search:'嘉兴 南湖菱 鲜菱角',safety:'菱角可能携带姜片虫囊蚴。不要生食、不要用牙咬生菱壳；食用前应充分煮熟。',
    sources:[['嘉兴南湖菱的秋季采收','https://www.zjsjw.gov.cn/zhuantizhuanlan/jingtoushouji/jingtou/201709/t20170927_2605775.shtml'],['福建省卫健委：菱角应煮熟食用','https://wjw.fujian.gov.cn/ztzl/jkjy/wsrxc/202505/t20250514_6913839.htm']]
  },
  {
    id:'jitoumi',name:'鸡头米',alias:['鲜芡实','芡实米'],region:'江苏苏州',lat:31.30,lon:120.60,months:[8,9,10],season:'苏州产区约八月至十月初采收，随天气与当年生长情况变化。',
    description:'从芡实果里剥出的鲜粒，是苏州人等待的短季水乡食材。',short:'刚剥出的鲜芡实，清氽或与桂花同煮。',flavor:['清甜','软糯'],state:'煮熟后',image:null,
    recipeTitle:'先试一碗桂花鸡头米',recipe:'鲜鸡头米下水煮熟，临出锅时添少量糖与桂花，让清香托住本身的味道。也可以照苏州常见做法清氽，或与虾仁同炒。',pair:'桂花提供香气，鸡头米仍是主角；若想走咸鲜方向，可试虾仁。',buy:'搜索“苏州 鲜鸡头米 现剥”。留意商品写的是鲜粒还是干芡实，两者处理方式不同。',search:'苏州 鲜鸡头米 现剥',
    sources:[['苏州工业园区：鸡头米采收时节','https://www.sipac.gov.cn/szgyyq/mtjj/202408/554f4896f0bd49328136c722a2db1dbc.shtml'],['苏州市农业农村局：当地吃法','https://nyncj.suzhou.gov.cn/nlj/ywdt/202108/e0df9149f3aa48a0ae5059b9a027c76f.shtml']]
  },
  {
    id:'foshougua-miao',name:'佛手瓜苗',alias:['佛手瓜尖','龙须菜'],region:'花莲 / 贵州普定',lat:24.00,lon:121.60,months:[4,5,7],season:'花莲资料记录四至五月盛产；贵州普定有七月采收报道。两地季节不能互相套用。',
    description:'佛手瓜的幼嫩卷须与茎叶，入口是一种很直接的青绿感。',short:'卷须与嫩茎叶一起快炒，保留清脆。',flavor:['草本','脆嫩'],state:'快炒后',image:'/assets/chayote-shoots.jpg',imageAlt:'炒熟的佛手瓜苗与卷须',imageCaption:'图为台湾做熟后的佛手瓜苗。',
    recipeTitle:'快炒，让卷须保留一点脆',recipe:'先摘去明显粗老的茎段，洗净沥干。热锅快炒至嫩叶与卷须熟透，少量盐调味；想添香气，可以配一点蒜。',pair:'蒜负责香气，主角仍是嫩茎叶的清爽与脆感。',buy:'搜索“佛手瓜苗”或“佛手瓜尖”。“龙须菜”也可能指别的食材，搜索时加上“佛手瓜”。',search:'佛手瓜苗 新鲜 嫩尖',
    sources:[['台湾农业部：龙须菜（佛手瓜苗）挑选与吃法','https://epost.moa.gov.tw/theme_data.php?id=181&sub_theme=photo&theme=epost'],['贵州普定七月采收报道','https://gz.people.com.cn/n2/2026/0721/c194849-41645206.html']]
  },
  {
    id:'cinenya',name:'刺嫩芽',alias:['刺老芽','龙牙楤木嫩芽'],region:'吉林龙湾',lat:42.40,lon:126.40,months:[4,5,6],season:'吉林龙湾资料记录春末至初夏，嫩叶尚未舒展时采食。',
    description:'山野里短暂出现的嫩芽，带一点苦，焯过后更适合入菜。',short:'焯水后过凉，蘸酱或与鸡蛋同炒。',flavor:['草本','微苦','脆嫩'],state:'焯水后',image:null,
    recipeTitle:'焯水过凉，再蘸酱',recipe:'去掉外层苞片，洗净后焯熟，再放凉水中稍浸。先蘸少量酱吃，感受它本来的味道；也可与鸡蛋同炒。',pair:'鸡蛋的温和口感能托住嫩芽微苦的风味。',buy:'搜索“吉林 刺嫩芽”或“刺老芽”。野采货要确认辨识与采集环境，不购买来源不明的野生嫩芽。',search:'吉林 刺嫩芽 新鲜',safety:'野菜需要准确辨识，并避开污染区域。来源不明的野采嫩芽不要自行尝试。',
    sources:[['吉林省林业和草原局：刺嫩芽季节与处理','https://jllc.jl.gov.cn/stwm/lywx/202405/t20240527_3167598.html'],['北京市政府：野菜采食注意事项','https://www.beijing.gov.cn/fuwu/bmfw/sy/jrts/202604/t20260408_4576672.html']]
  },
  {
    id:'cigu',name:'慈姑',alias:['茨菇','茨菰'],region:'江苏如东',lat:32.33,lon:121.19,months:[11,12,1,2],season:'江苏如东资料记录十一月至次年二月采收。',
    description:'长在水田里的球茎，做熟后带粉糯口感，适合慢慢烧。',short:'到了冬天，和肉一起烧，尝它的粉糯。',flavor:['粉糯','微苦'],state:'烧熟后',image:null,
    recipeTitle:'和肉一起慢烧',recipe:'削去外皮，切块后与已经煸出香味的肉同烧，直到慈姑完全熟透、内部变得粉糯。苏州地方资料记录了“茨菇烧肉”这道做法。',pair:'肉汁的浓厚与慈姑的粉糯互相衬托。',buy:'搜索“如东 慈姑”或“茨菇”。注意别与香菇类商品混淆，买的是水生球茎。',search:'江苏 慈姑 新鲜 球茎',safety:'慈姑属于水生食材，清洗后应充分做熟。',
    sources:[['如东县政府：慈姑冬季采收','https://www.rudong.gov.cn/rdxrmzf/tpgzjz/content/5160380a-f497-4a4d-8a25-17a39c8066b2.html'],['苏州地方志：茨菇烧肉','https://dfzb.suzhou.gov.cn/dfzb/szdq/202012/75c7c63b7e6242788b9c34bef57fe3ef.shtml'],['国家卫健委：水生植物烹食提示','https://www.nhc.gov.cn/bgt/pw10411/201212/f0a2ba145692427aaacf84d19f15c074.shtml']]
  },
  {
    id:'dier',name:'地耳',alias:['地皮菜','地软'],region:'陕西岚皋',lat:32.31,lon:108.90,months:[6,7,8,9],season:'陕西岚皋与化龙山资料记录夏秋雨后可见；是否出现取决于降雨。',
    description:'雨后草间出现的普通念珠藻。洗净泥沙，能给汤添一层柔滑。',short:'雨后出现的地皮菜，洗净入汤。',flavor:['柔滑','清淡'],state:'煮熟后',image:null,
    recipeTitle:'洗净泥沙，做一碗汤',recipe:'反复清洗去除泥沙；若买到干品，先泡发再清洗。与鸡蛋做一碗清汤，煮熟后上桌。',pair:'鸡蛋让汤更饱满，地耳负责柔滑的口感。',buy:'搜索“地耳”或“地皮菜”。检查是否有异味、霉变或明显杂质；野外自采需确认环境与辨识。',search:'地耳 地皮菜 干品',
    sources:[['陕西化龙山保护区：地耳与雨后出现','https://hlsbhq.ankang.gov.cn/Content-1535018.html'],['岚皋县政府：清洗、晾干与入汤','https://www.langao.gov.cn/Content-1662773.html'],['甘肃省食品安全企业标准：外观检查','https://wsjk.gansu.gov.cn/wsjk/c113471/202412/174053641/files/b35ca443263c4f57aa445d4b4c71922a.pdf']]
  }
];
const byId=Object.fromEntries(foods.map(food=>[food.id,food]));
const orderByMonth={1:['cigu'],2:['cigu'],4:['foshougua-miao','cinenya'],5:['foshougua-miao','cinenya'],6:['cinenya','dier'],7:['foshougua-miao','dier'],8:['jitoumi','dier'],9:['nanhu-ling','jitoumi','dier'],10:['nanhu-ling','jitoumi'],11:['cigu'],12:['cigu']};
const seasonTitles={1:'冬水田里，留着一口粉糯。',2:'冬天的尾声，尝一颗慈姑。',4:'山野与藤蔓，刚刚冒尖。',5:'趁嫩，认识春末的绿。',6:'雨落以后，山野有了新味道。',7:'夏天的嫩尖，遇见雨后地耳。',8:'水乡开始有了鲜鸡头米。',9:'从水乡，走向雨后的山野。',10:'秋水里的最后一口鲜。',11:'水田的冬天，刚刚开始。',12:'把慈姑放进慢火的锅里。'};
let selectedMonth=new Date().getMonth()+1;
foods.forEach(f=>f.places=f.id==='foshougua-miao'?[{name:'花莲',lat:24.00,lon:121.60,months:[4,5]},{name:'贵州普定',lat:26.33,lon:105.75,months:[7]}]:[{name:f.region,lat:f.lat,lon:f.lon,months:f.months}]);
let currentView='season';
let mapOnlySeason=true;
let previousFocus=null;
const $=id=>document.getElementById(id);
const monthFoods=month=>(orderByMonth[month]||[]).map(id=>byId[id]);
const monthLabel=m=>`${String(m).padStart(2,'0')} 月`;
const imageStyle=food=>food.image?`style="background-image:linear-gradient(0deg,rgba(9,36,29,.84),rgba(9,36,29,.03) 75%),url('${food.image}')"`:'style="background-image:linear-gradient(0deg,rgba(9,36,29,.78),rgba(9,36,29,.12)),url(\'/assets/terrain.webp\')"';
function renderMonths(){
  $('mapMonthSelect').innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===selectedMonth?'selected':''}>${i+1} 月</option>`).join('');
  $('months').innerHTML=Array.from({length:12},(_,i)=>{const m=i+1;return `<button class="${m===selectedMonth?'active':''}" data-month="${m}" aria-label="${m}月" aria-current="${m===selectedMonth?'date':'false'}">${String(m).padStart(2,'0')}</button>`}).join('');
  $('months').querySelectorAll('button').forEach(b=>b.onclick=()=>setMonth(Number(b.dataset.month)));
  $('mapMonthSelect').onchange=e=>setMonth(Number(e.target.value));
}
function setMonth(month){selectedMonth=month;renderMonths();renderSeason();renderMap();if(currentView==='map'){$('mapMonthLabel').textContent=monthLabel(month)} }
function renderSeason(){
  const list=monthFoods(selectedMonth);const lead=list[0];
  $('seasonKicker').textContent=`${monthLabel(selectedMonth)} · ${list.length?`${list.length} 种已核实食材`:'资料仍在收集'}`;
  $('seasonHeading').textContent=seasonTitles[selectedMonth]||'这个月，先留一页空白。';
  $('seasonIntro').textContent=list.length?'挑一味点进去，先知道怎么吃、怎么挑，再沿着产地或口感继续逛。':'目前没有完成地区和时令核实的词条。你仍可到地图查看其他月份的六种样本。';
  if(!lead){$('hero').innerHTML=`<div class="eyebrow">${monthLabel(selectedMonth)} · 资料仍在收集</div><h1>不急着填满<br><em>每一个月份。</em></h1><p>这段时间的食材尚未完成产区和时令核实。可以沿着地图先认识已经整理好的六种。</p><button class="hero-cta" data-go="map">看看已收录的地方 <span aria-hidden="true">↗</span></button><div class="hero-photo hero-terrain"><img src="/assets/terrain.webp" alt="东亚地区的自然地形" width="1920" height="1140"></div>`}
  else{$('hero').innerHTML=`<div class="eyebrow">${monthLabel(selectedMonth)} / ${lead.region}</div><h1>${selectedMonth===9?'水乡结出的<br><em>秋天棱角。</em>':selectedMonth===4||selectedMonth===5?'藤蔓与山野<br><em>都在冒尖。</em>':`这一口<br><em>${lead.name}。</em>`}</h1><p>${lead.description}</p><button class="hero-cta" data-food="${lead.id}">认识${lead.name} <span aria-hidden="true">↗</span></button><div class="hero-photo ${lead.image?'':'hero-terrain'}"><img src="${lead.image||'/assets/terrain.webp'}" alt="${lead.imageAlt||'产区自然地形'}" width="960" height="960"></div><div class="hero-index">01 / ${String(list.length).padStart(2,'0')} <span>本月风物</span></div>`}
  $('seasonCards').innerHTML=list.length?list.map((f,i)=>`<article class="season-card card-${i+1}" ${imageStyle(f)}><small>${f.region} · ${f.months.map(m=>String(m).padStart(2,'0')).join(' / ')} 月</small><h3>${f.name}</h3><p>${f.short}</p><button data-food="${f.id}" aria-label="阅读${f.name}详情">读它的故事 <span aria-hidden="true">↗</span></button></article>`).join(''):`<div class="empty-month"><span>∿</span><h3>这一页还在等待可靠的资料</h3><p>时令因产地不同而变化；没有核实，就先不把它写进地图。</p></div>`;
  $('seasonCards').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food));
  $('hero').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food));
  $('hero').querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>setView(b.dataset.go));
}
function setView(view){currentView=view;document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==`${view}View`);document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('is-active',b.dataset.view===view));if(view==='map')renderMap();if(view==='flavor')renderFlavor();window.scrollTo({top:0,behavior:'instant'});}
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('mapPrompt').onclick=()=>setView('map');
function position(food){return {x:(food.lon-72)/64*100,y:(54-food.lat)/38*100}}
function renderMap(){
  $('mapMonthLabel').textContent=`${monthLabel(selectedMonth)} · ${monthFoods(selectedMonth).length} 种记录`;
  $('mapSeasonButton').textContent=mapOnlySeason?'查看全部产地':'只看本月';
  const list=mapOnlySeason?monthFoods(selectedMonth):foods;
  const places=list.flatMap(f=>f.places.filter(p=>!mapOnlySeason||p.months.includes(selectedMonth)).map(p=>({food:f,place:p})));
  $('mapPins').innerHTML=places.map(({food:f,place})=>{const p=position(place);return `<button class="map-pin ${f.id==='jitoumi'?'pin-suzhou':''}" style="left:${p.x}%;top:${p.y}%" data-food="${f.id}" aria-label="${place.name}：${f.name}"><span class="pin-dot"></span><span class="pin-label">${f.name}<small>${place.name}</small></span></button>`}).join('');
  $('mapList').innerHTML=places.length?places.map(({food:f,place})=>`<button data-food="${f.id}"><span>${place.name}</span><strong>${f.name}</strong><span>看详情 ↗</span></button>`).join(''):'<p>这个月尚无已核实的产地记录。可以切换月份或查看全部产地。</p>';
  document.querySelectorAll('#mapView [data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food));
  if(window.innerWidth<=800&&places.length){const wrap=document.querySelector('.map-wrap');const width=document.querySelector('.map-image').getBoundingClientRect().width;const mean=places.reduce((sum,item)=>sum+position(item.place).x,0)/places.length;wrap.scrollLeft=width*mean/100-wrap.clientWidth/2}
}
$('mapSeasonButton').onclick=()=>{mapOnlySeason=!mapOnlySeason;renderMap()};
function detailHtml(f){
  const similar=relations.filter(([a,b])=>a===f.id||b===f.id).map(([a,b,why])=>({food:byId[a===f.id?b:a],why}));
  return `<div class="detail-hero"><div class="detail-topline">食材记录 · ${f.region}</div><h1>${f.name}</h1><p>${f.description}</p><div class="detail-tags">${f.flavor.map(t=>`<span>${t}</span>`).join('')}<small>描述状态：${f.state}</small></div>${f.image?`<figure><img src="${f.image}" alt="${f.imageAlt}" width="960" height="960"><figcaption>${f.imageCaption}</figcaption></figure>`:''}</div>
  <div class="detail-body"><section><p class="detail-num">01 / 何时遇见</p><h2>把时令放回产地。</h2><p>${f.season}</p></section>
  <section><p class="detail-num">02 / 怎么吃</p><h2>${f.recipeTitle}</h2>${f.safety?`<div class="safety"><strong>先留意食用安全</strong><p>${f.safety}</p></div>`:''}<p>${f.recipe}</p><p class="pair-note">搭配的用意 · ${f.pair}</p></section>
  <section><p class="detail-num">03 / 怎么找</p><h2>买回来，别找错。</h2><p>${f.buy}</p><button class="copy-button" data-copy="${f.search}">复制搜索词 <strong>${f.search}</strong> <span aria-hidden="true">↗</span></button></section>
  <section class="detail-sources"><p class="detail-num">资料出处</p><p>产地和时令记录依据以下资料；吃法中的搭配建议由本站编辑整理。</p><ol>${f.sources.map(([title,url])=>`<li><a href="${url}" target="_blank" rel="noopener">${title} ↗</a></li>`).join('')}</ol></section>
  <section class="detail-next"><p class="detail-num">换个口味</p><h2>喜欢这一口，还能认识什么？</h2><div>${similar.length?similar.map(({food,why})=>`<button data-food="${food.id}"><strong>${food.name}</strong><span>${why} ↗</span></button>`).join(''):'<p>目前没有足够资料支持风味相近的关联。可以继续从月份或地图找。</p>'}</div></section></div>`;
}
function openFood(id,push=true){const f=byId[id];if(!f)return;previousFocus=document.activeElement;$('detailContent').innerHTML=detailHtml(f);if(!$('detailDialog').open)$('detailDialog').showModal();$('detailDialog').scrollTop=0;$('detailContent').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>openFood(b.dataset.food));$('detailContent').querySelector('[data-copy]').onclick=async e=>{const value=e.currentTarget.dataset.copy;try{await navigator.clipboard.writeText(value);toast('搜索词已复制')}catch{toast(`搜索词：${value}`)}};if(push){const url=new URL(location.href);url.searchParams.set('food',id);history.pushState({food:id},'',url)}}
function closeFood(push=true){if(!$('detailDialog').open)return;$('detailDialog').close();if(push){const url=new URL(location.href);url.searchParams.delete('food');history.pushState({},'',url)}previousFocus?.focus?.()}
$('detailClose').onclick=()=>closeFood();$('detailDialog').addEventListener('click',e=>{if(e.target===$('detailDialog'))closeFood()});$('detailDialog').addEventListener('cancel',e=>{e.preventDefault();closeFood()});window.addEventListener('popstate',()=>{const id=new URL(location.href).searchParams.get('food');if(id&&byId[id])openFood(id,false);else closeFood(false)});
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2300)}
function renderSearch(query=''){
  const q=query.trim().toLowerCase();const matches=q?foods.filter(f=>[f.name,...f.alias,f.region].some(v=>v.toLowerCase().includes(q))):foods;
  $('searchResults').innerHTML=matches.length?matches.map(f=>`<button data-food="${f.id}"><span><strong>${f.name}</strong><small>${f.alias.join(' · ')}</small></span><em>${f.region} ↗</em></button>`).join(''):'<p class="search-empty">还没有这味食材。试试别名，或从六种已收录食材里逛逛。</p>';
  $('searchResults').querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{$('searchDialog').close();openFood(b.dataset.food)});
}
$('searchTrigger').onclick=()=>{renderSearch();$('searchDialog').showModal();$('searchInput').value='';$('searchInput').focus()};$('searchClose').onclick=()=>$('searchDialog').close();$('searchInput').oninput=e=>renderSearch(e.target.value);$('searchDialog').addEventListener('click',e=>{if(e.target===$('searchDialog'))$('searchDialog').close()});
const relations=[['foshougua-miao','cinenya','都有草本气息和脆嫩口感'],['jitoumi','cigu','熟后都偏糯，质地各不相同'],['cinenya','cigu','都有一丝微苦']];
const starNodes=[{id:'nanhu-ling',x:-.62,y:.12,z:.65},{id:'jitoumi',x:-.1,y:-.48,z:.72},{id:'foshougua-miao',x:.53,y:.45,z:.45},{id:'cinenya',x:.74,y:-.2,z:-.1},{id:'cigu',x:-.42,y:-.43,z:-.45},{id:'dier',x:.13,y:.58,z:-.6}];
let rotX=-.22,rotY=.35,starSelected='foshougua-miao',starDrag=null,projected=[];
function project(node,w,h){const cy=Math.cos(rotY),sy=Math.sin(rotY),cx=Math.cos(rotX),sx=Math.sin(rotX);const x=node.x*cy-node.z*sy,z=node.x*sy+node.z*cy,y=node.y*cx-z*sx,depth=node.y*sx+z*cx;const scale=Math.min(w,h)*.36*(1+depth*.22);return {x:w/2+x*scale,y:h/2+y*scale,z:depth}}
function drawStar(){const canvas=$('flavorCanvas');if(!canvas||currentView!=='flavor')return;const box=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const w=box.width,h=box.height;ctx.clearRect(0,0,w,h);const glow=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.min(w,h)*.52);glow.addColorStop(0,'#416659');glow.addColorStop(1,'#193d35');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  projected=starNodes.map(n=>({...project(n,w,h),id:n.id}));
  relations.forEach(([a,b])=>{const A=projected.find(n=>n.id===a),B=projected.find(n=>n.id===b);ctx.strokeStyle=a===starSelected||b===starSelected?'#dac791bb':'#d6d6b744';ctx.lineWidth=a===starSelected||b===starSelected?1.5:1;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke()});
  projected.sort((a,b)=>a.z-b.z).forEach(n=>{const active=n.id===starSelected,r=active?8:5;ctx.beginPath();ctx.arc(n.x,n.y,r+8,0,Math.PI*2);ctx.fillStyle=active?'#d6c99633':'#e7e4d118';ctx.fill();ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fillStyle=active?'#e6d7a8':'#e5ebd6';ctx.fill();ctx.fillStyle='#fffaf0';ctx.font=`${active?'600 ':''}16px 'Noto Sans SC'`;ctx.textAlign='center';ctx.fillText(byId[n.id].name,n.x,n.y-17)})
}
function renderFlavor(){const selected=byId[starSelected];const linked=relations.filter(([a,b])=>a===starSelected||b===starSelected).map(([a,b,why])=>({food:byId[a===starSelected?b:a],why}));$('flavorAside').innerHTML=`<p class="kicker">已选择 / ${selected.region}</p><h2>${selected.name}</h2><p>${selected.description}</p><div class="aside-tags">${selected.flavor.map(t=>`<span>${t}</span>`).join('')}</div><button class="aside-primary" data-food="${selected.id}">读${selected.name}的吃法 ↗</button><h3>顺着风味继续</h3>${linked.length?linked.map(({food,why})=>`<button class="relation" data-select="${food.id}"><strong>${food.name}</strong><span>${why}</span></button>`).join(''):'<p class="no-relation">目前没有经过记录的相近风味。转动星图继续找。</p>'}`;$('flavorList').innerHTML=foods.map(f=>`<button data-select="${f.id}" class="${f.id===starSelected?'active':''}">${f.name}<span>${f.flavor.join(' · ')}</span></button>`).join('');document.querySelectorAll('[data-select]').forEach(b=>b.onclick=()=>{starSelected=b.dataset.select;renderFlavor()});document.querySelector('#flavorAside [data-food]').onclick=()=>openFood(selected.id);drawStar()}
const canvas=$('flavorCanvas');canvas.addEventListener('pointerdown',e=>{starDrag={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!starDrag)return;const dx=e.clientX-starDrag.x,dy=e.clientY-starDrag.y;if(Math.abs(dx)+Math.abs(dy)>2)starDrag.moved=true;rotY+=dx*.009;rotX=Math.max(-1,Math.min(1,rotX+dy*.009));starDrag.x=e.clientX;starDrag.y=e.clientY;drawStar()});canvas.addEventListener('pointerup',e=>{if(!starDrag?.moved){const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const hit=projected.find(n=>Math.hypot(n.x-x,n.y-y)<28);if(hit){starSelected=hit.id;renderFlavor()}}starDrag=null});window.addEventListener('resize',()=>{if(currentView==='flavor')drawStar()});
renderMonths();renderSeason();renderMap();const deepLink=new URL(location.href).searchParams.get('food');if(deepLink&&byId[deepLink])openFood(deepLink,false);
