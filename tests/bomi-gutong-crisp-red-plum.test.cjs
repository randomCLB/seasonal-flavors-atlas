const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='bomi-gutong-crisp-red-plum'),profile=ctx.window.LOTTERY_PROFILES['bomi-gutong-crisp-red-plum'];
test('Bomi late-season plum is limited to its 2026-10-13 harvest-season observation',()=>{
 assert.ok(food);assert.deepEqual(Array.from(food.peakWindows[0]),['10-13','10-13']);assert.deepEqual(Array.from(food.sourceYears),[2026]);assert.equal(food.seasonStartTerm,18);
 assert.match(food.season,/2026 年 10 月 13 日/);assert.match(food.season,/不推定整月产期/);assert.match(food.description,/不是本站试吃记录/);
 assert.ok(food.sources.some(source=>source[1]==='https://linzhi.gov.cn/linzhi/xwzx/202610/8794ac7eb8dc42c08f81275a265f47be.shtml'));
 assert.ok(food.procurement.checks.length>=2);assert.equal(food.steps.length,3);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 assert.equal(C.isPeakDay(food,'2026-10-13'),true);assert.equal(C.isPeakDay(food,'2026-10-14'),false);assert.equal(C.isPeakDay(food,'2027-10-13'),false);
 const audit=JSON.parse(require('child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const coldDew=audit.rows.find(row=>row.term==='寒露');assert.ok(coldDew.foodIds.includes(food.id));
 const nextYear=JSON.parse(require('child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2027'],{cwd:root,encoding:'utf8'}));assert.ok(!nextYear.rows.flatMap(row=>row.foodIds).includes(food.id));
});
