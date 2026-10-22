'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js');
test('Zhenning honey plum is a sourced Grain-in-Ear entry with a generic real-photo reference',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(x=>x.id==='zhenning-honey-plum'),profile=ctx.window.LOTTERY_PROFILES['zhenning-honey-plum'];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[10]);assert.deepEqual(Array.from(food.entryTerms),[10]);
 assert.ok(food.sources.some(x=>x[1]==='https://www.mee.gov.cn/ywgz/zrstbh/swdyxbh/202405/t20240514_1073167.shtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/不用于镇宁产地或品种鉴别/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const grain=audit.rows.find(x=>x.term==='芒种'),previous=audit.rows.find(x=>x.term==='小满');
 assert.ok(grain.foodIds.includes(food.id));assert.ok(!previous.foodIds.includes(food.id));
 assert.equal(grain.count,22);assert.equal(grain.repeated,11);assert.equal(grain.requiredAdditionalFoodsNotInPreviousTerm,0);
});
