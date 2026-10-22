'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const food=ctx.window.FOODS.find(x=>x.id==='qingdao-youreka-greenhouse-blueberry'),profile=ctx.window.LOTTERY_PROFILES['qingdao-youreka-greenhouse-blueberry'],C=require('../dist/lottery-core.js');
test('Qingdao greenhouse Eureka blueberries have a sourced Dahan window and accurately labeled photo reference',()=>{
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[1]);assert.deepEqual(Array.from(food.entryTerms),[1]);assert.equal(food.seasonPrecision,'recurring-reported-window');
 assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/不用于青岛产地或优瑞卡品种鉴别/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.qingdao.gov.cn/zwgk/xxgk/fgw/ywfl/cyfz/202506/t20250609_9638028.shtml'));assert.match(food.season,/1月下旬率先上市/);assert.match(food.procurement.checks.join(' '),/优瑞卡/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),term=audit.rows.find(x=>x.term==='大寒'),previous=audit.rows.find(x=>x.term==='小寒');
 assert.ok(term.foodIds.includes(food.id));assert.ok(!previous.foodIds.includes(food.id));assert.equal(term.count,42);assert.equal(term.repeated,21);assert.equal(term.requiredAdditionalFoodsNotInPreviousTerm,0);
});
