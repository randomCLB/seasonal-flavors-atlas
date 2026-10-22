'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('獐子岛大雪海参仅记录有来源的历史采捕民俗，不承诺当年供货',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='zhangzidao-daxue-sea-cucumber');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[22]);assert.deepEqual(Array.from(f.entryTerms),[22]);assert.match(f.season,/历史节气与采捕活动关联/);assert.match(f.season,/不保证.*市场供应/);assert.match(f.pitfall,/养殖方式/);assert.ok(f.procurement.checks.length>=2);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.ok(f.sources.some(s=>s[1]==='https://jgs.agri.gov.cn/detail/zh/39943.html'));assert.ok(f.sources.some(s=>s[1]==='https://news.sina.cn/gn/2016-12-07/detail-ifxypizi9883738.d.html'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),snow=audit.rows.find(row=>row.term==='大雪'),minorSnow=audit.rows.find(row=>row.term==='小雪');assert.ok(snow.foodIds.includes(f.id));assert.ok(!minorSnow.foodIds.includes(f.id));assert.equal(snow.withinLimit,true);
 const core=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-core-batch.cjs'],{cwd:root,encoding:'utf8'}));assert.ok(core.periods.find(period=>period.name==='大雪').candidates.includes(f.id));
});
