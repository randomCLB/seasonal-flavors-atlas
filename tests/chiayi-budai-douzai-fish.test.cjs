'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
test('Budai douzai fish is a Xiaoxue-only seasonal entry with an explicit species-identity limit',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(item=>item.id==='chiayi-budai-douzai-fish');assert.ok(food);assert.deepEqual(Array.from(food.peakWindows[0]),['11-21','12-06']);assert.match(food.description,/不把它擅自等同某一种鱼/);assert.equal(food.imageCaption,'本站编辑示意 · 通用鱼形，不是布袋渔获实拍或物种鉴定。');
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const profiles=ctx.window.LOTTERY_PROFILES;
 assert.equal(profiles[food.id].signature,C.signature(food));assert.equal(profiles[food.id].senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(require('child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));const pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['小雪'].includes(food.id));assert.ok(!pools['立冬'].includes(food.id));assert.ok(!pools['大雪'].includes(food.id));
});
