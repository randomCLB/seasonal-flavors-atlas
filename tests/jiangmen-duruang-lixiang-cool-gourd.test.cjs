'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Du Ruan bitter melon is a sourced recurring Lixia tasting point',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='jiangmen-duruang-lixiang-cool-gourd',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js');assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[8]);assert.deepEqual(Array.from(food.entryTerms),[8]);assert.equal(food.seasonPrecision,'recurring-local-best-taste-window');assert.equal(food.sources.filter(x=>/杜阮凉瓜/.test(x[0])).length,3);assert.match(food.description,/先苦后甜/);assert.match(food.comparison.text,/体形肥大/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非杜阮实拍/);assert.equal(ctx.window.LOTTERY_PROFILES[id].signature,C.signature(food));assert.equal(ctx.window.LOTTERY_PROFILES[id].senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),row=audit.rows.find(x=>x.term==='立夏');assert.ok(row.foodIds.includes(id));assert.equal(row.count,26);assert.equal(row.repeated,13);assert.equal(row.repeatRate,13/26);assert.equal(row.withinLimit,true);
});
