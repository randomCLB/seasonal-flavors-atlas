'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Ya’an Chuancha No. 3 first-pick tea is a sourced Lichun-only entry with truthful scope and valid lottery signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='yaan-chuancai3-lichun-first-pick',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[2]);assert.deepEqual(Array.from(food.entryTerms),[2]);assert.match(food.season,/2月10日已采/);assert.match(food.season,/不确认2026年具体采摘日/);assert.match(food.taste,/尚未找到可核验/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.yaan.gov.cn/xinwen/show/8e3ed307-c165-4164-aed3-b19b808f8696.html'));assert.match(food.imageCaption,/不用于川茶3号/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),lichun=audit.rows.find(x=>x.term==='立春'),dahan=audit.rows.find(x=>x.term==='大寒');assert.ok(lichun.foodIds.includes(id));assert.ok(!dahan.foodIds.includes(id));
 const app=fs.readFileSync(path.join(root,'dist','app.js'),'utf8'),html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');assert.match(app,/tea:'茶与饮品'/);assert.match(html,/<option value="tea">茶与饮品<\/option>/);
});
