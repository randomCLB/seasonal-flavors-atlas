'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ids=['pearl-river-qingming-cao-shrimp','guangdong-qingming-fengwei-anchovy','guangdong-eighteen-streams-qingming-yellow-brow-fish','beijiang-spring-milk-fish'];
test('Guangdong Qingming river-seafood entries preserve interview scope, local-name uncertainty and draw signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require(path.join(root,'dist/lottery-core.js')),foods=ids.map(id=>ctx.window.FOODS.find(f=>f.id===id));
 assert.ok(foods.every(Boolean));for(const f of foods){assert.deepEqual(Array.from(f.peakTerms),[6]);assert.deepEqual(Array.from(f.entryTerms),[6]);assert.equal(f.category,'seafood');assert.match(f.season,/2025年/);assert.match(f.season,/不承诺|不推断|未提供|不证明/);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));assert.ok(f.sources.some(x=>x[1]==='https://huacheng.gz-cmc.com/pages/2025/04/01/SF136133875ee5eacfabd34c57a3bab0.html'));}
 const shrimp=foods[0];assert.match(shrimp.comparison.text,/不是某一种虾/);assert.match(foods[2].comparison.text,/梅童鱼/);assert.match(foods[3].comparison.text,/不足以核实物种学名/);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),qingming=audit.rows.find(x=>x.term==='清明'),spring=audit.rows.find(x=>x.term==='春分');assert.equal(qingming.repeatRate,.5);assert.ok(ids.every(id=>qingming.foodIds.includes(id)));assert.ok(ids.every(id=>!spring.foodIds.includes(id)));assert.equal(audit.overLimit,audit.rows.filter(row=>!row.withinLimit).length);
});
