'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
for(const n of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8'),ctx);
const f=JSON.parse(JSON.stringify(ctx.window.FOODS.find(x=>x.id==='anlu-bailu-huaguoshan-fig'))),p=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES['anlu-bailu-huaguoshan-fig']));

test('Anlu Huaguoshan fig is a sourced Bailu harvest record without inventing a cultivar',()=>{
 assert.ok(f);assert.equal(C.signature(f),p.signature);assert.equal(C.sensorySignature(f),p.senses.signature);
 assert.deepEqual(Array.from(f.peakTerms),[16]);assert.equal(f.seasonPrecision,'historical-local-window');
 assert.match(f.season,/2024年白露报道/);assert.match(f.season,/持续到11月/);assert.doesNotMatch(f.season,/不表示白露后没有鲜果/);
 assert.ok(f.sources.some(([title,url])=>/湖北省农业农村厅/.test(title)&&url.includes('hubei.gov.cn')));
 assert.match(f.description,/报道未注明栽培品种/);assert.ok(f.steps.length>=3&&f.buy&&f.storage);
 assert.match(f.imageCaption,/通用无花果实拍/);assert.match(f.imageCaption,/不代表安陆产地或品种/);
 assert.ok(fs.statSync(path.join(root,'dist',f.image)).size>100000);
});

test('the fig appears in Bailu only as the dated sourcing spotlight',()=>{
 const audit=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/audit-term-repetition.cjs'),'2026'],{encoding:'utf8'}));
 const term=audit.rows.find(row=>row.term==='白露'),previous=audit.rows.find(row=>row.term==='处暑'),next=audit.rows.find(row=>row.term==='秋分');
 assert.ok(term.foodIds.includes(f.id));assert.ok(!previous.foodIds.includes(f.id));assert.ok(!next.foodIds.includes(f.id));
});
