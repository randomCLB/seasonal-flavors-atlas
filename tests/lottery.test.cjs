'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js');
const ctx={window:{}};vm.createContext(ctx);
for(const f of ['solar-terms','data','editorial','editorial-notes','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',f+'.js'),'utf8'),ctx);
const foods=JSON.parse(JSON.stringify(ctx.window.FOODS)),profiles=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES));
const events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES),now=Date.parse('2026-09-29T12:00:00Z');
const prefs={avoid:[],excludeText:'',tastes:[],textures:[],cooking:[],curiosity:1};
const opts=(patch={})=>({foods,profiles,prefs,events,slots:C.nextSix(events,now),seed:'test-seed',...patch});
const draw=patch=>C.draw(opts(patch));
const food=id=>foods.find(f=>f.id===id);
const score=(id,p=prefs)=>C.scoreFood(food(id),profiles[id],p);
function makePlan(){return {schema:2,id:'stable-plan',createdAt:now,updatedAt:now,revision:0,prefs,slots:draw()};}
const neutral={...prefs,tastes:[],textures:[],cooking:[],curiosity:0};

test('detail food photos belong to existing entries and ship with the site',()=>{
 const ids=new Set(foods.map(f=>f.id));
 for(const id of vm.runInContext('Object.keys(PHOTO_UPDATES)',ctx))assert.ok(ids.has(id),`unknown photo entry ${id}`);
 for(const f of foods){assert.ok(f.dishImage||f.cutImage||f.tarotImage?.src,`${f.id}: missing edible image`);for(const src of [f.dishImage,f.cutImage,f.tarotImage?.src].filter(Boolean))assert.ok(fs.existsSync(path.join(root,'dist',src)),`${f.id}: ${src}`);}
});

test('all 67 recipes and sensory source fingerprints match; disabled stay explicit',()=>{
 assert.equal(foods.length,67);assert.equal(Object.values(profiles).filter(p=>p.disabled).length,3);
 for(const f of foods){const p=profiles[f.id];assert.equal(C.signature(f),p.signature,f.id);assert.equal(C.sensorySignature(f),p.senses.signature,f.id);for(const [k,labels] of [['tastes',C.TASTES],['recipeTastes',C.TASTES],['textures',C.TEXTURES],['cooking',C.COOKING]])assert.ok(p.senses[k].every(t=>Object.hasOwn(labels,t)));assert.ok(p.senses.cooking.length>0);}
});
test('five-question schema exposes taste/texture/cooking/curiosity, not procurement or familiarity',()=>{
 assert.deepEqual(Object.keys(C.TASTES),['sour','sweet','bitter','spicy','salty','umami']);
 assert.equal(Object.keys(C.TEXTURES).length,5);assert.equal(Object.keys(C.COOKING).length,5);assert.equal(C.validatePrefs(prefs),prefs);
 const many={...prefs,tastes:Object.keys(C.TASTES),textures:Object.keys(C.TEXTURES),cooking:Object.keys(C.COOKING)};assert.equal(C.validatePrefs(many),many);
 assert.throws(()=>C.validatePrefs({avoid:[],flavors:['crisp'],effort:1,buy:'both',adventure:1}),/味道/);
});
test('taste changes score independently of texture',()=>{
 assert.ok(score('lintong-huojing-shizi',{...neutral,tastes:['sweet']})>score('lintong-huojing-shizi',{...neutral,tastes:['sour']}));
 assert.equal(score('foshougua-miao',{...neutral,tastes:['sweet']})-score('foshougua-miao',neutral),4);
});
test('texture changes score independently of taste',()=>{
 assert.ok(score('foshougua-miao',{...neutral,textures:['crisp']})>score('foshougua-miao',{...neutral,textures:['soft']}));
 assert.ok(score('juema',{...neutral,textures:['soft']})>score('juema',{...neutral,textures:['crisp']}));
});
test('cooking preference filters to tagged methods, not effort or purchase',()=>{
 assert.ok(score('foshougua-miao',{...neutral,cooking:['stirfry']})>score('foshougua-miao',{...neutral,cooking:['soup']}));
 const slot=C.nextSix(events,now)[2];const a=C.poolFor(foods,profiles,{...neutral,cooking:['stirfry']},slot,events),b=C.poolFor(foods,profiles,{...neutral,cooking:['soup']},slot,events);assert.notDeepEqual(a,b);
 for(const row of a)assert.ok(C.matchesPreferences(food(row.id),profiles[row.id],{...neutral,cooking:['stirfry']}));
});
test('every selected preference group must match a food or its declared recipe',()=>{
 const f=food('honghu-oudai'),p=profiles[f.id];
 assert.ok(C.matchesPreferences(f,p,{...neutral,tastes:['sour','sweet'],textures:['crisp','soft'],cooking:['stirfry','soup']}));
 assert.ok(!C.matchesPreferences(f,p,{...neutral,tastes:['bitter'],textures:['crisp'],cooking:['stirfry']}));
 const boiled=food('nanhu-ling');assert.ok(profiles[boiled.id].senses.cooking.includes('boil'));
});
test('sour/spicy seasoning is not attributed to raw lotus runners',()=>{
 const f=food('honghu-oudai'),p=profiles[f.id],pr={...neutral,tastes:['sour','spicy']},m=C.matchInfo(f,p,pr);
 assert.deepEqual(m.tastes,[]);assert.deepEqual(m.recipeTastes,['sour','spicy']);
 assert.match(C.recommendationReason(f,p,pr),/来自配料或调味/);
});
test('curiosity weights concrete features, not more random noise or assumed familiarity',()=>{
 const p0={...neutral,curiosity:0},p2={...neutral,curiosity:2};
 assert.ok(score('minqing-tanxiang-olive',p2)>score('minqing-tanxiang-olive',p0));
 assert.equal(score('kuche-xiaobaixing',p2),score('kuche-xiaobaixing',p0));
 const r=C.recommendationReason(food('minqing-tanxiang-olive'),profiles['minqing-tanxiang-olive'],p2);
 assert.match(r,/先涩后回甘/);assert.doesNotMatch(r,/你没吃过|对你陌生|你不熟悉/);
});
test('high curiosity never admits disabled foods or overrides exclusions',()=>{
 const p={...prefs,curiosity:2,avoid:['seafood','egg']};
 for(const f of foods){const pr=profiles[f.id];if(pr.disabled||pr.avoid.some(x=>p.avoid.includes(x)))assert.equal(C.eligible(f,pr,p),false,f.id);}
});
test('obsolete buy/effort/adventure properties do not change recommendations',()=>{
 assert.deepEqual(draw({prefs:{...prefs,buy:'local',effort:0,adventure:0}}),draw({prefs:{...prefs,buy:'online',effort:2,adventure:2}}));
});
test('stale sensory descriptions receive no preference or curiosity bonus',()=>{
 const f=structuredClone(food('foshougua-miao'));f.texture='changed';
 assert.equal(C.scoreFood(f,profiles[f.id],prefs),2);assert.deepEqual(C.matchInfo(f,profiles[f.id],prefs).features,[]);
});
test('unmatched preferences keep a slot blank instead of recommending a mismatch',()=>{
 const f=food('kuche-xiaobaixing'),p={...neutral,tastes:['bitter'],textures:['soft'],cooking:['soup']};
 assert.ok(!C.matchesPreferences(f,profiles[f.id],p));
 const slot=C.nextSix(events,now)[0],result=C.draw({foods:[f],profiles:{[f.id]:profiles[f.id]},prefs:p,events,slots:[slot],seed:'no-match'});
 assert.equal(result[0].foodId,null);assert.match(result[0].reason,/符合所选口味/);
});
test('question UI contains five new headings and no legacy input controls',()=>{
 const s=fs.readFileSync(path.join(root,'dist/lottery-ui.js'),'utf8');
 assert.equal((s.match(/\{title:'[^']+？'/g)||[]).length,5);assert.match(s,/酸、甜、苦、辣、咸、鲜/);assert.match(s,/咬下去/);assert.match(s,/端上桌/);assert.match(s,/猎奇到什么程度/);assert.doesNotMatch(s,/最多选两项/);
 assert.doesNotMatch(s,/prefs\.(buy|effort|adventure|flavors)\b/);assert.match(s,/SCHEMA=2/);
});
test('question page has no stale static element references after simplifying calendar',()=>{
 const html=fs.readFileSync(path.join(root,'dist/lottery.html'),'utf8'),ui=fs.readFileSync(path.join(root,'dist/lottery-ui.js'),'utf8');
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1])),dynamic=new Set(['exclude-text','question-title']);
 for(const [,id] of ui.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.has(id)||dynamic.has(id),`missing UI element: ${id}`);
 assert.doesNotMatch(ui,/\$\('time-zone'\)/);assert.doesNotMatch(html,/<dialog\b|id="calendar-settings"/);
});
test('calendar action uses native file sharing when available and explains user confirmation',()=>{
 const html=fs.readFileSync(path.join(root,'dist/lottery.html'),'utf8'),ui=fs.readFileSync(path.join(root,'dist/lottery-ui.js'),'utf8');
 assert.match(ui,/navigator\.canShare\(\{files:\[file\]\}\)/);assert.match(ui,/navigator\.share\(/);assert.match(ui,/选择日历应用并确认保存/);assert.match(ui,/没有系统日历分享入口/);
 assert.match(html,/id="calendar-open">添加到日历/);
});
test('next six terms excludes current term and crosses New Year',()=>{
 const s=C.nextSix(events,now);assert.equal(s.length,6);assert.equal(s[0].name,'寒露');assert.equal(s[5].name,'冬至');assert.ok(s[5].endDay.startsWith('2027'));assert.ok(s.every((x,i)=>x.time>now&&(!i||x.time===s[i-1].end)));
});
test('exact term instant is current, not future',()=>{const e=events.find(e=>e.year===2026&&e.index===18);assert.equal(C.nextSix(events,e.time)[0].index,19);});
test('data horizon fails closed',()=>assert.throws(()=>C.nextSix(events,events.at(-3).time),/不足/));
test('whole term interval includes supported next-month days',()=>{
 const s=C.nextSix(events,now).find(s=>s.name==='小雪'),f=food('liyang-baixin'),d=C.candidateDays(f,profiles[f.id],s,events);assert.ok(d.length);assert.ok(d.every(x=>x.day.startsWith('2026-12')));
});
test('late-month records do not recommend early February morels',()=>{
 const s=C.nextSix(events,Date.parse('2027-01-25T00:00:00Z')),f=food('jintang-fresh-morel');assert.equal(C.candidateDays(f,profiles[f.id],s[0],events).length,0);const days=C.candidateDays(f,profiles[f.id],s[1],events);assert.ok(days.length);assert.ok(days.every(x=>x.day>='2027-02-21'));
});
test('multi-origin crop cannot borrow another region season',()=>{
 const f=food('foshougua-miao'),s=C.nextSix(events,Date.parse('2027-06-21T00:00:00Z')),ds=s.flatMap(x=>C.candidateDays(f,profiles[f.id],x,events));assert.ok(ds.length);assert.ok(ds.every(x=>x.place==='贵州普定'));
});
test('seed gives repeatable unique results with legal dates',()=>{
 const a=draw();assert.deepEqual(a,draw());const ids=a.filter(s=>s.foodId).map(s=>s.foodId);assert.equal(ids.length,6);assert.equal(new Set(ids).size,ids.length);a.forEach(s=>assert.ok(s.availableDays.includes(s.eatDay)));
});
test('mutated recipes fail closed',()=>{const f=structuredClone(foods[0]);f.ingredients+=' 鸡蛋';assert.equal(C.eligible(f,profiles[f.id],prefs),false);assert.equal(C.eligible(f,undefined,prefs),false);});
test('unknown custom exclusions block and known aliases resolve',()=>{
 assert.throws(()=>draw({prefs:{...prefs,excludeText:'火星果'}}),/未识别/);const r=C.resolveExclusions('龙须菜，鲜芡实',foods);assert.equal(r.unknown.length,0);assert.ok(r.ids.has('foshougua-miao'));assert.ok(r.ids.has('jitoumi'));
});
test('vegan excludes animal additions including eggs, dairy and optional honey',()=>{
 const p={...prefs,avoid:['vegan']};for(const f of foods)if(C.eligible(f,profiles[f.id],p))assert.ok(!profiles[f.id].avoid.some(x=>['egg','milk','honey','meat','seafood'].includes(x)));assert.equal(C.eligible(food('wuding-jinquehua'),profiles['wuding-jinquehua'],p),false);
});
test('seafood restriction includes shrimp accompaniments',()=>assert.equal(C.eligible(food('pucai'),profiles.pucai,{...prefs,avoid:['seafood']}),false));
test('unknown oil ingredients fail closed for peanut exclusion',()=>assert.equal(C.eligible(food('foshougua-miao'),profiles['foshougua-miao'],{...prefs,avoid:['peanut']}),false));
test('excluding all foods leaves honest blanks, even with maximum curiosity',()=>{
 const s=draw({prefs:{...prefs,curiosity:2,excludeText:''},foods:foods.map(f=>({...f,ingredients:f.ingredients+' altered'}))});assert.ok(s.every(x=>!x.foodId));
});
test('locked foods stay fixed during full redraw',()=>{
 const a=draw(),locked={[a[0].key]:a[0].foodId,[a[2].key]:a[2].foodId},b=draw({seed:'different',locked});assert.equal(b[0].foodId,a[0].foodId);assert.equal(b[2].foodId,a[2].foodId);assert.throws(()=>draw({locked:{[a[0].key]:'not-a-food'}}),/锁定/);
});
test('single-slot reroll preserves the other five',()=>{
 const a=draw();for(let k=0;k<6;k++){const locked=Object.fromEntries(a.filter((s,i)=>i!==k&&s.foodId).map(s=>[s.key,s.foodId]));const b=draw({locked,exclude:{[a[k].key]:a[k].foodId},seed:'reroll'});a.forEach((s,i)=>{if(i!==k)assert.equal(b[i].foodId,s.foodId);});assert.notEqual(b[k].foodId,a[k].foodId);}
});
test('matching reserves singleton slots before plentiful slots',()=>{
 const fsyn=[{id:'a',name:'a',recipeTitle:'a',ingredients:'a',steps:['a'],peakMonths:[1,2],placeSeasons:[{name:'x',months:[1,2],source:'https://example.com'}]},{id:'b',name:'b',recipeTitle:'b',ingredients:'b',steps:['b'],peakMonths:[1],placeSeasons:[{name:'x',months:[1],source:'https://example.com'}]}];
 const ps=Object.fromEntries(fsyn.map(f=>[f.id,{signature:C.signature(f),avoid:[],effort:0,family:'fruit'}]));const slots=[{key:'one',startDay:'2027-01-01',endDay:'2027-01-02'},{key:'two',startDay:'2027-02-01',endDay:'2027-02-02'}];const s=C.draw({foods:fsyn,profiles:ps,prefs,events,slots,seed:'b'});assert.equal(s[0].foodId,'b');assert.equal(s[1].foodId,'a');
});
test('12 months x 6 exclusions x 3 curiosity levels preserve restrictions and date windows',()=>{
 for(let m=1;m<=12;m++)for(const avoid of [[],['egg'],['milk'],['soy'],['seafood'],['vegan']])for(const curiosity of [0,1,2]){
 const p={...prefs,avoid,curiosity,cooking:[Object.keys(C.COOKING)[m%Object.keys(C.COOKING).length]]},s=draw({prefs:p,slots:C.nextSix(events,Date.parse(`2027-${String(m).padStart(2,'0')}-01T00:00:00Z`)),seed:'sweep'+m}),ids=s.filter(x=>x.foodId).map(x=>x.foodId);assert.equal(new Set(ids).size,ids.length);for(const x of s.filter(x=>x.foodId)){assert.ok(C.eligible(food(x.foodId),profiles[x.foodId],p));assert.ok(C.matchesPreferences(food(x.foodId),profiles[x.foodId],p));assert.ok(x.eatDay>=x.startDay&&x.eatDay<=x.endDay);assert.ok(x.availableDays.includes(x.eatDay));}}
});
test('time zones include China, Taipei and New York DST',()=>{
 assert.equal(C.stamp(C.zonedTime('2027-01-05','19:00','Asia/Shanghai')),'20270105T110000Z');assert.equal(C.zonedTime('2027-01-05','19:00','Asia/Taipei'),C.zonedTime('2027-01-05','19:00','Asia/Shanghai'));assert.equal(C.stamp(C.zonedTime('2027-07-05','19:00','America/New_York')),'20270705T230000Z');assert.throws(()=>C.zonedTime('2027-03-14','02:30','America/New_York'),/不存在/);
});
test('calendar defaults to online inquiry three days ahead without procurement answers',()=>{
 const rows=C.calendarEvents(makePlan(),foods,{},now);for(const r of rows){assert.equal(r.day,C.addDays(r.eatDay,-3));assert.match(r.title,/询货/);}assert.equal(C.calendarEvents(makePlan(),foods,{lead:1},now)[0].day,C.addDays(rows[0].eatDay,-1));
});
test('ICS: six events and alarms, UTF8 folds <=75 bytes, CRLF, no RRULE',()=>{
 const ics=C.makeICS(makePlan(),foods,{},now);assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,6);assert.equal((ics.match(/BEGIN:VALARM/g)||[]).length,6);assert.ok(!ics.includes('RRULE'));assert.ok(!ics.replaceAll('\r\n','').includes('\n'));for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);const u=ics.replace(/\r\n /g,'');for(const t of ['采购搜索词','到货与保存','注意'])assert.ok(u.includes(t));
});
test('ICS UID survives redraw, SEQUENCE increases, preferences stay private',()=>{
 const p=makePlan(),a=C.makeICS(p,foods,{},now);p.slots=draw({seed:'new'});p.revision++;p.updatedAt+=1000;const b=C.makeICS(p,foods,{},now);assert.deepEqual(a.match(/^UID:.+$/gm),b.match(/^UID:.+$/gm));assert.ok(b.includes('SEQUENCE:1'));for(const key of ['excludeText','curiosity','textures','avoid'])assert.ok(!b.includes('"'+key+'"'));
});
test('ICS supports subsets and rejects dates outside supported windows',()=>{
 const p=makePlan();assert.equal((C.makeICS(p,foods,{included:[p.slots[0].key]},now).match(/BEGIN:VEVENT/g)||[]).length,1);assert.throws(()=>C.makeICS(p,foods,{included:[]},now),/没有勾选/);assert.throws(()=>C.makeICS(p,foods,{eatDays:{[p.slots[0].key]:'2027-08-01'}},now),/范围/);assert.throws(()=>C.makeICS(p,foods,{lead:30},now),/提前/);
});
test('past inquiry reminders move forward; expired eating dates refuse export',()=>{
 const p=makePlan(),one=p.slots[0],opts={included:[one.key]},t=C.zonedTime(one.eatDay,'08:00',C.ZONE),r=C.calendarEvents(p,foods,opts,t)[0];assert.ok(r.start>t);assert.ok(r.late);assert.throws(()=>C.calendarEvents(p,foods,opts,C.zonedTime(C.addDays(one.eatDay,1),'20:00',C.ZONE)),/已过/);
});
test('ICS escapes text injection and folds without splitting emoji',()=>{
 assert.equal(C.escapeText('a,b;c\\d\r\nEND:VEVENT'),'a\\,b\\;c\\\\d\\nEND:VEVENT');const s='DESCRIPTION:'+('青菜🍃'.repeat(30)),out=C.fold(s);assert.equal(out.replace(/\r\n /g,''),s);assert.ok(!Buffer.from(out).toString().includes('\ufffd'));
});
test('invalid new answers are rejected',()=>{
 for(const patch of [{avoid:['unrecognized']},{tastes:['unrecognized']},{textures:['crisp','crisp']},{cooking:['telepathy']},{curiosity:99}])assert.throws(()=>C.validatePrefs({...prefs,...patch}));
});
