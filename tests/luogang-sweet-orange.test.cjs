'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Luogang orange is a source-backed Small Snow to Major Snow harvest-window entry',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='luogang-sweet-orange',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[21,22]);assert.deepEqual(Array.from(food.peakWindows[0]),['11-22','12-15']);
 assert.match(food.season,/11 月下旬至 12 月中旬/);assert.match(food.season,/不表示 2026 年当批已上市/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.hp.gov.cn/gzjg/qt/hpqgjdag/xxgk/content/post_10708762.html'));
 assert.match(food.imageCaption,/不证明萝岗品种、产地或地理标志身份/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const smallSnow=audit.rows.find(x=>x.term==='小雪'),majorSnow=audit.rows.find(x=>x.term==='大雪');
 assert.ok(smallSnow.foodIds.includes(id));assert.ok(majorSnow.foodIds.includes(id));
 ;
 ;
});
