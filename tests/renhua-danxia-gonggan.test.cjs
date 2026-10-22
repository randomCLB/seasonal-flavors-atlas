'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='renhua-danxia-gonggan');

test('Renhua Danxia gonggan is a sourced late-November Xiaoxue entry with transparent harvest uncertainty',()=>{
 assert.ok(food);assert.equal(food.category,'fruit');assert.deepEqual(Array.from(food.peakTerms),[21]);assert.equal(food.seasonStartTerm,21);
 assert.match(food.season,/11月中下旬开启/);assert.match(food.season,/不确认2026年的采摘或库存/);
 assert.match(food.pitfall,/不同年份/);assert.match(food.imageCaption,/非实物摄影/);
 assert.ok(food.sources.some(source=>source[1]==='https://country.southcn.com/xczx/af0811eeb8.shtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const lidong=audit.rows.find(row=>row.term==='立冬'),xiaoxue=audit.rows.find(row=>row.term==='小雪');
 assert.ok(!lidong.foodIds.includes(food.id));assert.ok(xiaoxue.foodIds.includes(food.id));
 ;assert.equal(xiaoxue.repeatRate,0.5);
});
