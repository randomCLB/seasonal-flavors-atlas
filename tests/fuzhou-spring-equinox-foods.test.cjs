'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Fuzhou spring-equinox foods have local sources, matched images and current-term-only entries',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js');
 for(const [id,source] of [
  ['fuzhou-chunfen-baili-fish','https://www.fuzhou.gov.cn/zgfzzt/zjrc/mdfc/msfq/202512/t20251205_5240958.htm'],
  ['fuzhou-chunfen-chunbihhao','https://m.fznews.com.cn/fzyw/20260320/2fsIF4B7RP.shtml']
 ]){
  const f=ctx.window.FOODS.find(x=>x.id===id),profile=ctx.window.LOTTERY_PROFILES[id];
  assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[5]);assert.deepEqual(Array.from(f.entryTerms),[5]);
  assert.ok(f.sources.some(x=>x[1]===source));assert.equal(f.image,f.cardImage);assert.equal(f.image,f.tarotImage.src);
  assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(profile.signature,C.signature(f));assert.equal(profile.senses.signature,C.sensorySignature(f));
 }
 const fish=ctx.window.FOODS.find(x=>x.id==='fuzhou-chunfen-baili-fish'),greens=ctx.window.FOODS.find(x=>x.id==='fuzhou-chunfen-chunbihhao');
 assert.match(fish.season,/白鱱（lǐ）/);assert.match(fish.comparison.text,/并未说两者是同一种鱼/);
 assert.match(greens.season,/春分日采野苋菜做春汤/);assert.match(greens.safety,/身份确认/);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const spring=audit.rows.find(x=>x.term==='春分');
 assert.equal(spring.count,38);assert.equal(spring.repeated,19);assert.equal(spring.repeatRate,0.5);
 assert.ok(spring.foodIds.includes(fish.id));assert.ok(spring.foodIds.includes(greens.id));
 assert.doesNotMatch(fs.readFileSync(path.join(root,'dist','credits.html'),'utf8'),/Amaranthus blitum.*福州实拍/);
});
