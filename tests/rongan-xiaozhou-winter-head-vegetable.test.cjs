'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));

test('融安小洲头菜按农历岁末鲜采记录覆盖小寒与大寒，并区分原菜和腌制品',()=>{
 const id='rongan-xiaozhou-winter-head-vegetable',food=ctx.window.FOODS.find(x=>x.id===id),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual([...food.peakTerms],[0,1]);assert.equal(food.seasonPrecision,'lunar-season-window');assert.equal(food.seasonBasis,'harvest');
 assert.ok(food.sources.some(x=>x[1]==='https://www.rongan.gov.cn/xwzx/xwzxtpbd/202601/t20260108_3711334.shtml'));assert.ok(food.sources.some(x=>x[1]==='https://www.liuzhou.gov.cn/zjlz/ywlz/fywh/t19700101_3360914.shtml'));
 assert.match(food.season,/农历十二月底/);assert.match(food.pitfall,/鲜采蔬菜和加工后的腌制产品/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const a=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),xiaohan=a.rows.find(x=>x.term==='小寒'),dahan=a.rows.find(x=>x.term==='大寒'),dongzhi=a.rows.find(x=>x.term==='冬至');
 assert.ok(xiaohan.foodIds.includes(id));assert.ok(dahan.foodIds.includes(id));assert.ok(!dongzhi.foodIds.includes(id));;
});
