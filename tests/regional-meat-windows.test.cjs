'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js'),{load}=require('../scripts/audit-reader-copy.cjs');
const W=load(),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),ctx={window:W};vm.createContext(ctx);for(const name of ['lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',name+'.js'),'utf8'),ctx);const events=C.eventsFrom(W.SOLAR_TERM_TIMES,W.SOLAR_TERM_NAMES);
test('regional meat records distinguish local customs from a short fresh harvest and honor dietary exclusions',()=>{
 const cases=[['xuzhou-sanfu-lamb','cultural-practice',[13],'2027-07-25','2027-06-25'],['suzhou-chushu-old-duck','cultural-practice',[15],'2027-08-25','2027-08-10'],['gaoqing-taisun-jinchan','harvest',[12],'2027-07-10','2027-08-10']];
 for(const [id,basis,terms,inDate,outDate] of cases){
  const f=W.FOODS.find(x=>x.id===id),p=W.LOTTERY_PROFILES[id];
  assert.ok(f,id);assert.equal(f.category,'protein');assert.equal(f.seasonBasis,basis);assert.deepEqual(Array.from(f.peakTerms),terms);assert.ok(f.sources.length);assert.ok(f.placeSeasons[0].source);assert.ok(f.steps.length>=3&&f.ingredients&&f.finish&&f.safety);assert.equal(C.signature(f),p.signature,id);assert.equal(C.sensorySignature(f),p.senses.signature,id);assert.ok(p.avoid.includes('meat'));assert.ok(p.senses.cooking.every(x=>Object.hasOwn(C.COOKING,x)));
  assert.equal(T.pool({foods:[f],profiles:W.LOTTERY_PROFILES,events,now:Date.parse(inDate+'T04:00:00Z')}).length,1,id);
  assert.equal(T.pool({foods:[f],profiles:W.LOTTERY_PROFILES,events,now:Date.parse(outDate+'T04:00:00Z')}).length,0,id);
 }
 assert.match(W.FOODS.find(x=>x.id==='xuzhou-sanfu-lamb').season,/不表示羊肉只有夏天出产/);
 assert.match(W.FOODS.find(x=>x.id==='suzhou-chushu-old-duck').season,/不把处暑当作其唯一出栏季/);
 const cicada=W.FOODS.find(x=>x.id==='gaoqing-taisun-jinchan');assert.match(cicada.region,/高青县台孙村/);assert.match(cicada.season,/冷冻货/);assert.match(cicada.safety,/过敏/);assert.ok(cicada.sources[0][1].startsWith('https://ny.zibo.gov.cn/'));
});
