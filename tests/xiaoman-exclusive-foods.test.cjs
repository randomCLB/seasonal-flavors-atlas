'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('sourced late-May foods lower Xiaoman overlap to half and preserve their full term windows',()=>{
 const ids=['lichuan-heyuan-girl-fruit','kaohsiung-yuhebao-lychee-late-may'];
 for(const id of ids){const food=ctx.window.FOODS.find(x=>x.id===id);assert.ok(food);assert.ok(food.sources.length);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));const p=ctx.window.LOTTERY_PROFILES[id];assert.ok(p);assert.equal(p.signature,C.signature(food));assert.equal(p.senses.signature,C.sensorySignature(food));}
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),lixia=audit.rows.find(x=>x.term==='立夏'),xiaoman=audit.rows.find(x=>x.term==='小满'),mangzhong=audit.rows.find(x=>x.term==='芒种');
 assert.ok(xiaoman.foodIds.includes(ids[0]));assert.ok(xiaoman.foodIds.includes(ids[1]));assert.ok(!lixia.foodIds.includes(ids[0]));assert.ok(!lixia.foodIds.includes(ids[1]));assert.ok(mangzhong.foodIds.includes(ids[1]));assert.equal(xiaoman.repeatRate,0.5);assert.equal(xiaoman.withinLimit,true);
});
