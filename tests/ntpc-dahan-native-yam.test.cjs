'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('New Taipei native yam is a Great Cold recommendation, not a verified harvest date',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='ntpc-dahan-native-yam',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[1]);assert.match(food.season,/大寒时令推荐/);assert.match(food.season,/没有给出确切采挖日期/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.agriculture.ntpc.gov.tw/infor_detail.php?flag=menu&id=7126&p_id=31'));
 assert.match(food.imageCaption,/不用于品种或产地鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const majorCold=audit.rows.find(x=>x.term==='大寒'),minorCold=audit.rows.find(x=>x.term==='小寒');
 assert.ok(majorCold.foodIds.includes(id));assert.ok(!minorCold.foodIds.includes(id));
 ;
});
