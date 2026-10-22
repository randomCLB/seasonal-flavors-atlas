'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),audit=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/audit-term-repetition.cjs'),'2026'],{encoding:'utf8'}));
test('Huairou Hongxiaoli pear follows the documented mid-to-late October harvest window',()=>{
 const ctx={window:{}};const vm=require('node:vm');vm.createContext(ctx);
 for(const file of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file+'.js'),'utf8'),ctx);
 const f=ctx.window.FOODS.find(item=>item.id==='huairou-huaibei-hongxiaoli'),p=ctx.window.LOTTERY_PROFILES['huairou-huaibei-hongxiaoli'];assert.ok(f);assert.equal(f.name,'怀柔红肖梨');assert.deepEqual(Array.from(f.peakWindows[0]),['10-15','10-31']);assert.ok(f.sources.some(x=>x[1]==='https://yllhj.beijing.gov.cn/ztxx/jhgm/ggczgy/202509/t20250926_4211571.shtml'));assert.ok(f.sources.some(x=>x[1]==='https://www.bjwmb.gov.cn/wmdt/hrq/10081596.html'));assert.match(f.season,/不代表2026年具体采收或库存/);assert.match(f.imageCaption,/通用梨实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(p.signature,require('../dist/lottery-core.js').signature(f));assert.equal(p.senses.signature,require('../dist/lottery-core.js').sensorySignature(f));
 const hanlu=audit.rows.find(row=>row.term==='寒露'),frost=audit.rows.find(row=>row.term==='霜降');assert.ok(hanlu.foodIds.includes(f.id));assert.ok(frost.foodIds.includes(f.id));assert.ok(!audit.rows.find(row=>row.term==='秋分').foodIds.includes(f.id));;
});
