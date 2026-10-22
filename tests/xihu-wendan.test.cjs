'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),ctx={window:{FengwuLottery:C}};vm.createContext(ctx);
for(const n of ['solar-terms','data','winter-additions','editorial','editorial-notes','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8'),ctx);
const f=JSON.parse(JSON.stringify(ctx.window.FOODS.find(x=>x.id==='miaoli-xihu-wendan'))),p=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES['miaoli-xihu-wendan']));

test('Miaoli Xihu Wendan has scoped White Dew evidence and a real generic pomelo reference',()=>{
 assert.ok(f);assert.equal(C.signature(f),p.signature);assert.equal(C.sensorySignature(f),p.senses.signature);
 assert.deepEqual(Array.from(f.peakTerms),[16]);assert.match(f.season,/白露后采收/);assert.match(f.season,/辞水/);
 assert.ok(f.sources.some(([title,url])=>/苗栗县政府/.test(title)&&url.includes('miaoli.gov.tw')));
 assert.ok(f.sources.some(([title,url])=>/农业部食农教育/.test(title)&&url.includes('fae.moa.gov.tw')));
 assert.ok(f.steps.length>=3&&f.buy&&f.storage&&f.safety);
 assert.match(f.imageCaption,/通用形态参考/);assert.match(f.imageCaption,/不作西湖文旦品种或产地识别/);
 assert.ok(fs.statSync(path.join(root,'dist',f.image)).size>10000);
});

test('the new Wendan appears in White Dew only and lowers its audited overlap',()=>{
 const audit=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/audit-term-repetition.cjs'),'2026'],{encoding:'utf8'}));
 const whiteDew=audit.rows.find(row=>row.term==='白露'),previous=audit.rows.find(row=>row.term==='处暑');
 assert.ok(whiteDew.foodIds.includes(f.id));assert.ok(!previous.foodIds.includes(f.id));
 assert.equal(whiteDew.repeated,15);assert.equal(whiteDew.count,30);assert.equal(whiteDew.requiredAdditionalFoodsNotInPreviousTerm,0);
});
