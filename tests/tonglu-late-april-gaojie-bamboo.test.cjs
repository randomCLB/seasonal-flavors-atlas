'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Tonglu high-jie bamboo shoots are a sourced late-April harvest distinct from covered white shoots',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(x=>x.id==='tonglu-late-april-gaojie-bamboo'),profile=ctx.window.LOTTERY_PROFILES['tonglu-late-april-gaojie-bamboo'],C=require('../dist/lottery-core.js');
 assert.ok(food);assert.match(food.season,/四月底/);assert.match(food.season,/覆土栽培/);assert.ok(food.sources.some(x=>x[1]==='https://www.forestry.gov.cn/c/www/dfdt/624600.jhtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),qingming=audit.rows.find(x=>x.term==='清明'),guyu=audit.rows.find(x=>x.term==='谷雨'),lixia=audit.rows.find(x=>x.term==='立夏');
 assert.ok(!qingming.foodIds.includes(food.id));assert.ok(guyu.foodIds.includes(food.id));assert.ok(!lixia.foodIds.includes(food.id));assert.equal(guyu.withinLimit,true);
});
