const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='yuanmou-yangjie-autumn-shatangju'),profile=ctx.window.LOTTERY_PROFILES['yuanmou-yangjie-autumn-shatangju'];
test('Yuanmou shatangju is a single 2026 Hanlu observation with valid profile and image',()=>{
 assert.ok(food);assert.deepEqual(Array.from(food.peakWindows[0]),['10-16','10-16']);assert.deepEqual(Array.from(food.sourceYears),[2026]);assert.equal(food.seasonStartTerm,18);
 assert.match(food.season,/2026 年 10 月 16 日/);assert.match(food.season,/不外推常年窗口/);assert.match(food.description,/不是本站试吃结论/);
 assert.ok(food.sources.some(source=>source[1]==='https://www.yncxym.gov.cn/info/1042/294047.htm'));
 assert.equal(food.steps.length,3);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 assert.equal(C.isPeakDay(food,'2026-10-16'),true);assert.equal(C.isPeakDay(food,'2026-10-15'),false);assert.equal(C.isPeakDay(food,'2027-10-16'),false);
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const hanlu=audit.rows.find(row=>row.term==='寒露'),autumnEquinox=audit.rows.find(row=>row.term==='秋分');assert.ok(hanlu.foodIds.includes(food.id));assert.ok(!autumnEquinox.foodIds.includes(food.id));assert.equal(audit.overLimit,audit.rows.filter(row=>!row.withinLimit).length);
 const nextYear=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2027'],{cwd:root,encoding:'utf8'}));assert.ok(!nextYear.rows.flatMap(row=>row.foodIds).includes(food.id));
});
