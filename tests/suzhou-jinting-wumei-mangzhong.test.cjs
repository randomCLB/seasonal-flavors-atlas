'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Jinting Wumei waxberry is an early Mangzhong harvest with a generic, licensed photo',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='suzhou-jinting-wumei-mangzhong-waxberry',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[10]);assert.match(food.seasonEvidence,/6月上中旬/);assert.match(food.pitfall,/熏制乌梅/);assert.match(food.imageCaption,/不代表苏州产地或乌梅种/);
 assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const image=fs.readFileSync(path.join(root,'dist',food.image));assert.deepEqual(Array.from(image.subarray(0,2)),[0xff,0xd8]);
 const credits=fs.readFileSync(path.join(root,'dist','credits.html'),'utf8');assert.match(credits,/苏州金庭乌梅种杨梅配图/);assert.match(credits,/CC BY-SA 4\.0/);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const mangzhong=audit.rows.find(x=>x.term==='芒种'),xiaoman=audit.rows.find(x=>x.term==='小满');
 assert.ok(mangzhong.foodIds.includes(id));assert.ok(!xiaoman.foodIds.includes(id));assert.equal(mangzhong.repeated,11);
});
