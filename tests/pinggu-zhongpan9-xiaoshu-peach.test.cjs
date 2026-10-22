'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Pinggu Zhongpan 9 is a sourced Xiaoshu peach, exclusive to the previous term, with a correctly labeled generic photo',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='pinggu-zhongpan9-xiaoshu-peach',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[12]);assert.match(food.seasonEvidence,/7月中旬成熟/);assert.match(food.description,/黄肉.*硬溶质.*14%/);assert.match(food.buy,/中蟠9号/);
 assert.match(food.imageCaption,/不代表平谷产地或中蟠9号/);assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const peachPhoto=fs.readFileSync(path.join(root,'dist',food.image));assert.deepEqual(Array.from(peachPhoto.subarray(0,2)),[0xff,0xd8]);
 const credits=fs.readFileSync(path.join(root,'dist','credits.html'),'utf8');assert.match(credits,/平谷中蟠9号桃页面配图/);assert.match(credits,/查看原图与许可/);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const xiaoshu=audit.rows.find(x=>x.term==='小暑'),summerSolstice=audit.rows.find(x=>x.term==='夏至');
 assert.ok(xiaoshu.foodIds.includes(id));assert.ok(!summerSolstice.foodIds.includes(id));assert.equal(xiaoshu.repeated,13);
});
