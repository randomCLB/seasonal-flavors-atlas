'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js');
test('Rongxian pomelo and Weixian radish are sourced Frostfall entries and bring that list to the 50% limit',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const frost=audit.rows.find(x=>x.term==='霜降'),hanlu=audit.rows.find(x=>x.term==='寒露');
 for(const [id,source] of [['rongxian-shatian-pomelo','https://e.weather.com.cn/news/2024/10/3932437.shtml'],['weixian-frost-radish','https://e.weather.com.cn/news/2024/10/3932437.shtml']]){
  const food=ctx.window.FOODS.find(x=>x.id===id),profile=ctx.window.LOTTERY_PROFILES[id];
  assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[19]);assert.deepEqual(Array.from(food.entryTerms),[19]);assert.ok(food.sources.some(x=>x[1]===source));
  assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非实物摄影/);
  assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
  assert.ok(frost.foodIds.includes(id));assert.ok(!hanlu.foodIds.includes(id));
 }
 ;assert.equal(frost.withinLimit,true);
});
