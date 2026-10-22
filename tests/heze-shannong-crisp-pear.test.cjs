'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..');
test('Heze Shannong pear is a sourced late-October maturity entry unique to Frost Descent',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),f=ctx.window.FOODS.find(x=>x.id==='heze-shannong-crisp-pear');assert.ok(f);assert.deepEqual(Array.from(f.peakWindows[0]),['10-24','10-31']);assert.match(f.season,/十月下旬成熟/);assert.match(f.procurement.checks.join(''),/山农酥梨品种/);assert.match(f.imageCaption,/不代表菏泽产地或山农酥梨品种实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.ok(f.sources.some(x=>x[1]==='https://www.forestry.gov.cn/c/www/dfdt/587884.jhtml'));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),frost=audit.rows.find(x=>x.term==='霜降'),hanlu=audit.rows.find(x=>x.term==='寒露');assert.ok(frost.foodIds.includes(f.id));assert.ok(!hanlu.foodIds.includes(f.id));
});
