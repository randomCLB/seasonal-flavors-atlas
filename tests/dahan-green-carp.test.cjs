'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('Dahan black carp is sourced to the term list with provenance caveats and is exclusive to Dahan',()=>{
 const id='dahan-green-carp',food=ctx.window.FOODS.find(x=>x.id===id);assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[1]);assert.match(food.season,/不代表.*2027年供货/);assert.match(food.taste,/本站未试吃/);assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.ok(food.sources.some(x=>x[1]==='https://www.ciae.com.cn/detail/zh/40113.html'));
 const profile=ctx.window.LOTTERY_PROFILES[id];assert.ok(profile);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),dahan=audit.rows.find(x=>x.term==='大寒'),xiaohan=audit.rows.find(x=>x.term==='小寒');assert.ok(dahan.foodIds.includes(id));assert.ok(!xiaohan.foodIds.includes(id));;
});
