'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
for(const n of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8'),ctx);
const f=JSON.parse(JSON.stringify(ctx.window.FOODS.find(x=>x.id==='beian-xiaohan-white-lover-strawberry'))),p=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES['beian-xiaohan-white-lover-strawberry']));

test('Beian white strawberry uses the single documented Xiaohan harvest and keeps the next-year limit clear',()=>{
 assert.ok(f);assert.equal(C.signature(f),p.signature);assert.equal(C.sensorySignature(f),p.senses.signature);
 assert.deepEqual(Array.from(f.peakTerms),[0]);assert.equal(f.seasonPrecision,'single-year-record');
 assert.match(f.season,/2025年1月13日/);assert.match(f.season,/不据此推定每年固定窗口/);
 assert.ok(f.sources.some(([title,url])=>/黑河市人民政府/.test(title)&&url.includes('heihe.gov.cn')));
 assert.ok(f.sources.some(([title,url])=>/白色恋人/.test(title)&&url.includes('thepaper.cn')));
 assert.match(f.description,/不能只凭颜色判断果实未熟/);assert.ok(f.steps.length>=3&&f.buy&&f.storage);
 assert.match(f.imageCaption,/通用实拍/);assert.match(f.imageCaption,/不代表北安产地或“白色恋人”品种鉴别/);
 assert.ok(fs.statSync(path.join(root,'dist',f.image)).size>100000);
});

test('the White Lover strawberry contributes one Xiaohan-only entry without changing the strict overlap limit',()=>{
 const audit=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/audit-term-repetition.cjs'),'2026'],{encoding:'utf8'}));
 const term=audit.rows.find(row=>row.term==='小寒'),previous=audit.rows.find(row=>row.term==='冬至');
 assert.ok(term.foodIds.includes(f.id));assert.ok(!previous.foodIds.includes(f.id));
 assert.equal(term.count,36);assert.equal(term.repeated,18);assert.equal(term.requiredAdditionalFoodsNotInPreviousTerm,0);
});
