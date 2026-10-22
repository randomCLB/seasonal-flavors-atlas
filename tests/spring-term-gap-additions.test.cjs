'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',`${name}.js`),'utf8'),ctx);
const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
test('rainwater market fish, spring-equinoctial cotton grass and Guyu tea retain precise source limits',()=>{
 const rows=[
  ['suzhou-rainwater-caihua-tangli','雨水',3,'https://nyncj.suzhou.gov.cn/nlj/zwyw/202402/a8bc51a34b9a4818a30428edf3bd8054.shtml'],
  ['dujiangyan-spring-equinox-cotton-grass','春分',5,'https://www.shiquan.gov.cn/Content-2685753.html'],
  ['lanshan-baidieling-guyu-tea','谷雨',7,'https://www.lanshan.gov.cn/lsxwgj/0200/202204/9d0b22c6709647218fb5f666c4482147.shtml']
 ];
 for(const [id,term,index,source] of rows){
  const food=ctx.window.FOODS.find(item=>item.id===id),profile=ctx.window.LOTTERY_PROFILES[id],row=audit.rows.find(item=>item.term===term);
  assert.ok(food,id);assert.ok(profile,id);assert.deepEqual(Array.from(food.peakTerms),[index]);assert.ok(food.sources.some(item=>item[1]===source));assert.ok(row.foodIds.includes(id));assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 }
 const fish=ctx.window.FOODS.find(item=>item.id===rows[0][0]),herb=ctx.window.FOODS.find(item=>item.id===rows[1][0]),tea=ctx.window.FOODS.find(item=>item.id===rows[2][0]);
 assert.match(fish.season,/2024年市场报道/);assert.match(fish.description,/来货包括高淳、沭阳、湖北、安徽/);assert.match(herb.season,/未给多年采期/);assert.match(herb.safety,/不要自行采摘/);assert.match(tea.season,/2022年报道/);assert.match(tea.taste,/不补写香型或甜度/);
 const spring=audit.rows.find(item=>item.term==='春分'),rain=audit.rows.find(item=>item.term==='雨水'),guyu=audit.rows.find(item=>item.term==='谷雨');
 ;assert.equal(spring.withinLimit,true);assert.equal(rain.withinLimit,true);assert.equal(guyu.withinLimit,true);
 ;assert.equal(audit.overLimit,audit.rows.filter(row=>!row.withinLimit).length);
});
