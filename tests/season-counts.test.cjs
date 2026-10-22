'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../dist/lottery-core.js'),root=path.join(__dirname,'../dist');
const runtimeData=new Set(['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','editorial-copy','photo-review','season-features','season-selection']);
const categoryOf=food=>({seafood:'protein',nuts:'seed'}[food.category]||food.category);
function fixture(now='2026-10-22T04:00:00Z'){
 const nodes=new Map(),document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,{style:{},classList:{toggle(){}},querySelectorAll:()=>[]});return nodes.get(id)},querySelectorAll:()=>[]};
 class Clock extends Date{constructor(...args){super(...(args.length?args:[now]))}static now(){return Date.parse(now)}}
 const ctx={window:{FengwuLottery:C},document,Date:Clock};vm.createContext(ctx);
 // Read the real entrypoint so a newly added catalog layer cannot silently be
 // omitted from the regression fixture, as happened with the old three-category fixture.
 const scripts=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script\b[^>]*\bsrc="([^"?]+)(?:\?[^" ]*)?"/g)].map(m=>m[1].replace(/\.js$/,''));
 const loaded=scripts.filter(name=>runtimeData.has(name));
 assert.deepEqual(new Set(loaded),runtimeData,'the fixture includes every production catalog and editorial layer');
 for(const name of loaded)vm.runInContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'),ctx);
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
 vm.runInContext(app.slice(0,app.indexOf('function renderTermRail')),ctx);
 vm.runInContext(app.slice(app.indexOf('function renderCategoryFilter'),app.indexOf("$('termPrev').onclick")),ctx);
 return {ctx,nodes};
}
function counts(nodes){return Object.fromEntries([...nodes.get('categoryFilter').innerHTML.matchAll(/data-category="([^"]+)"[^>]*>[^<]*<span>(\d+)<\/span>/g)].map(m=>[m[1],Number(m[2])]))}
function cardIds(nodes){return [...nodes.get('seasonCards').innerHTML.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(m=>m[0].match(/data-food="([^"]+)"/)?.[1])}
function heroId(nodes){return nodes.get('hero').innerHTML.match(/data-food="([^"]+)"/)?.[1]}

test('the full live catalog has a readable category and every displayed category contributes to the total',()=>{
 const {ctx,nodes}=fixture(),foods=ctx.window.FOODS;
 vm.runInContext('renderSeason()',ctx);
 const labels=vm.runInContext('categoryNames',ctx),totals=counts(nodes);
 for(const food of foods){
  assert.ok(labels[categoryOf(food)],`${food.id}: ${food.category} needs a visible category`);
  assert.equal(vm.runInContext(`foodCategory(byId[${JSON.stringify(food.id)}])`,ctx),categoryOf(food));
 }
 assert.equal(totals.all,Object.entries(totals).filter(([key])=>key!=='all').reduce((sum,[,n])=>sum+n,0));
 assert.equal(totals.all,cardIds(nodes).length);
 assert.ok(totals.protein>0,'seafood is reachable through the water-and-meat filter');
 assert.ok(totals.flower>0,'October edible flowers are not orphaned in the catalog');
});

test('all 24 terms keep strict category filters, truthful empty states and a separate seasonal hero',()=>{
 const {ctx,nodes}=fixture(),byId=Object.fromEntries(ctx.window.FOODS.map(food=>[food.id,food]));
 const events=vm.runInContext('termWindow',ctx),allEvents=vm.runInContext('termEvents',ctx),heroes=[];
 assert.equal(events.length,24);
 for(let index=0;index<events.length;index++){
  vm.runInContext(`selectedTerm=termWindow[${index}];selectedCategory='all';renderSeason()`,ctx);
  const totals=counts(nodes),allIds=cardIds(nodes),hero=heroId(nodes),label=ctx.window.SOLAR_TERM_NAMES[events[index].index];
  assert.ok(allIds.length,`${label}: a live seasonal selection is available`);
  assert.equal(totals.all,allIds.length,label);
  assert.equal(totals.all,Object.entries(totals).filter(([key])=>key!=='all').reduce((sum,[,n])=>sum+n,0),label);
  assert.equal(new Set(allIds).size,allIds.length,`${label}: no duplicate ingredient cards`);
  const families=allIds.map(id=>ctx.window.SeasonSelection.group(byId[id]));
  assert.equal(new Set(families).size,families.length,`${label}: each selected family has one representative`);
  assert.ok(hero&&allIds.includes(hero),`${label}: the hero belongs to its sourced seasonal selection`);
  assert.equal(hero,ctx.window.SEASON_FEATURES[events[index].index].foodId,`${label}: the displayed hero is the configured editorial selection`);
  const next=allEvents[allEvents.findIndex(event=>event.time===events[index].time)+1];
  const firstDay=C.dayAt(events[index].time),lastDay=C.addDays(C.dayAt(next.time),-1);
  let sourcedDay=false;
  for(let day=firstDay;day<=lastDay;day=C.addDays(day,1))if(C.isPeakDay(byId[hero],day,allEvents)){sourcedDay=true;break;}
  assert.ok(sourcedDay,`${label}/${hero}: the independent date engine supports at least one day in this term`);
  heroes.push(hero);
  for(const category of Object.keys(totals)){
   vm.runInContext(`selectedCategory=${JSON.stringify(category)};renderSeason()`,ctx);
   const visible=cardIds(nodes),expected=category==='all'?allIds:allIds.filter(id=>categoryOf(byId[id])===category);
   assert.deepEqual(visible,expected,`${label}/${category}: filtering does not inject an unrelated hero`);
   assert.deepEqual(counts(nodes),totals,`${label}/${category}: counts describe the unchanged seasonal pool`);
   assert.equal(heroId(nodes),hero,`${label}/${category}: the independent hero remains seasonal`);
   assert.ok(nodes.get('seasonHeading').textContent.includes(`${visible.length} 味`),`${label}/${category}: heading matches the cards`);
   if(!visible.length){
    assert.match(nodes.get('seasonCards').innerHTML,/empty|暂无|没有|留白/,`${label}/${category}: the empty category explains its state`);
    assert.match(nodes.get('seasonIntro').textContent,/暂无|没有|留白/,`${label}/${category}: the introduction does not advertise unrelated foods`);
    nodes.get('showAllSeasonFoods').onclick();
    assert.deepEqual(cardIds(nodes),allIds,`${label}/${category}: the empty-state action restores the seasonal list`);
   }
  }
 }
 assert.equal(new Set(heroes).size,24,'the curated annual heroes are all distinct');
});

test('January keeps the autumn-to-autumn year cycle and selects the current winter term',()=>{
 const {ctx,nodes}=fixture('2027-01-16T04:00:00Z');
 vm.runInContext('renderSeason()',ctx);
 const selected=vm.runInContext('selectedTerm',ctx),events=vm.runInContext('termWindow',ctx);
 assert.equal(selected.year,2027);
 assert.equal(selected.index,0);
 assert.equal(events[0].year,2026);
 assert.equal(events[0].index,17);
 assert.ok(cardIds(nodes).includes(heroId(nodes)));
 assert.equal(counts(nodes).all,cardIds(nodes).length);
});

test('unfinished fishery identities remain in the searchable catalog but are absent from every seasonal selection',()=>{
 const {ctx}=fixture(),heldIds=Object.keys(ctx.window.SeasonSelection.holds),catalogIds=new Set(ctx.window.FOODS.map(food=>food.id));
 for(const id of ['suao-jingzhe-huahui','suao-jingzhe-muhou','suao-jingzhe-dingmian','keelung-jingzhe-jiaranyu','keelung-jingzhe-wenyu'])assert.ok(heldIds.includes(id),`${id}: the known unresolved name has an editorial hold`);
 const displayed=new Set(vm.runInContext('termWindow.flatMap(event=>seasonFoodsFor(event).map(food=>food.id))',ctx));
 for(const id of heldIds){
  assert.ok(catalogIds.has(id),`${id}: source records remain searchable`);
  assert.ok(!displayed.has(id),`${id}: an unresolved identity is not advertised as an edited seasonal choice`);
 }
});

test('every ingredient detail renders complete doneness, pitfall and pairing guidance without changing recipe evidence',()=>{
 const {ctx}=fixture();
 ctx.window.FoodPurchase=require('../dist/food-purchase.js');
 ctx.document.addEventListener=()=>{};ctx.window.addEventListener=()=>{};
 for(const name of ['food-records','food-detail'])vm.runInContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'),ctx);
 const paragraphs=[
  ['finish',/<p><strong>做到什么程度<\/strong>\s*·\s*([\s\S]*?)<\/p>/],
  ['pitfall',/<p><strong>最容易失手<\/strong>\s*·\s*([\s\S]*?)<\/p>/],
  ['pair',/<p class="pair-note">搭配的用意\s*·\s*([\s\S]*?)<\/p>/]
 ];
 for(const food of ctx.window.FOODS){
  const before=C.signature(food);
  const html=ctx.window.FoodDetail.html(food,{
   recognition:{src:'',alt:'',note:'',fit:'contain'},
   seasonLabel:food.seasonLabel||'',category:vm.runInContext(`foodCategoryLabel(byId[${JSON.stringify(food.id)}])`,ctx),
   originHtml:'',similar:[],imageAttrs:''
  });
  assert.doesNotMatch(html,/\b(?:undefined|NaN)\b/,`${food.id}: no missing values leak into the reader`);
  for(const [field,pattern] of paragraphs){
   const text=html.match(pattern)?.[1]?.replace(/<[^>]*>/g,'').replace(/&(?:nbsp|#160);/g,' ').trim();
   assert.ok(text,`${food.id}: the rendered ${field} paragraph contains actual guidance`);
  }
  assert.equal(C.signature(food),before,`${food.id}: reader additions do not mutate recipe evidence`);
 }
});
