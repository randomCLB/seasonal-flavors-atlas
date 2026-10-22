const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='taiwan-hanlu-whitebelly-mackerel'),profile=ctx.window.LOTTERY_PROFILES['taiwan-hanlu-whitebelly-mackerel'];
test('Taiwan Cold Dew whitebelly mackerel stays a source-bounded seasonal fishery note',()=>{
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[18]);assert.equal(food.seasonStartTerm,18);
 assert.match(food.season,/台湾农业部/);assert.match(food.season,/不含年度渔获量、具体上岸日期或库存保证/);
 assert.match(food.description,/未列学名或标准商品鱼种/);assert.equal(food.sources[0][1],'https://www.moa.gov.tw/ws.php?id=2507789');
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 assert.ok(food.procurement.checks.length>=2);assert.ok(food.steps.length>=3);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const audit=JSON.parse(require('child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const coldDew=audit.rows.find(row=>row.term==='寒露');assert.ok(coldDew.foodIds.includes(food.id));
 const whiteDew=audit.rows.find(row=>row.term==='白露');assert.ok(!whiteDew.foodIds.includes(food.id));
});
