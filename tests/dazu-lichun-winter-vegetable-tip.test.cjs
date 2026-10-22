'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Dazu winter vegetable tip is a sourced Lichun ingredient distinct from fermented winter vegetable',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='dazu-lichun-winter-vegetable-tip');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[2]);assert.deepEqual(Array.from(f.peakMonths),[2]);assert.match(f.season,/立春采收/);assert.match(f.description,/鲜原料/);assert.match(f.description,/发酵/);assert.match(f.procurement.checks.join(''),/鲜菜尖原料/);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.ok(f.sources.some(s=>s[1]==='https://jda.cq.gov.cn/web/article/web/content_1461657080928624640.html'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['立春'].includes(f.id));assert.ok(!pools['大寒'].includes(f.id));assert.ok(!pools['雨水'].includes(f.id));
});
