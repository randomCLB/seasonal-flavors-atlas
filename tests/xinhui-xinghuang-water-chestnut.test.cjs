'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Xinhui Xinghuang water chestnut has a sourced Winter Solstice harvest record and no unverified origin claims',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='xinhui-xinghuang-water-chestnut',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[23]);assert.deepEqual(Array.from(food.entryTerms),[23]);
 assert.match(food.season,/每年夏至前后种植、冬至前后进入收获期/);assert.match(food.pitfall,/不是经来源证明的独有品种/);assert.match(food.safety,/充分熟制/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.xinhui.gov.cn/zwgk/xhdt/zjdt/content/post_3013684.html'));
 assert.match(food.imageCaption,/不用于兴篁产地或品种鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const winterSolstice=audit.rows.find(x=>x.term==='冬至'),xiaohan=audit.rows.find(x=>x.term==='小寒');
 assert.ok(winterSolstice.foodIds.includes(id));assert.ok(!xiaohan.foodIds.includes(id));
});
