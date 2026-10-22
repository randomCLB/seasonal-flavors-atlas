'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Doudian Nongkenuo 336 is a source-backed 2026 Xiaoshu entry, not a recurring window',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='fangshan-doudian-nongkenuo336-corn',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[12]);assert.deepEqual(Array.from(food.sourceYears),[2026]);assert.equal(food.seasonPrecision,'single-year-reported-window');
 assert.match(food.season,/2026年7月7日.*7月20日前后/);assert.ok(food.sources.some(x=>x[1]==='https://www.bjfsh.gov.cn/zhxw/xzrd/202607/t20260707_40115325.shtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/Rasbak.*CC BY-SA 3.0.*通用甜玉米/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2025'],{cwd:root,encoding:'utf8'})),xiaozhi=audit.rows.find(x=>x.term==='夏至'&&x.year===2026),xiaoshu=audit.rows.find(x=>x.term==='小暑'&&x.year===2026);
 assert.ok(!xiaozhi.foodIds.includes(id));assert.ok(xiaoshu.foodIds.includes(id));assert.equal(xiaoshu.repeated,13);assert.equal(xiaoshu.count,27);assert.equal(xiaoshu.repeatRate,13/27);
});
