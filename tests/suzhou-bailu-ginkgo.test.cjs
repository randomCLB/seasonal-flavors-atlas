'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Suzhou white ginkgo is a sourced White Dew food with safe preparation and licensed photo',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='suzhou-bailu-ginkgo',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[16]);assert.equal(food.seasonLabel,'白露时节采收');
 assert.match(food.seasonEvidence,/白露至秋分采收/);assert.match(food.safety,/不可生食.*沸水煮10分钟.*10—20粒.*不超过5粒.*婴幼儿不食/);
 assert.match(food.recipeTitle,/白果山药粥/);assert.match(food.buy,/白果仁/);assert.match(food.imageCaption,/不代表苏州产地/);
 assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const photo=fs.readFileSync(path.join(root,'dist',food.image));assert.deepEqual(Array.from(photo.subarray(0,2)),[0xff,0xd8]);
 const credits=fs.readFileSync(path.join(root,'dist','credits.html'),'utf8');assert.match(credits,/苏州白露鲜白果页面配图/);assert.match(credits,/CC0 1\.0/);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const whiteDew=audit.rows.find(x=>x.term==='白露');
 assert.deepEqual(Array.from(ctx.window.FOODS.find(x=>x.id==='hanshou-yubiou').peakWindows[0]),['09-15','09-30']);assert.ok(whiteDew.foodIds.includes('hanshou-yubiou'));assert.ok(whiteDew.foodIds.includes(id));assert.equal(whiteDew.repeated,15);assert.equal(whiteDew.count,30);assert.equal(whiteDew.repeatRate,.5);
 assert.equal(audit.overLimit,0);assert.equal(audit.requiredNewTermAppearancesIfRetainingCurrentPools,0);
});
