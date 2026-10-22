'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Miaoli fresh jujube is a sourced Daxu selection with its wider harvest season retained',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='miaoli-gongguan-fresh-jujube');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[13]);assert.deepEqual(Array.from(f.peakMonths),[7,8]);assert.match(f.season,/七月中旬至八月上旬/);assert.match(f.season,/详情保留完整产期/);assert.match(f.description,/鲜果与常见全年供应的红枣干/);assert.ok(f.procurement.checks.length>=3);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.ok(f.sources.some(s=>s[1]==='https://fae.moa.gov.tw/map/food_item.php?id=377&type=AS08'));assert.ok(f.sources.some(s=>s[1]==='https://fae.moa.gov.tw/files/topics/1150/A02_2.pdf'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['大暑'].includes(f.id));assert.ok(!pools['小暑'].includes(f.id));assert.ok(!pools['立秋'].includes(f.id));
});
