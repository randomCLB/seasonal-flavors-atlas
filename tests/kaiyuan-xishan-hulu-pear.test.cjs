'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Kaiyuan Xishan hulu pear is a sourced Hanlu harvest-peak entry with an honest local-variety note',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='kaiyuan-xishan-hulu-pear',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[18]);assert.deepEqual(Array.from(food.entryTerms),[18]);assert.equal(food.seasonBasis,'harvest');assert.match(food.season,/2025年10月报道/);assert.match(food.description,/水泡梨和梨膏/);assert.match(food.pitfall,/不能只凭葫芦形外观确认产地/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.hhky.gov.cn/info/1131/760902.htm'));assert.ok(food.sources.some(x=>x[1]==='https://yn.yunnan.cn/system/2023/04/06/032535487.shtml'));assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/不用于产地或品种鉴定/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),hanlu=audit.rows.find(x=>x.term==='寒露'),frost=audit.rows.find(x=>x.term==='霜降');
 assert.ok(hanlu.foodIds.includes(id));assert.ok(!frost.foodIds.includes(id));
 ;
});
