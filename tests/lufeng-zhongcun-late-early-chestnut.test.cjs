'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));

test('禄丰中村早熟板栗按七月下旬后续批次进入大暑，不冒充整季独有',()=>{
 const food=ctx.window.FOODS.find(x=>x.id==='lufeng-zhongcun-late-early-chestnut'),profile=ctx.window.LOTTERY_PROFILES['lufeng-zhongcun-late-early-chestnut'];
 assert.ok(food);assert.deepEqual([...food.peakTerms],[13]);assert.equal(food.seasonBasis,'harvest');
 assert.ok(food.sources.some(x=>x[1]==='https://ynlf.gov.cn/info/1042/137184.htm'));assert.match(food.season,/七月下旬至八月中下旬/);assert.match(food.comparison.text,/七月中旬/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),daxu=audit.rows.find(x=>x.term==='大暑'),xiaoshu=audit.rows.find(x=>x.term==='小暑');
 assert.ok(daxu.foodIds.includes(food.id));assert.ok(!xiaoshu.foodIds.includes(food.id));
});
