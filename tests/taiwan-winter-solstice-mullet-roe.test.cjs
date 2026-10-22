'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=require('node:path').join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(require('node:path').join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(require('node:path').join(root,'dist/lottery-core.js'));

test('台湾冬至乌鱼子是来源明确的加工鱼卵条目，冬至独有入选且抽签签名有效',()=>{
 const food=ctx.window.FOODS.find(x=>x.id==='taiwan-winter-solstice-mullet-roe'),profile=ctx.window.LOTTERY_PROFILES[food.id];
 assert.ok(food);assert.equal(food.peakTerms.join(','),'23');assert.equal(food.seasonBasis,'harvest');assert.ok(food.sources.some(x=>x[1].includes('fae.moa.gov.tw')));assert.ok(food.safety.includes('鱼类过敏'));
 assert.ok(fs.existsSync(require('node:path').join(root,'dist',food.image)));assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),solstice=audit.rows.find(x=>x.term==='冬至'),daxue=audit.rows.find(x=>x.term==='大雪');
 assert.ok(solstice.foodIds.includes(food.id));assert.ok(!daxue.foodIds.includes(food.id));
});
