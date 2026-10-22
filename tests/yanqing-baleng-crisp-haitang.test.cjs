'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
test('延庆八棱脆海棠 uses a sourced late-September to mid-October window without truncating its neighboring-term presence',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(item=>item.id==='yanqing-baleng-crisp-haitang');assert.ok(food);assert.deepEqual(Array.from(food.peakWindows[0]),['09-26','10-15']);assert.equal(food.seasonPrecision,'approximate-window');assert.equal(food.sourceYears,undefined);assert.match(food.season,/2026年.*2023年/);assert.match(food.description,/变异品种/);assert.match(food.pitfall,/观赏海棠果/);assert.ok(food.procurement.checks.length>=3);assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.ok(food.sources.some(item=>item[1]==='https://xinwen.bjd.com.cn/content/s6abbb699e4b0e42f8f00fe52.html'));assert.ok(food.sources.some(item=>item[1]==='https://www.ctdsb.net/c1666_202309/1904690.html'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),row=Object.fromEntries(audit.rows.map(item=>[item.term,item]));assert.ok(row['秋分'].foodIds.includes(food.id));assert.ok(row['寒露'].foodIds.includes(food.id));assert.ok(!row['白露'].foodIds.includes(food.id));;
});
