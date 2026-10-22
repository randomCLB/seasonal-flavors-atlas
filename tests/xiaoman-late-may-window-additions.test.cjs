'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('late-May Suzhou June yellow and Tangqi late loquat open in Xiaoman without being listed in Lixia',()=>{
 const ids=['suzhou-june-yellow-late-may-market','tangqi-tangbei-late-loquat'];for(const id of ids){const food=ctx.window.FOODS.find(x=>x.id===id);assert.ok(food);assert.ok(food.peakWindows?.length);assert.match(food.season,/2027|其他年份|历史/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));const p=ctx.window.LOTTERY_PROFILES[id];assert.equal(p.signature,C.signature(food));assert.equal(p.senses.signature,C.sensorySignature(food));}
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),lixia=audit.rows.find(x=>x.term==='立夏'),xiaoman=audit.rows.find(x=>x.term==='小满');for(const id of ids){assert.ok(xiaoman.foodIds.includes(id));assert.ok(!lixia.foodIds.includes(id));};;
});
