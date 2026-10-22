'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Shazikou li-xia shrimp has multi-year spring-catch evidence, a generic licensed photo and a synchronized tarot profile',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='qingdao-shazikou-li-xia-shrimp-2026',food=ctx.window.FOODS.find(x=>x.id===id),C=require(path.join(root,'dist/lottery-core.js'));
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[4,5,6]);assert.deepEqual(Array.from(food.entryTerms),[4,5,6]);assert.equal(food.sourceYears,undefined);assert.equal(food.seasonPrecision,'multi-year-observed-window');
 assert.match(food.season,/2024年3月12日/);assert.match(food.season,/2026年3月7日/);assert.match(food.description,/鹰爪虾/);assert.match(food.recipeTitle,/白灼/);
 assert.ok(food.sources.some(x=>x[1]==='https://ocean.qingdao.gov.cn/tpxw/202603/t20260310_10531025.shtml'));
 assert.ok(food.sources.some(x=>x[1]==='https://www.xinhuanet.com/city/20240313/06656a6480c54862b2f96d19e45ed5d6/c.html'));
 assert.match(food.imageCaption,/不代表沙子口产地或鹰爪虾品种/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);
 const profile=ctx.window.LOTTERY_PROFILES[id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 for(const term of ['惊蛰','春分','清明'])assert.ok(audit.rows.find(x=>x.term===term).foodIds.includes(id));
});
