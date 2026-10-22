'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Suao Xiaoman flying-fish entry keeps the Agriculture Ministry source name and fishery limits',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='suao-xiaoman-flying-fish-fishery',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.equal(food.category,'seafood');assert.deepEqual(Array.from(food.peakTerms),[9]);assert.deepEqual(Array.from(food.entryTerms),[9]);
 assert.match(food.season,/台湾农业部小满资料/);assert.match(food.description,/没有细分物种/);assert.equal(food.sources[0][1],'https://www.moa.gov.tw/ws.php?id=2507780');
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非实物摄影/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const xiaoman=audit.rows.find(x=>x.term==='小满'),lixia=audit.rows.find(x=>x.term==='立夏');
 assert.ok(xiaoman.foodIds.includes(id));assert.ok(!lixia.foodIds.includes(id));assert.equal(xiaoman.repeatRate,0.5);assert.equal(xiaoman.withinLimit,true);
});
