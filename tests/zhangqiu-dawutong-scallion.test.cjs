'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Zhangqiu Dawutong scallion is featured at the documented start of concentrated winter harvest',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='zhangqiu-dawutong-scallion',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[20]);assert.deepEqual(Array.from(food.entryTerms),[20]);assert.match(food.season,/立冬前后进入集中采收/);assert.match(food.season,/11月7日至12月12日/);assert.match(food.pitfall,/外地产大葱/);
 assert.ok(food.sources.some(x=>x[1]==='https://news.sina.com.cn/c/2019-10-24/doc-iicezzrr4591063.shtml'));assert.ok(food.sources.some(x=>x[1]==='https://www.jnzq.gov.cn/resources/public/20230921/650ba3570f6b8982e24bde48.pdf'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非产地或品种鉴别/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));const lidong=audit.rows.find(x=>x.term==='立冬'),xiaoxue=audit.rows.find(x=>x.term==='小雪');
 assert.ok(lidong.foodIds.includes(id));assert.ok(!xiaoxue.foodIds.includes(id));
});
