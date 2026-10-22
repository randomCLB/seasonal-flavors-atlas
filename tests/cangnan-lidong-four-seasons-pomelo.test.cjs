'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Cangnan four-seasons pomelo is a sourced Lidong harvest entry with reviewed tarot signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='cangnan-lidong-four-seasons-pomelo',f=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[20]);assert.deepEqual(Array.from(f.entryTerms),[20]);assert.match(f.season,/立冬时.*11月上中旬采收/);assert.match(f.description,/不是本站试吃/);assert.ok(f.sources.some(x=>x[1]==='https://www.cnipa.gov.cn/attach/0/20250826010509.pdf'));assert.ok(f.procurement.checks.some(x=>x.includes('苍南产区')));assert.match(f.imageCaption,/非苍南产地实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),lidong=audit.rows.find(x=>x.term==='立冬');assert.ok(lidong.foodIds.includes(id));assert.ok(!audit.rows.find(x=>x.term==='霜降').foodIds.includes(id));
});
