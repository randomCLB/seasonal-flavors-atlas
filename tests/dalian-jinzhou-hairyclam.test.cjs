'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='dalian-jinzhou-hairyclam');

test('Dalian Jinzhou hairy clam uses the sourced early-winter tasting cue and safe preparation',()=>{
 assert.ok(food);assert.equal(food.category,'seafood');assert.equal(food.peakTerms.join(','),'20');assert.equal(food.seasonStartTerm,20);
 assert.match(food.season,/秋季上市、初冬食用最佳/);assert.match(food.season,/不表示采捕或市场供应只持续到立冬/);
 assert.match(food.safety,/彻底煮熟煮透/);assert.match(food.safety,/严禁生食或半生食/);
 assert.ok(food.sources.some(source=>source[1]==='https://jgs.agri.gov.cn/detail/zh/39871.html'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const lidong=audit.rows.find(row=>row.term==='立冬');assert.ok(lidong.foodIds.includes(food.id));assert.ok(!audit.rows.find(row=>row.term==='小雪').foodIds.includes(food.id));
 ;
});
