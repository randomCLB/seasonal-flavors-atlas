'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
test('Tamsui Xiaoshu jiala remains a separate sourced local-name lead without species or stock claims',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(item=>item.id==='tamsui-xiaoshu-jiala');assert.ok(food);assert.deepEqual(Array.from(food.entryTerms),[12]);assert.deepEqual(Array.from(food.peakTerms),[12]);assert.match(food.season,/不推定具体物种/);assert.match(food.description,/不能仅凭名称/);assert.match(food.taste,/来源未描述风味/);assert.equal(food.sources[0][1],'https://www.moa.gov.tw/ws.php?id=2507783');assert.match(food.imageCaption,/非淡水渔获实拍/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.ok(profile);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES);for(const year of [2027,2028]){const start=events.find(e=>e.year===year&&e.index===12),next=events.find(e=>e.year===year&&e.index===13),begin=C.dayAt(start.time),after=C.dayAt(next.time);assert.equal(C.isPeakDay(food,begin,events),true);assert.equal(C.isPeakDay(food,C.addDays(after,-1),events),true);assert.equal(C.isPeakDay(food,C.addDays(begin,-1),events),false);assert.equal(C.isPeakDay(food,after,events),false);}
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));const pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['小暑'].includes(food.id));assert.ok(!pools['夏至'].includes(food.id));assert.ok(!pools['大暑'].includes(food.id));
});
