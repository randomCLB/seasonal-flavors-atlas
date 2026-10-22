'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Huizhou Chengkan tea shoots are a sourced Qingming-after entry with shared reference photo',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='huizhou-chengkan-qingming-tea-shoot',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.equal(food.category,'vegetable');assert.deepEqual(Array.from(food.peakTerms),[6]);assert.deepEqual(Array.from(food.entryTerms),[6]);
 assert.match(food.season,/清明后/);assert.match(food.description,/12—20厘米/);assert.ok(food.sources.some(x=>x[1]==='https://www.huangshan.gov.cn/zxzx/qxdt/8420472.html'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/通用形态参考/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const term=audit.rows.find(x=>x.term==='清明'),previous=audit.rows.find(x=>x.term==='春分');
 assert.ok(term.foodIds.includes(id));assert.ok(!previous.foodIds.includes(id));assert.equal(term.repeatRate,0.5);assert.equal(term.withinLimit,true);
});
