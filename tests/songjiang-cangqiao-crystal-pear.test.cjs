'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));

test('松江仓桥水晶梨以大暑晚熟批次入选，保留品种和采期差异',()=>{
 const food=ctx.window.FOODS.find(x=>x.id==='songjiang-cangqiao-crystal-pear'),profile=ctx.window.LOTTERY_PROFILES['songjiang-cangqiao-crystal-pear'];
 assert.ok(food);assert.deepEqual([...food.peakTerms],[13]);assert.equal(food.seasonBasis,'harvest');
 assert.ok(food.sources.some(x=>x[1].includes('songjiang.gov.cn/xwzx/001001/20230713/')));assert.ok(food.sources.some(x=>x[1].includes('nyncw.sh.gov.cn/mtbd/20260724/')));
 assert.ok(food.season.includes('早熟'));assert.ok(food.pitfall.includes('不要把七月上旬'));assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),daxu=audit.rows.find(x=>x.term==='大暑'),xiaoshu=audit.rows.find(x=>x.term==='小暑');
 assert.ok(daxu.foodIds.includes(food.id));assert.ok(!xiaoshu.foodIds.includes(food.id));
});
