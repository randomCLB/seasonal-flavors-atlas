'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Suao Jingzhe fishery names retain source limits and appear only in Jingzhe',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),ids=['suao-jingzhe-huahui','suao-jingzhe-muhou','suao-jingzhe-dingmian','keelung-jingzhe-jiaranyu','keelung-jingzhe-wenyu'];
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const jingzhe=audit.rows.find(row=>row.term==='惊蛰'),rain=audit.rows.find(row=>row.term==='雨水'),equinox=audit.rows.find(row=>row.term==='春分');
 for(const id of ids){
  const food=ctx.window.FOODS.find(row=>row.id===id),profile=ctx.window.LOTTERY_PROFILES[id];assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[4]);assert.match(food.region,/台湾(宜兰 · 苏澳|基隆 · 基隆)/);
  assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
  assert.match(food.season,/不提供物种鉴定/);assert.match(food.safety,/无法确认时不要食用/);assert.equal(food.flavor.length,0);
  assert.ok(food.sources.some(source=>source[1]==='https://www.moa.gov.tw/ws.php?id=2507775'));
  assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非鱼种或产地鉴别/);
  assert.ok(jingzhe.foodIds.includes(id));assert.ok(!rain.foodIds.includes(id));assert.ok(!equinox.foodIds.includes(id));
 }
 assert.equal(jingzhe.count,32);assert.equal(jingzhe.repeated,16);assert.equal(jingzhe.requiredAdditionalFoodsNotInPreviousTerm,0);assert.equal(audit.catalogCount,ctx.window.FOODS.length);assert.ok(jingzhe.foodIds.includes('linan-early-spring-leizun'));
});
