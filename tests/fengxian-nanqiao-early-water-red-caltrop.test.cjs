'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Fengxian early water-red-caltrop stays a sourced Lichiu first-harvest entry',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='fengxian-nanqiao-early-water-red-caltrop',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js');assert.ok(food);assert.deepEqual(Array.from(food.entryTerms),[14]);assert.deepEqual(Array.from(food.peakTerms),[14]);assert.equal(food.seasonPrecision,'single-year-harvest-record');assert.match(food.season,/2025年8月7日/);assert.match(food.season,/后续采收延续至十月初/);assert.ok(food.sources.some(x=>x[1]==='https://www.fengxian.gov.cn/gzms/20250807/93663.html'));assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非奉贤实拍/);assert.equal(ctx.window.LOTTERY_PROFILES[id].signature,C.signature(food));assert.equal(ctx.window.LOTTERY_PROFILES[id].senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),row=audit.rows.find(x=>x.term==='立秋'),next=audit.rows.find(x=>x.term==='处暑');assert.ok(row.foodIds.includes(id));assert.equal(row.repeatRate,0.5);assert.equal(row.withinLimit,true);assert.ok(!next.foodIds.includes(id));
});
