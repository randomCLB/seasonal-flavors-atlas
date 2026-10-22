'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Wenzhou Lingkun baizhuogua has a recurring spring-head-crop record, labeled generic photo, and Lixia-only peak entry',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(x=>x.id==='wenzhou-lingkun-baizhuogua'),profile=ctx.window.LOTTERY_PROFILES['wenzhou-lingkun-baizhuogua'];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[8]);assert.deepEqual(Array.from(food.entryTerms),[8]);assert.equal(food.seasonPrecision,'recurring-local-window');
 assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非灵昆/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 assert.ok(food.sources.some(x=>x[1]==='https://www.wenzhou.gov.cn/art/2020/5/6/art_1217368_42800532.html'));
 assert.ok(food.sources.some(x=>x[1]==='https://news.66wz.com/system/2025/04/16/105680759.shtml'));
 assert.ok(food.sources.some(x=>x[1]==='https://news.66wz.com/system/2026/04/21/105738079.shtml'));
 assert.match(food.season,/五一前后为采摘高峰/);assert.match(food.pitfall,/不同批次/);assert.match(food.procurement.checks.join(' '),/温州产地/);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),term=audit.rows.find(x=>x.term==='立夏'),previous=audit.rows.find(x=>x.term==='谷雨');
 assert.ok(term.foodIds.includes(food.id));assert.ok(!previous.foodIds.includes(food.id));assert.equal(term.count,26);assert.equal(term.repeated,13);assert.equal(term.repeatRate,13/26);assert.equal(term.withinLimit,true);
});
