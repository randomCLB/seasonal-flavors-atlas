'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Minhou Chayuan highland spring shoots follow the documented Jingzhe-to-Qingming harvest window',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='minhou-chayuan-highland-spring-shoot',food=ctx.window.FOODS.find(x=>x.id===id),C=require(path.join(root,'dist/lottery-core.js'));
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[4,5,6]);assert.deepEqual(Array.from(food.entryTerms),[4,5,6]);assert.equal(food.seasonLabel,'惊蛰至清明 · 约一个月');
 assert.match(food.season,/闽侯县政府2026年报道记茶苑村高山春笋从惊蛰到清明采收/);assert.match(food.description,/脆嫩清甜/);assert.match(food.recipeTitle,/炒肉片/);assert.match(food.safety,/充分焯煮、彻底熟制/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.minhou.gov.cn/xjwz/zwgk/gzdt/mhxw/202603/t20260330_5301858.htm'));
 assert.match(food.imageCaption,/通用形态参考/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);
 const profile=ctx.window.LOTTERY_PROFILES[id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 for(const term of ['惊蛰','春分','清明'])assert.ok(audit.rows.find(x=>x.term===term).foodIds.includes(id));
});
