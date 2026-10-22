'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js'),ctx={window:{}};
vm.createContext(ctx);for(const n of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8'),ctx);
const foods=JSON.parse(JSON.stringify(ctx.window.FOODS)),profiles=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES)),events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES);
test('spring-equinox and Qingming additions match reviewed sources, images and tarot signatures',()=>{
 for(const [id,date,previousDate,termIndex] of [['baojing-huangjincha-spring-equinox-bulk','2027-03-21','2027-03-10',5],['enping-qingming-lecai-tender-shoots','2027-04-07','2027-03-30',6],['fushun-niuyake-greenhouse-dahan','2027-01-25','2027-01-10',1]]){
  const f=foods.find(x=>x.id===id),p=profiles[id];assert.ok(f);assert.ok(f.sources.length>=2);assert.ok(f.placeSeasons.length&&f.placeSeasons[0].source);assert.ok(f.steps.length>=3&&f.ingredients&&f.finish&&f.safety);assert.equal(C.signature(f),p.signature,id);assert.equal(C.sensorySignature(f),p.senses.signature,id);
  assert.ok(fs.statSync(path.join(root,'dist',f.image)).size>1000);assert.match(f.imageAlt,/(非.*(实拍|鉴别)|不是.*(实拍|鉴定))/);assert.equal(f.peakTerms.length,1);assert.equal(f.peakTerms[0],termIndex);
  assert.equal(T.pool({foods:[f],profiles,events,now:Date.parse(date+'T04:00:00Z')}).length,1,id);
  assert.equal(T.pool({foods:[f],profiles,events,now:Date.parse(previousDate+'T04:00:00Z')}).length,0,id);
 }
});
test('fixed 2026 audit now meets the 50 percent cap for Spring Equinox and Qingming',()=>{
 const audit=JSON.parse(fs.readFileSync(path.join(root,'docs/term-repeat-audit-20261019/current-audit-20261021-post-additions.json'),'utf8'));
 for(const term of ['春分','清明']){const row=audit.rows.find(x=>x.term===term);assert.equal(row.withinLimit,true,term);assert.ok(row.repeatRate<=0.5,term);}
});
