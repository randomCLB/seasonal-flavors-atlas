'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
test('温州瓯江子鲚 is a sourced Jingzhe tasting entry, not an invented exact catch date',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(item=>item.id==='wenzhou-oujiang-ziji');assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[4]);assert.equal(food.peakWindows,undefined);assert.match(food.season,/每年三月/);assert.match(food.season,/不确认 2027 年渔汛/);assert.match(food.pitfall,/凤尾鱼.*俗名/);assert.ok(food.procurement.checks.length>=3);assert.match(food.imageCaption,/物种鉴定图/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.ok(food.sources.some(item=>item[1]==='https://chinese.cri.cn/2024/03/05/ARTIr7ZpnaA5VgayvCyESfa3240228.shtml'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),row=Object.fromEntries(audit.rows.map(item=>[item.term,item]));assert.ok(row['惊蛰'].foodIds.includes(food.id));assert.ok(!row['雨水'].foodIds.includes(food.id));assert.ok(!row['春分'].foodIds.includes(food.id));
});
