'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Haojiang winter foods use sourced term windows, clear image notes and current lottery signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js');
 for(const [id,source] of [
  ['shantou-donghu-charcoal-zicai','https://www.haojiang.gov.cn/sthjwgltj/gkmlpt/content/2/2398/post_2398856.html'],
  ['shantou-haojiang-liqian-dongjingwan','https://www.haojiang.gov.cn/sthjwgltj/gkmlpt/content/2/2398/post_2398856.html']
 ]){
  const f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];assert.ok(f);assert.ok(f.sources.some(s=>s[1]===source));
  assert.ok(f.procurement.checks.length>=2);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
  assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 }
 const seaweed=ctx.window.FOODS.find(x=>x.id==='shantou-donghu-charcoal-zicai'),pearls=ctx.window.FOODS.find(x=>x.id==='shantou-haojiang-liqian-dongjingwan');
 assert.deepEqual(Array.from(seaweed.peakTerms),[23,0,1]);assert.match(seaweed.imageCaption,/不作东湖/);assert.match(seaweed.season,/冬至前后至次年立春/);
 assert.deepEqual(Array.from(pearls.peakTerms),[23]);assert.match(pearls.description,/不等于木薯珍珠或西米/);assert.match(pearls.imageCaption,/生成示意/);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const solstice=audit.rows.find(x=>x.term==='冬至');assert.equal(solstice.count,38);assert.equal(solstice.repeated,19);assert.equal(solstice.repeatRate,0.5);assert.ok(solstice.foodIds.includes(seaweed.id));assert.ok(solstice.foodIds.includes(pearls.id));
});
