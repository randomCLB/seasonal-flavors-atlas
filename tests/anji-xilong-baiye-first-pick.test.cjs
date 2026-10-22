'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Anji Xilong late-March tea is a sourced Spring Equinox-only first-pick entry',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='anji-xilong-baiye-first-pick',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.equal(food.category,'tea');assert.deepEqual(Array.from(food.peakTerms),[5]);assert.deepEqual(Array.from(food.entryTerms),[5]);
 assert.match(food.season,/2025年3月25日/);assert.match(food.season,/2024年3月28日/);assert.match(food.description,/绿茶/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.ctma.com.cn/xiehuidongtai/80677.html'));
 assert.ok(food.sources.some(x=>x[1]==='https://ajdz.investchn.com/news/detail/id/481349.html'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非实物摄影/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const spring=audit.rows.find(x=>x.term==='春分'),jingzhe=audit.rows.find(x=>x.term==='惊蛰');
 assert.ok(spring.foodIds.includes(id));assert.ok(!jingzhe.foodIds.includes(id));assert.equal(spring.repeatRate,0.5);assert.equal(spring.withinLimit,true);
});
