'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const {load}=require('../scripts/audit-reader-access.cjs'),C=require('../dist/lottery-core.js');
test('all admitted ingredients have sourced reading and every term has a distinct representative',()=>{
 const c=load(),W=c.window,N=W.FieldNotes,foods=vm.runInContext('canonicalCatalog',c),before=JSON.stringify(W.FOODS);
 assert.equal(foods.length,287);assert.equal(Object.keys(N.stories).length,24);
 assert.deepEqual([...Object.values(N.stories).map(n=>n.term)].sort((a,b)=>a-b),Array.from({length:24},(_,i)=>i));
 for(const food of foods){const n=N.entry(food);assert.ok(n.lead,food.id+' lead');assert.ok(n.season,food.id+' season');assert.ok(n.sources.length,food.id+' sources');}
 for(const [id,note]of Object.entries(N.stories)){
  const food=foods.find(f=>f.id===id);assert.ok(food,id+' is public');assert.ok(note.lead.length>=80,id+' has substantive prose');
  assert.ok(W.SEASON_FEATURES[note.term].readings.includes(id),id+' has a term entry');
  assert.ok(note.season&&note.place&&note.kitchen&&note.imageCue,id+' has complete editorial guidance');
 }
 for(const feature of Object.values(W.SEASON_FEATURES))for(const id of feature.readings)assert.ok(foods.some(f=>f.id===W.IngredientIdentity.key(id)),id+' is reachable');
 assert.equal(JSON.stringify(W.FOODS),before,'reading does not mutate source records');
});
test('merged map identities retain each source location and independent seasonal evidence',()=>{
 const W=load().window,I=W.IngredientIdentity,N=W.FieldNotes,records=I.members('donghai-dongzhi-cuttlefish');
 const east=records.find(f=>f.id==='donghai-dongzhi-cuttlefish'),taiwan=records.find(f=>f.id==='taiwan-lichiu-kaohsiung-squid');
 assert.ok(east&&taiwan);const entry=I.present(taiwan),note=N.entry(entry,taiwan.placeSeasons[0]);
 assert.equal(note.id,taiwan.id);assert.doesNotMatch(note.season,/浙江|十二月至春节/);assert.match(N.entry(east).season,/浙江/);
 const byRegion=N.mapHtml(entry,taiwan.placeSeasons[0]);assert.doesNotMatch(byRegion,/浙江/);
});
test('promoted reading keeps dated facts and removes internal drafting boilerplate',()=>{
 const W=load().window,N=W.FieldNotes;
 for(const raw of W.FOODS){const n=N.entry(raw);for(const key of ['lead','season','kitchen'])assert.doesNotMatch(n[key],/本站|这里是资料整理|官方资料描述|第一次试 · 2 人份/,raw.id+' '+key);}
 const f=W.FOODS.find(f=>f.id==='huangpi-luzui-water-chestnut');assert.match(N.entry(f).season,/2024/);assert.match(N.entry(f).season,/陆咀/);
});
test('saved foods use China dates, cross the year boundary and keep historical qualifiers',()=>{
 const W=load().window,N=W.FieldNotes,f=W.FOODS.find(f=>f.id==='helan-luosicai');
 assert.match(N.nextWindow(f,Date.parse('2026-11-01T00:00:00Z')),/2026年11月/);
 assert.match(N.nextWindow(f,Date.parse('2026-12-01T00:00:00Z')),/2027年11月/);
 assert.match(N.nextWindow(f,Date.parse('2026-12-01T00:00:00Z')),/2023年/);
 assert.match(N.nextWindow(f,Date.parse('2026-10-31T17:00:00Z')),/2026年11月/);
});
test('editorial notes preserve draw signatures and distinguish illustrative pictures',()=>{
 const W=load().window,N=W.FieldNotes,palm=W.FOODS.find(f=>f.id==='tengchong-late-winter-palm-bud'),before=C.signature(palm),image=W.FoodMedia.ingredient(palm);
 assert.match(N.caption(palm,image),/生成示意/);assert.match(N.caption(palm,image),/金黄花穗/);
 assert.match(N.leadHtml(palm),/腌菜汤/);assert.match(N.leadHtml(palm),/https:\/\/www.edehong.com/);assert.equal(C.signature(palm),before);
 assert.equal(N.caption(palm,{src:'different.webp',note:'菜品实拍'}),'菜品实拍');
 const fixture={id:'fixture',intro:'<script>test</script>',name:'测试',short:'说明',sources:[]};
 assert.doesNotMatch(N.leadHtml(fixture),/<script>/);assert.match(N.leadHtml(fixture),/&lt;script&gt;/);
});
