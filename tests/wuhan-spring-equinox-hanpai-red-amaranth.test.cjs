'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Wuhan red amaranth is limited to the historically documented mid-to-late March concentrated listing',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='wuhan-spring-equinox-hanpai-red-amaranth',food=ctx.window.FOODS.find(x=>x.id===id),C=require(path.join(root,'dist/lottery-core.js'));
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[5]);assert.deepEqual(Array.from(food.entryTerms),[5]);assert.equal(food.category,'vegetable');assert.match(food.season,/2025年报道/);assert.match(food.season,/不表示它仅在春分/);assert.match(food.description,/柔坨/);assert.match(food.safety,/充分清洗/);
 assert.ok(food.sources.some(x=>x[1]==='https://nyncj.wuhan.gov.cn/xwzx_25/whsn/202503/t20250307_2548576.html'));assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const profile=ctx.window.LOTTERY_PROFILES[id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),spring=audit.rows.find(x=>x.term==='春分'),jingzhe=audit.rows.find(x=>x.term==='惊蛰');assert.ok(spring.foodIds.includes(id));assert.ok(!jingzhe.foodIds.includes(id));
});
