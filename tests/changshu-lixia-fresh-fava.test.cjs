'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Changshu fresh fava beans are a Lixia local-market entry with a multi-year, approximate window',()=>{
 const ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(item=>item.id==='changshu-lixia-fresh-fava'),C=require('../dist/lottery-core.js');
 assert.ok(ctx.window.FOODS.every(item=>Array.isArray(item.placeSeasons)),'every homepage food needs a place-season list for map initialization');
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[8]);assert.equal(food.seasonBasis,'local-market-window');assert.equal(food.seasonPrecision,'recurring-reported-window');assert.equal(food.sourceYears,undefined);
 assert.match(food.season,/立夏前后/);assert.match(food.season,/气候提前/);assert.match(food.description,/鲜荚、冷冻豆米和干蚕豆/);assert.match(food.imageCaption,/非实物|非.*实拍/);
 assert.ok(food.sources.some(item=>item[1]==='https://news.2500sz.com/doc/2022/05/15/848990.shtml'));
 assert.ok(food.sources.some(item=>item[1]==='https://nyncj.suzhou.gov.cn/nlj/zwyw/202404/06d57e7730a8451293184209b19dca19.shtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);
 assert.equal(ctx.window.LOTTERY_PROFILES[food.id].signature,C.signature(food));assert.equal(ctx.window.LOTTERY_PROFILES[food.id].senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const lixia=audit.rows.find(row=>row.term==='立夏'),previous=audit.rows.find(row=>row.term===lixia.previousTerm),next=audit.rows.find(row=>row.index===9);
 assert.ok(lixia.foodIds.includes(food.id));assert.ok(!previous.foodIds.includes(food.id));assert.ok(!next.foodIds.includes(food.id));assert.equal(lixia.withinLimit,true);
});
