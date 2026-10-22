'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Zizhong early blood orange is a sourced Xiaohan harvest entry with variety and image limits',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='zizhong-xiaohan-early-blood-orange',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js');assert.ok(food);assert.deepEqual(Array.from(food.entryTerms),[0]);assert.deepEqual(Array.from(food.peakTerms),[0]);assert.equal(food.seasonPrecision,'recurring-local-window');assert.equal(food.sources.length,5);assert.ok(food.sources.some(x=>x[1]==='https://www.zizhongxuecheng.com/product.html'));assert.match(food.season,/不确认2027年/);assert.match(food.pitfall,/不同熟期品种/);assert.match(food.comparison.text,/塔罗科新系/);assert.match(food.imageCaption,/不用于资中产地/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[id].signature,C.signature(food));assert.equal(ctx.window.LOTTERY_PROFILES[id].senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),row=audit.rows.find(x=>x.term==='小寒');assert.ok(row.foodIds.includes(id));assert.equal(row.repeatRate,row.repeated/row.count);assert.equal(row.requiredAdditionalFoodsNotInPreviousTerm,Math.max(0,2*row.repeated-row.count));
});
