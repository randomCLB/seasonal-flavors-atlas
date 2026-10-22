'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Caidian E’hong 4 early caitai is a sourced Hanlu-only entry',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='caidian-ehong4-early-caitai',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[18]);assert.deepEqual(Array.from(food.entryTerms),[18]);assert.match(food.season,/十月中旬集中采收上市/);assert.match(food.pitfall,/外地/);
 assert.ok(food.sources.some(x=>x[1]==='https://nyncj.wuhan.gov.cn/xwzx_25/whsn/202310/t20231007_2274525.html'));assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/不用于鄂红4号品种或蔡甸产地鉴别/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const hanlu=audit.rows.find(x=>x.term==='寒露'),frost=audit.rows.find(x=>x.term==='霜降');assert.ok(hanlu.foodIds.includes(id));assert.ok(!frost.foodIds.includes(id));
 ;;
});
