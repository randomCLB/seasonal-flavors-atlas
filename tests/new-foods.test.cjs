'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js'),ctx={window:{FengwuLottery:C}};
vm.createContext(ctx);
for(const n of ['solar-terms','data','editorial','editorial-notes','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8'),ctx);
const foods=JSON.parse(JSON.stringify(ctx.window.FOODS)),profiles=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES)),events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES);
const additions=foods.filter(f=>f.peakWindows),byId=Object.fromEntries(additions.map(f=>[f.id,f]));
test('seven additions are unique, complete, local illustrated and separately sourced',()=>{
 assert.equal(additions.length,7);assert.equal(new Set(foods.map(f=>f.id)).size,67);
 for(const f of additions){
  const p=profiles[f.id];assert.equal(C.signature(f),p.signature,f.id);assert.equal(C.sensorySignature(f),p.senses.signature,f.id);
  assert.ok(f.sources.length>=1&&f.placeSeasons.every(p=>p.source&&p.precision==='approximate-window'));
  assert.ok(f.steps.length>=3&&f.steps.length<=5&&f.ingredients&&f.finish&&f.pitfall&&f.buy&&f.storage&&f.safety);
  for(const src of [f.image,f.dishImage||f.cutImage]){assert.ok(src.startsWith('assets/'));assert.ok(fs.statSync(path.join(root,'dist',src)).size>1000,src);}
  assert.ok(T.mediaFor(f));assert.ok(p.senses.tastes.length&&p.senses.textures.length&&p.senses.cooking.length);
 }
});
test('all new date windows include boundaries and exclude days just outside, including year rollover',()=>{
 for(const f of additions){const [a,b]=f.peakWindows[0],start=`2027-${a}`,end=`${a>b?2028:2027}-${b}`;
  assert.equal(C.isPeakDay(f,start),true,f.id);assert.equal(C.isPeakDay(f,end),true,f.id);
  assert.equal(C.isPeakDay(f,C.addDays(start,-1)),false,f.id);assert.equal(C.isPeakDay(f,C.addDays(end,1)),false,f.id);
 }
});
test('tarot and six-term scheduling honor the same eating window rather than supply months',()=>{
 for(const f of additions){const [a,b]=f.peakWindows[0];for(const day of [`2027-${a}`,`2027-${b}`,C.addDays(`2027-${a}`,-1),C.addDays(`2027-${b}`,1)]){
  const slot={startDay:day,endDay:day},days=C.candidateDays(f,profiles[f.id],slot,events),pool=T.pool({foods:[f],profiles,events,now:Date.parse(day+'T04:00:00Z')});
  assert.equal(pool.length,days.length,`${f.id}/${day}`);if(days.length)assert.ok(C.isPeakDay(f,day));
 }}
 assert.equal(T.pool({foods:[byId['minqin-field-shacong']],profiles,events,now:Date.parse('2027-02-15T04:00:00Z')}).length,0);
 assert.equal(T.pool({foods:[byId['yanshi-fresh-yintiao']],profiles,events,now:Date.parse('2027-11-15T04:00:00Z')}).length,0);
});
test('new recipes respect fish, wheat, egg and sesame exclusions and match declared preferences',()=>{
 for(const [id,avoid] of [['jiaozhou-kailing-suo','seafood'],['shanzhou-green-wheat-nianzhuan','wheat'],['shanzhou-green-wheat-nianzhuan','egg'],['minqin-field-shacong','egg'],['yanshi-fresh-yintiao','sesame']])assert.equal(C.eligible(byId[id],profiles[id],T.preferences([avoid])),false,id);
 for(const id of ['taitung-winter-atemoya','shangyu-duanbing-cherry','harbin-fresh-honeyberry']){const f=byId[id],p=profiles[id];assert.ok(C.eligible(f,p,T.preferences(['vegan','milk','egg'])));assert.ok(C.matchesPreferences(f,p,{tastes:['sour'],textures:['juicy'],cooking:['fresh']}));assert.equal(C.matchesPreferences(f,p,{tastes:['umami'],textures:[],cooking:[]}),false);}
 assert.ok(C.matchesPreferences(byId['jiaozhou-kailing-suo'],profiles['jiaozhou-kailing-suo'],{tastes:['umami'],textures:['tender'],cooking:['steam']}));
});
test('home uses full solar-term intervals for late-April cherries and cross-year silver stems',()=>{
 const app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8');vm.runInContext(app.slice(0,app.indexOf('function renderTermRail')),ctx);
 const ids=(year,index,month)=>vm.runInContext(`rankSeasonFoods(${month},termEvents.find(e=>e.year===${year}&&e.index===${index})).map(f=>f.id)`,ctx);
 assert.ok(ids(2027,7,4).includes('shangyu-duanbing-cherry'));
 assert.ok(!ids(2027,5,3).includes('shangyu-duanbing-cherry'));
 assert.ok(ids(2027,0,1).includes('yanshi-fresh-yintiao'));
 assert.ok(!ids(2027,21,11).includes('yanshi-fresh-yintiao'));
 assert.ok(ids(2027,9,5).includes('shanzhou-green-wheat-nianzhuan'));
});
