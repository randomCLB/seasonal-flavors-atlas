'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Guangzhou Qingming jiaocai and Panyu Qingming sugarcane are sourced term-exclusive entries with matched real photographs',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const C=require('../dist/lottery-core.js'),ids=['guangzhou-qingming-jiaocai','panyu-qingming-sugarcane'];
 for(const id of ids){
  const food=ctx.window.FOODS.find(x=>x.id===id),profile=ctx.window.LOTTERY_PROFILES[id];assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[6]);assert.deepEqual(Array.from(food.entryTerms),[6]);assert.equal(food.seasonPrecision,'historical-term-record');assert.equal(food.image,food.cardImage);assert.equal(food.image,food.tarotImage.src);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非/);assert.match(food.seasonEvidence,/2025年|地方/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 }
 const greens=ctx.window.FOODS.find(x=>x.id===ids[0]),cane=ctx.window.FOODS.find(x=>x.id===ids[1]);
 assert.ok(greens.sources.some(x=>x[1]==='https://www.by.gov.cn/zwgk/zdlyxxgkzl/whjgxxgkzl/whggwgk/gzxx/content/post_4737388.html'));assert.match(greens.description,/菜荞与头荞/);assert.match(greens.comparison.text,/菜荞和头荞/);
 assert.ok(cane.sources.some(x=>x[1]==='https://news.dayoo.com/guangzhou/202504/04/139995_54808336.htm'));assert.match(cane.season,/不表示甘蔗只在清明上市/);assert.match(cane.description,/嚼汁后吐渣/);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),term=audit.rows.find(x=>x.term==='清明'),previous=audit.rows.find(x=>x.term==='春分');
 assert.equal(audit.catalogCount,ctx.window.FOODS.length);assert.ok(ids.every(id=>term.foodIds.includes(id)));assert.ok(ids.every(id=>!previous.foodIds.includes(id)));assert.equal(term.count,32);assert.equal(term.repeated,16);assert.equal(term.repeatRate,.5);assert.equal(term.withinLimit,true);
});
