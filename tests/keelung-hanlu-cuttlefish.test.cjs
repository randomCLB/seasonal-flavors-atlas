'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));

test('基隆寒露目贼保留农业部节气渔讯与乌贼俗名映射，且只进入寒露名单',()=>{
 const food=ctx.window.FOODS.find(x=>x.id==='keelung-hanlu-cuttlefish'),profile=ctx.window.LOTTERY_PROFILES['keelung-hanlu-cuttlefish'];
 assert.ok(food);assert.deepEqual([...food.peakTerms],[18]);assert.equal(food.seasonBasis,'fishery');
 assert.ok(food.sources.some(x=>x[1].includes('fae.moa.gov.tw/theme_data.php?id=26')));
 assert.ok(food.sources.some(x=>x[1].includes('keyword=sepia')));assert.ok(food.description.includes('不是锁管小卷'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),hanlu=audit.rows.find(x=>x.term==='寒露'),qiufen=audit.rows.find(x=>x.term==='秋分');
 assert.ok(hanlu.foodIds.includes(food.id));assert.ok(!qiufen.foodIds.includes(food.id));
});
