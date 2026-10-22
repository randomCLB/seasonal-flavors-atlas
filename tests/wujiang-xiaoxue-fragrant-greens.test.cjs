'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Wujiang fragrant greens use a sourced Xiaoxue entry, honest winter window and current tarot signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(x=>x.id==='wujiang-xiaoxue-fragrant-greens'),C=require('../dist/lottery-core.js'),p=ctx.window.LOTTERY_PROFILES[f.id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[21]);assert.deepEqual(Array.from(f.entryTerms),[21]);assert.equal(f.seasonStartTerm,21);assert.match(f.season,/12月初长成/);assert.match(f.season,/不是说它只在小雪有/);assert.match(f.description,/不是本站试吃/);
 assert.ok(f.sources.some(x=>x[1]==='https://www.suzhou.gov.cn/szsrmzf/szyw/202508/71a0b390ad12488b90e3761b40359c73.shtml'));assert.ok(f.procurement.checks.some(x=>x.includes('鲜菜')));assert.match(f.imageCaption,/非吴江产地实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),snow=audit.rows.find(x=>x.term==='小雪');assert.ok(snow.foodIds.includes(f.id));assert.ok(!audit.rows.find(x=>x.term==='立冬').foodIds.includes(f.id));
});

test('Yinzhou snow mustard is a sourced Xiaoxue winter-crop harvest entry, distinct from pickled greens',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='ningbo-yinzhou-xiaoxue-fresh-snow-mustard',f=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[21]);assert.match(f.season,/冬菜.*小雪前后采收/);assert.match(f.description,/腌制后的咸齑是另一种商品状态/);assert.match(f.taste,/没有描述鲜菜/);
 assert.ok(f.sources.some(x=>x[1]==='https://taste.taoliapp.com/geo-product/yin-zhou-xue-cai'));assert.ok(f.procurement.checks.some(x=>x.includes('鲜菜状态')));assert.match(f.imageCaption,/非宁波实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),snow=audit.rows.find(x=>x.term==='小雪');assert.ok(snow.foodIds.includes(id));assert.ok(!audit.rows.find(x=>x.term==='立冬').foodIds.includes(id));
});
