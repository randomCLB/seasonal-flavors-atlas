'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Pinggu Yingshuanghong late peach uses the documented Frostfall-to-Lidong harvest window',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='pinggu-yingshuanghong-late-peach',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[19,20]);assert.deepEqual(Array.from(food.entryTerms),[19,20]);
 assert.match(food.season,/霜降至立冬都是采摘时段/);assert.match(food.pitfall,/不能单独证明品种、产地或整批品质/);
 assert.ok(food.sources.some(x=>x[1]==='https://xinwen.bjd.com.cn/content/s6359fa61e4b0b60bbc5de8d1.html'));
 assert.match(food.imageCaption,/不用于映霜红品种或平谷产地鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const frostfall=audit.rows.find(x=>x.term==='霜降'),lidong=audit.rows.find(x=>x.term==='立冬'),hanlu=audit.rows.find(x=>x.term==='寒露');
 assert.ok(frostfall.foodIds.includes(id));assert.ok(lidong.foodIds.includes(id));assert.ok(!hanlu.foodIds.includes(id));
});
