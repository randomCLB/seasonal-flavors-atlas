'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('Fuzhou Cold Dew dried razor clam is recorded as a local processing custom, not current supply',()=>{
 const id='fuzhou-hanlu-razor-clam-dry',f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[18]);assert.equal(f.seasonPrecision,'solar-term-window');
 assert.match(f.season,/地方加工时俗/);assert.match(f.season,/不代表.*当前有货/);assert.match(f.description,/本站未试吃/);
 assert.ok(p.avoid.includes('seafood'));
 assert.match(f.procurement.checks.join(' '),/蛏干.*蛤干/);assert.match(f.safety,/充分煮熟/);
 assert.ok(f.sources.some(x=>x[1]==='https://www.fuzhou.gov.cn/zgfzzt/zjrc/mdfc/msfq/202512/t20251205_5241003.htm'));
 assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
});
test('Fuzhou liaozai keeps the reported local name without inventing a species identification',()=>{
 const id='fuzhou-hanlu-liaozai-clam',f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[18]);assert.equal(f.seasonPrecision,'solar-term-window');
 assert.match(f.season,/没有给出标准物种鉴定/);assert.match(f.description,/没有明确到物种/);assert.match(f.procurement.checks.join(' '),/标准名称及物种/);
 assert.match(f.imageCaption,/不用于.*物种鉴别/);assert.ok(f.sources.some(x=>x[1]==='https://www.fuzhou.gov.cn/zgfzzt/zjrc/mdfc/msfq/202512/t20251205_5241003.htm'));
 assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
});
