'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Conghua Zhouzhoumei citrus is a sourced Dahan harvest-window entry',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='conghua-zhouzhoumei-citrus',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.equal(food.category,'fruit');assert.deepEqual(Array.from(food.peakTerms),[1]);assert.deepEqual(Array.from(food.entryTerms),[1]);
 assert.match(food.season,/1月.*3月/);assert.ok(food.sources.some(x=>x[1]==='https://www.conghua.gov.cn/zfjg/qgxhzslhs/zwgk/zfxxgkml/gzdt/content/post_10100318.html'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/通用形态参考/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const term=audit.rows.find(x=>x.term==='大寒'),previous=audit.rows.find(x=>x.term==='小寒');
 assert.ok(term.foodIds.includes(id));assert.ok(!previous.foodIds.includes(id));
});
