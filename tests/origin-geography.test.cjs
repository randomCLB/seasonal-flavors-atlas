'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../dist/lottery-core.js'),ctx={window:{}};
vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',name+'.js'),'utf8'),ctx);
const foods=JSON.parse(JSON.stringify(ctx.window.FOODS)),profiles=ctx.window.LOTTERY_PROFILES,events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES);
// Coarse regional bounds catch distant misplacement; these are not boundary polygons or farm locations.
const bounds={浙江:[27,31.3,118,123],江苏:[30.7,35.3,116.3,122],吉林:[40.8,46.4,121.6,131.4],陕西:[31.7,39.6,105.4,111.3],广东:[20.1,25.6,109.6,117.4],湖北:[29,33.4,108.3,116.2],云南:[21.1,29.3,97.5,106.2],宁夏:[35.1,39.4,104.2,107.7],湖南:[24.6,30.2,108.7,114.3],北京:[39.4,41.1,115.4,117.6],内蒙古:[37.4,53.4,97.1,126.1],贵州:[24.6,29.3,103.6,109.6],重庆:[28.1,32.3,105.2,110.3],辽宁:[38.5,43.5,118.8,125.8],新疆:[34.3,49.2,73.4,96.4],青海:[31.5,39.4,89.3,103.1],山东:[34.3,38.4,114.7,122.8],安徽:[29.4,34.7,114.8,119.7],福建:[23.4,28.4,115.8,120.7],四川:[26,34.4,97.3,108.6],上海:[30.6,31.9,120.8,122.2],河南:[31.3,36.4,110.3,116.7],黑龙江:[43.4,53.6,121.1,135.2],甘肃:[32.5,42.9,92.3,108.8],台湾:[21.8,25.4,119.3,122.1],花莲:[23.3,24.4,121.1,121.9]};
const localNames={浙江:'南湖 桐乡 建德 宁海 上虞 温州',江苏:'宝应 淮安 如皋 高淳 沙洲 溧阳 连云港',广东:'增城 澄海 从化 珠海 郁南',湖北:'洪山 洪湖 阳新',湖南:'湘阴 汉寿',重庆:'璧山',云南:'洱源 武定 西双版纳',陕西:'旬阳 临潼',辽宁:'大连',新疆:'阿图什 库车',青海:'青海',安徽:'霍山',福建:'晋江 闽清 建瓯',吉林:'镇赉',山东:'烟台 胶州湾',上海:'崇明',台湾:'台东',河南:'偃师 陕州',黑龙江:'哈尔滨',甘肃:'民勤',宁夏:'盐池'};
test('named regional foods retain their local identity before any introduced growing area',()=>{
 for(const f of foods)for(const [province,names] of Object.entries(localNames))for(const name of names.split(' '))if(f.name.startsWith(name)){
  assert.ok(f.region.startsWith(province),`${f.name}: ${f.region}`);
  assert.ok(f.placeSeasons[0].name.startsWith(province),`${f.name}: primary map origin`);
 }
});
test('every map origin has plausible regional coordinates, declared sources and its own months',()=>{
 for(const f of foods){
  assert.equal(f.lat,f.placeSeasons[0].lat,f.id);assert.equal(f.lon,f.placeSeasons[0].lon,f.id);
  assert.deepEqual([...new Set(f.placeSeasons.flatMap(p=>p.months))].sort((a,b)=>a-b),[...f.peakMonths].sort((a,b)=>a-b),f.id);
  for(const p of f.placeSeasons){
   const province=Object.keys(bounds).find(name=>p.name.startsWith(name));assert.ok(province,`${f.id}: ${p.name}`);
   const [south,north,west,east]=bounds[province];assert.ok(p.lat>=south&&p.lat<=north&&p.lon>=west&&p.lon<=east,`${f.id}: ${p.name} (${p.lat}, ${p.lon})`);
   assert.ok(f.sources.some(s=>s[1]===p.source),`${f.id}: undeclared origin source`);
   assert.ok(p.months.length&&p.months.every(m=>f.months.includes(m)),`${f.id}: origin months`);
  }
 }
});
test('multi-origin scheduling selects only the origin in season across all twelve months',()=>{
 for(const f of foods.filter(f=>f.placeSeasons.length>1))for(let m=1;m<=12;m++){
  const day=`2027-${String(m).padStart(2,'0')}-28`,days=C.candidateDays(f,profiles[f.id],{startDay:day,endDay:day},events);
  for(const d of days)assert.ok(f.placeSeasons.some(p=>p.name===d.place&&p.source===d.source&&p.months.includes(m)),`${f.id}/${day}`);
 }
});
test('season cards and hero label the active growing area rather than combining all origins',()=>{
 const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8'),display={};vm.createContext(display);
 vm.runInContext(app.slice(app.indexOf('const monthLabel='),app.indexOf('const chinaParts=')),display);
 for(const [id,month,expected,excluded] of [['wenzhou-pancai',2,'浙江温州 · 1—2月','宁夏'],['wenzhou-pancai',9,'宁夏贺兰 · 温州盘菜引种 · 9—10月','浙江'],['foshougua-miao',4,'花莲 · 4—5月','贵州'],['foshougua-miao',7,'贵州普定 · 7月','花莲']]){
  display.food=foods.find(f=>f.id===id);display.month=month;
  const label=vm.runInContext('foodSeasonMeta(food,month)',display);assert.equal(label,expected);assert.ok(!label.includes(excluded));
 }
 assert.ok(app.includes('${foodSeasonMeta(featured,foodMonth)}'));
 assert.ok(app.includes('${foodSeasonMeta(food,foodMonth,food.cardLabel||food.region)}'));
});
test('regional flavors have their own declared sources and do not inherit the recipe flavor',()=>{
 const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8'),display={};vm.createContext(display);
 vm.runInContext(app.slice(app.indexOf('const monthLabel='),app.indexOf('const chinaParts=')),display);
 const pan=foods.find(f=>f.id==='wenzhou-pancai');
 for(const f of foods)for(const p of f.placeSeasons)if(p.flavorNote)assert.ok(p.flavorSource&&f.sources.some(s=>s[1]===p.flavorSource),`${f.id}/${p.name}`);
 display.food=pan;const html=vm.runInContext('originDetails(food)',display);
 assert.equal((html.match(/<article>/g)||[]).length,2);assert.ok(html.includes('偏甜糯'));assert.ok(html.includes('脆口'));
 assert.ok(html.includes('一月下旬'));assert.ok(html.includes('九月采收'));assert.ok(html.includes('查看风味来源'));
 display.food=foods.find(f=>f.id==='foshougua-miao');const unknown=vm.runInContext('originDetails(food)',display);
 assert.equal((unknown.match(/暂未确认这处产区独有的风味差异/g)||[]).length,2);
 display.food=foods.find(f=>f.id==='nanhu-ling');assert.equal(vm.runInContext('originDetails(food)',display),'');
});
test('a map cluster keeps two locations of one food instead of dropping one by food ID',()=>{
 const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8'),f=foods.find(f=>f.id==='wenzhou-pancai'),pop={style:{},querySelectorAll:()=>[],querySelector:()=>({})},pin={style:{left:'50%',top:'50%'}};
 const display={mapGroups:[f.placeSeasons.map(place=>({food:f,place}))],popupTimer:null,clearTimeout:()=>{},hideMapPopup:()=>{},shortPlace:name=>name,foodThumbnail:()=>f.image,$:id=>id==='mapPopover'?pop:{querySelector:()=>pin}};
 vm.createContext(display);vm.runInContext(app.slice(app.indexOf('const monthLabel='),app.indexOf('const chinaParts=')),display);
 vm.runInContext(app.slice(app.indexOf('function openMapPopup('),app.indexOf("$('mapPopover').onmouseenter")),display);
 vm.runInContext('openMapPopup(0)',display);
 assert.equal((pop.innerHTML.match(/data-food="wenzhou-pancai"/g)||[]).length,2);
 for(const p of f.placeSeasons){assert.ok(pop.innerHTML.includes(p.name));assert.ok(pop.innerHTML.includes(p.flavorNote));}
 assert.ok(pop.innerHTML.includes('1—2月'));assert.ok(pop.innerHTML.includes('9—10月'));
});
