'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Baomiao blood orange is a Great Cold best-taste entry, not a claimed one-term harvest season',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='zigong-baomiao-blood-orange',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[1]);assert.deepEqual(Array.from(food.entryTerms),[1]);
 assert.match(food.season,/大寒.*最佳品尝时期/);assert.match(food.season,/1—3 月/);assert.ok(food.sources.some(x=>x[1]==='https://www.zgm.cn/content/65b8d1fdc23cc'));
 assert.match(food.imageCaption,/不用于白庙血橙品种/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const majorCold=audit.rows.find(x=>x.term==='大寒'),minorCold=audit.rows.find(x=>x.term==='小寒');
 assert.ok(majorCold.foodIds.includes(id));assert.ok(!minorCold.foodIds.includes(id));
 ;
});
