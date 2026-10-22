'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Lin-an spring Lei bamboo shoots have an official natural-season window and verified pool metadata',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(x=>x.id==='linan-early-spring-leizun'),profile=ctx.window.LOTTERY_PROFILES['linan-early-spring-leizun'],C=require('../dist/lottery-core.js');
 assert.ok(food);assert.match(food.season,/临安、余杭/);assert.match(food.season,/三月初/);assert.match(food.season,/四月中下旬/);assert.match(food.season,/覆盖栽培/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.forestry.gov.cn/c/www/dfdt/624600.jhtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/通用形态参考/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),rain=audit.rows.find(x=>x.term==='雨水'),jingzhe=audit.rows.find(x=>x.term==='惊蛰');
 assert.ok(!rain.foodIds.includes(food.id));assert.ok(jingzhe.foodIds.includes(food.id));assert.equal(jingzhe.repeatRateDenominator,'current-term-total');
});
