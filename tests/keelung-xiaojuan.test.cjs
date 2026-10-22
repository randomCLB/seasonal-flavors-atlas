'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
test('Keelung small-squid entry is limited to the Xiaoshu source window and retains the local-name caveat',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(item=>item.id==='keelung-xiaojuan');assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[12]);assert.match(food.description,/没有鉴定到具体物种/);assert.match(food.season,/不代表当年现货/);assert.equal(food.imageCaption,'本站编辑示意 · 通用锁管轮廓，不是基隆渔获实拍或物种鉴定。');
 const events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES),profileSource=fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8');vm.runInContext(profileSource,ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const profiles=ctx.window.LOTTERY_PROFILES;
 assert.equal(profiles[food.id].signature,C.signature(food));assert.equal(profiles[food.id].senses.signature,C.sensorySignature(food));
 for(const year of [2027,2028]){const start=events.find(e=>e.year===year&&e.index===12),next=events.find(e=>e.year===year&&e.index===13),begin=C.dayAt(start.time),after=C.dayAt(next.time),end=C.addDays(after,-1),expected=[];for(let d=begin;d<after;d=C.addDays(d,1))expected.push(d);assert.equal(C.isPeakDay(food,begin,events),true);assert.equal(C.isPeakDay(food,end,events),true);assert.equal(C.isPeakDay(food,C.addDays(begin,-1),events),false);assert.equal(C.isPeakDay(food,after,events),false);assert.deepEqual(C.candidateDays(food,profiles[food.id],{startDay:begin,endDay:after},events).map(x=>x.day),expected);}
 const audit=JSON.parse(require('child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));const pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['小暑'].includes(food.id));assert.ok(!pools['夏至'].includes(food.id));assert.ok(!pools['大暑'].includes(food.id));
});
