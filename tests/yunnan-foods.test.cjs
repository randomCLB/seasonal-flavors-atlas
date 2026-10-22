'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js'),ctx={window:{}};
vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const foods=JSON.parse(JSON.stringify(ctx.window.FOODS)),profiles=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES)),byId=Object.fromEntries(foods.map(f=>[f.id,f]));
const events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES);
const ids=['baoshan-liangcui-emblica','ninger-tongxin-sweet-shoot','yongsheng-fresh-kapok','jianshui-caoya','tonghai-fresh-sour-quince','lancang-nannai-duoyi','longyang-pupiao-allium-root','banna-banana-blossom','ximeng-bamboo-worm'];
const pool=(day,avoid=[])=>T.pool({foods,profiles,events,now:Date.parse(day+'T04:00:00Z'),avoid}).map(x=>x.food.id);
test('nine approved Yunnan entries join the catalog, with tree tomato excluded',()=>{
 assert.equal(new Set(foods.map(f=>f.id)).size,foods.length);
 for(const id of ids){const f=byId[id];assert.ok(f&&f.region.startsWith('云南'),id);assert.ok(f.steps.length>=3&&f.buy&&f.storage&&f.safety&&f.sources.length>=2,id);assert.equal(C.signature(f),profiles[id].signature,id);assert.equal(C.sensorySignature(f),profiles[id].senses.signature,id);}
 assert.ok(!foods.some(f=>/树番茄/.test([f.name,...f.alias].join(' '))));
});
test('single-month harvest reports are not expanded to year-round supply',()=>{
 for(const [id,month] of [['ninger-tongxin-sweet-shoot',5],['yongsheng-fresh-kapok',3],['tonghai-fresh-sour-quince',6],['lancang-nannai-duoyi',10],['longyang-pupiao-allium-root',9]]){
  assert.deepEqual(byId[id].peakMonths,[month],id);
  for(let m=1;m<=12;m++)assert.equal(pool(`2027-${String(m).padStart(2,'0')}-15`).includes(id),m===month,id);
 }
});
test('late emblica and bamboo worms respect their reviewed approximate boundaries',()=>{
 for(const [id,start,end] of [['baoshan-liangcui-emblica','2027-12-11','2027-12-31'],['ximeng-bamboo-worm','2027-09-15','2027-10-31']]){
  for(const day of [start,end])assert.ok(pool(day).includes(id),`${id}: ${day}`);
  for(const day of [C.addDays(start,-1),C.addDays(end,1)])assert.ok(!pool(day).includes(id),`${id}: ${day}`);
 }
});
test('banana blossom remains searchable and mapped without inventing harvest months or entering draws',()=>{
 const f=byId['banna-banana-blossom'];assert.ok(f.alias.includes('芭蕉花'));assert.ok(f.placeSeasons.length);assert.deepEqual(f.months,[]);assert.deepEqual(f.peakMonths,[]);assert.deepEqual(f.placeSeasons[0].months,[]);assert.equal(f.seasonPrecision,'plant-stage');assert.ok(profiles[f.id].disabled);assert.match(f.seasonLabel,/待核/);
 for(let m=1;m<=12;m++)assert.ok(!pool(`2027-${String(m).padStart(2,'0')}-15`).includes(f.id));
});
test('animal additions, fermented beans and insect sensitivity participate in exclusions',()=>{
 for(const [id,avoid] of [['ninger-tongxin-sweet-shoot','vegan'],['jianshui-caoya','meat'],['tonghai-fresh-sour-quince','meat'],['longyang-pupiao-allium-root','meat'],['yongsheng-fresh-kapok','soy'],['yongsheng-fresh-kapok','wheat'],['ximeng-bamboo-worm','vegan'],['ximeng-bamboo-worm','seafood']])assert.equal(C.eligible(byId[id],profiles[id],T.preferences([avoid])),false,`${id}: ${avoid}`);
 for(const id of ['baoshan-liangcui-emblica','lancang-nannai-duoyi'])assert.ok(C.eligible(byId[id],profiles[id],T.preferences(['vegan'])));
});
test('new serving artwork exists, remains labeled generated, and cooked sour quince is not presented as fresh eating',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/yunnan-additions-20261015/image-manifest.json'),'utf8'));assert.equal(manifest.length,9);
 for(const id of ids){const f=byId[id],m=T.mediaFor(f);assert.ok(m,id);assert.ok(fs.statSync(path.join(root,'dist',m.src)).size>1000,id);assert.match(m.alt,/生成示意图/);assert.match(T.imageNote(f),/生成示意图.*非实物摄影/);assert.ok(manifest.some(row=>row.key===id&&row.sha256&&row.prompt&&row.refs.length),id);}
 const f=byId['tonghai-fresh-sour-quince'];assert.ok(f.dishImage);assert.equal(f.cutImage,undefined);assert.equal(f.tarotImage,undefined);assert.match(f.imageAlt,/炖鸡/);
});
