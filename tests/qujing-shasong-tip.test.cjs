'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
test('Qujing shasong tips use a month-level sourced spring window and remain visible across the documented market season',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(item=>item.id==='qujing-shasong-tip');assert.ok(food);assert.deepEqual(Array.from(food.peakMonths),[3,4]);assert.equal(food.seasonPrecision,'month');assert.equal(food.sourceYears,undefined);assert.match(food.season,/2023年3月和2026年3月/);assert.match(food.description,/没有鉴定植物学种/);assert.ok(food.procurement.checks.length>=3);assert.match(food.imageCaption,/非曲靖实拍、非植物鉴定/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.ok(food.sources.some(item=>item[1]==='https://www.sohu.com/a/651393681_121123789'));assert.ok(food.sources.some(item=>item[1]==='https://m.yunnan.cn/system/2026/03/06/033902200.shtml'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['雨水'].includes(food.id));assert.ok(pools['惊蛰'].includes(food.id));assert.ok(pools['春分'].includes(food.id));assert.ok(pools['清明'].includes(food.id));
 const jingzhe=audit.rows.find(row=>row.term==='惊蛰');assert.equal(jingzhe.year,2027);assert.ok(jingzhe.foodIds.includes('wenzhou-oujiang-ziji'));
});
