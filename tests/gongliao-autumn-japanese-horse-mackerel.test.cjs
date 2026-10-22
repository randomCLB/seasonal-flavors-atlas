'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Gongliao Japanese horse mackerel is a sourced Autumn Equinox tasting entry with transparent catch limits',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='gongliao-autumn-japanese-horse-mackerel');assert.ok(f);assert.deepEqual(Array.from(f.entryTerms),[17]);assert.deepEqual(Array.from(f.peakTerms),[17]);assert.match(f.season,/7—9月/);assert.match(f.season,/不代表当年渔获/);assert.ok(f.procurement.checks.length>=3);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.ok(f.sources.some(s=>s[1]==='https://fishery.ntpc.gov.tw/cht/index.php/upload/cht/article/index.php?article_id=1404&code=list&flag=detail&ids=20'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['秋分'].includes(f.id));assert.ok(!pools['白露'].includes(f.id));
});
