'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Taiwan Daxue Korean seerfish maps the sourced 闊腹 name to the correct species and term',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='taiwan-daxue-korean-seerfish');assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[22]);assert.deepEqual(Array.from(f.entryTerms),[22]);assert.match(f.description,/Scomberomorus koreanus/);assert.match(f.description,/混作同一鱼种/);assert.match(f.season,/不代表当年渔获/);assert.ok(f.procurement.checks.length>=3);assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.ok(f.sources.some(s=>s[1]==='https://fae.moa.gov.tw/theme_data.php?id=32&sub_theme=knowledge&theme=topics'));assert.ok(f.sources.some(s=>s[1]==='https://kmweb.moa.gov.tw/theme_data.php?id=650&theme=fisheasy'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['大雪'].includes(f.id));assert.ok(!pools['小雪'].includes(f.id));assert.ok(!pools['冬至'].includes(f.id));
});
