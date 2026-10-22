'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('Lixian QinCui apples are a 2026-only Hanlu maturity record, not a recurring supply claim',()=>{
 const id='lixian-hanlu-qincui-apple',food=ctx.window.FOODS.find(x=>x.id===id);assert.ok(food);assert.deepEqual(Array.from(food.peakWindows[0]),['10-15','10-22']);assert.deepEqual(Array.from(food.sourceYears),[2026]);assert.equal(food.seasonPrecision,'approximate-window');assert.match(food.season,/不外推到其他年份/);assert.match(food.taste,/未试吃/);assert.match(food.imageCaption,/不用于理县产地或秦脆品种鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.ok(food.sources.some(x=>x[1]==='https://www.ablixian.gov.cn/lxrmzf/c100050/202610/1247df1c492b4080a00d55a6af377880.shtml'));
 const profile=ctx.window.LOTTERY_PROFILES[id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),hanlu=audit.rows.find(x=>x.term==='寒露');assert.ok(hanlu.foodIds.includes(id));;
});
