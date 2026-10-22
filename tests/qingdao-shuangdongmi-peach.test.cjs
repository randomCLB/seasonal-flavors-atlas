'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='qingdao-shuangdongmi-peach');

test('Qingdao Shuangdongmi is a sourced ultra-late peach cultivar with a transparent early-November entry',()=>{
 assert.ok(food);assert.equal(food.category,'fruit');assert.deepEqual(Array.from(food.peakTerms),[20]);assert.equal(food.seasonStartTerm,20);
 assert.match(food.season,/11月上旬成熟/);assert.match(food.season,/不保证2026年仍有商品供应/);
 assert.match(food.description,/冬雪蜜桃/);assert.match(food.imageCaption,/非实物摄影/);
 assert.ok(food.sources.some(source=>source[1]==='https://yyxy.qau.edu.cn/content/gzdt/6c2ad6d14cac4f068f63d53c807cd714'));
 assert.ok(food.sources.some(source=>source[1]==='https://www.ahs.ac.cn/CN/abstract/abstract6221.shtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const frost=audit.rows.find(row=>row.term==='霜降'),lidong=audit.rows.find(row=>row.term==='立冬');
 assert.ok(!frost.foodIds.includes(food.id));assert.ok(lidong.foodIds.includes(food.id));
 ;
});
