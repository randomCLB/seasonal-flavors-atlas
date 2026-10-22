'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Pingdu Majiagou celery has a sourced start-of-Lidong harvest note and lowers only Lidong overlap',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='pingdu-majiagou-celery',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[20]);assert.deepEqual(Array.from(food.entryTerms),[20]);assert.equal(food.seasonBasis,'harvest');assert.match(food.season,/每年立冬前后开始/);assert.match(food.description,/窖藏/);assert.match(food.pitfall,/不自动证明产地/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.dailyqd.com/guanhai/418761_1.html'));assert.ok(food.sources.some(x=>x[1]==='https://www.qingdaonews.com/app/content/2023-11/03/content_23506368.htm'));assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非实物摄影/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),lidong=audit.rows.find(x=>x.term==='立冬'),frost=audit.rows.find(x=>x.term==='霜降');
 assert.ok(lidong.foodIds.includes(id));assert.ok(!frost.foodIds.includes(id));
 ;
});
