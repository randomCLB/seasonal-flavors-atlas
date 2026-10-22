'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),ctx={window:{FengwuLottery:C}};vm.createContext(ctx);
for(const n of ['solar-terms','data','winter-additions','editorial','editorial-notes','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8'),ctx);
const f=JSON.parse(JSON.stringify(ctx.window.FOODS.find(x=>x.id==='tongling-white-ginger'))),p=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES['tongling-white-ginger']));

test('Tongling white ginger has local harvest evidence, edible use and non-identification photo credit',()=>{
 assert.ok(f);assert.equal(C.signature(f),p.signature);assert.equal(C.sensorySignature(f),p.senses.signature);
 assert.deepEqual(Array.from(f.peakTerms),[16]);assert.match(f.season,/9月中旬.*10月下旬/);
 assert.ok(f.sources.some(([title,url])=>/铜陵市农业农村局/.test(title)&&url.includes('nyncj.tl.gov.cn')));
 assert.ok(f.sources.some(([title,url])=>/地理标志/.test(title)&&url.includes('m.cqn.com.cn')));
 assert.ok(f.steps.length>=3&&f.buy&&f.storage&&f.safety&&f.ingredients);
 assert.match(f.imageCaption,/通用根茎参考/);assert.match(f.imageCaption,/不作铜陵白姜品种或产地识别/);
 assert.ok(fs.statSync(path.join(root,'dist',f.image)).size>10000);
});

test('White Dew additions are term-scoped and the latest entry reduces the audited repeat gap',()=>{
 const audit=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/audit-term-repetition.cjs'),'2026'],{encoding:'utf8'}));
 const whiteDew=audit.rows.find(row=>row.term==='白露'),previous=audit.rows.find(row=>row.term==='处暑');
 assert.ok(whiteDew.foodIds.includes('miaoli-xihu-wendan'));assert.ok(whiteDew.foodIds.includes(f.id));
 assert.ok(!previous.foodIds.includes('miaoli-xihu-wendan'));assert.ok(!previous.foodIds.includes(f.id));
 assert.equal(whiteDew.repeated,15);assert.equal(whiteDew.count,30);assert.equal(whiteDew.requiredAdditionalFoodsNotInPreviousTerm,0);
});
