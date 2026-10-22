'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Qingdao spring mackerel is retained as a dated Qingming fish-market clue, not a recurring supply guarantee',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='qingdao-shazikou-qingming-spring-mackerel',food=ctx.window.FOODS.find(x=>x.id===id),C=require(path.join(root,'dist/lottery-core.js'));
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[6]);assert.deepEqual(Array.from(food.entryTerms),[6]);assert.equal(food.category,'seafood');assert.match(food.season,/2025年4月3日/);assert.match(food.season,/不保证其他年份上市日/);assert.match(food.description,/不推断超出地方商品名的学名/);assert.match(food.safety,/充分加热/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.qingdaonews.com/app/content/2025-04/03/content_23652319.htm'));assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const profile=ctx.window.LOTTERY_PROFILES[id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),qingming=audit.rows.find(x=>x.term==='清明'),spring=audit.rows.find(x=>x.term==='春分');assert.ok(qingming.foodIds.includes(id));assert.ok(!spring.foodIds.includes(id));
});
