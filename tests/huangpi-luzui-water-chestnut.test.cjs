'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Huangpi Luzui water chestnut is a sourced Great Cold harvest entry, distinct from the previous term',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='huangpi-luzui-water-chestnut',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[1]);assert.deepEqual(Array.from(food.entryTerms),[1]);assert.match(food.season,/2024 年 1 月报道记录陆咀村地标荸荠鲜挖上市/);assert.match(food.safety,/充分熟制/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.huangpi.gov.cn/zjhp/hpsn/gzdt_511/202401/t20240108_2338525.html'));assert.ok(food.sources.some(x=>x[1]==='https://wjw.fujian.gov.cn/ztzl/jkjy/jksh/202601/t20260121_7083127.htm'));
 assert.match(food.imageCaption,/不用于黄陂产地或地理标志鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const majorCold=audit.rows.find(x=>x.term==='大寒'),minorCold=audit.rows.find(x=>x.term==='小寒');assert.ok(majorCold.foodIds.includes(id));assert.ok(!minorCold.foodIds.includes(id));
 ;
});
