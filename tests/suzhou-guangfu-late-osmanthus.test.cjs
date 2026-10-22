'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('Guangfu late osmanthus preserves the Cold Dew flower source and 2026-only harvest claim',()=>{
 const id='suzhou-guangfu-hanlu-late-osmanthus',f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[18]);assert.deepEqual(Array.from(f.sourceYears),[2026]);assert.equal(f.seasonPrecision,'single-year-harvest-record');
 assert.match(f.season,/不保证其他年份/);assert.match(f.safety,/观赏桂花/);assert.match(f.description,/本站未试吃/);
 assert.ok(f.sources.some(x=>x[1]==='https://jssdfz.jiangsu.gov.cn/n99/20220413/i17112.html'));
 assert.ok(f.sources.some(x=>x[1]==='https://www.suzhou.gov.cn/szsrmzf/tpxw/202610/e6b5235134b4441a80e70cd7161c6507.shtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
});
