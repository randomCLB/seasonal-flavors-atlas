'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Wusheng Dayagan is a sourced Lichun opening-harvest entry with reviewed tarot signatures',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='wusheng-dayagan-lichun',f=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[2]);assert.deepEqual(Array.from(f.entryTerms),[2]);assert.match(f.season,/立春日开园/);assert.match(f.pitfall,/立春是报道中的开园节点/);assert.ok(f.sources.some(x=>x[1]==='https://www.wusheng.gov.cn/gasylbzj/c109531/pc/content/content_1717527067924312064.html'));assert.match(f.imageCaption,/不用于品种或产地鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),lichun=audit.rows.find(x=>x.term==='立春');assert.ok(lichun.foodIds.includes(id));assert.ok(!audit.rows.find(x=>x.term==='雨水').foodIds.includes(id));
});
