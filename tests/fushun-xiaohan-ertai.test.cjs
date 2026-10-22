'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('Fushun ertai is a sourced Xiaohan harvest record with an honest historical window',()=>{
 const id='fushun-xiaohan-ertai',f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[0]);assert.deepEqual(Array.from(f.entryTerms),[0]);assert.equal(f.seasonPrecision,'historical-term-record');
 assert.match(f.season,/2025年.*1月8日/);assert.match(f.season,/不保证每年同日上市/);assert.match(f.description,/本站不冒充试吃/);
 assert.ok(f.sources.some(x=>x[1]==='https://imgs.xinhuanet.com/local/20250116/ff712517c06a4cd08ad262158c2f5f33/c.html'));
 assert.ok(f.sources.some(x=>x[1]==='https://edu.china.com.cn/2024-01/05/content_116922577.shtml'));
 assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
});
