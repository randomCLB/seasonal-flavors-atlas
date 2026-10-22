'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
test('Dongshan fresh longan is limited to its documented August peak batch',()=>{
 const C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const food=ctx.window.FOODS.find(item=>item.id==='tainan-dongshan-fresh-longan');assert.ok(food);assert.deepEqual(Array.from(food.entryTerms),[14]);assert.equal(JSON.stringify(food.peakWindows),JSON.stringify([['08-14','08-22']]));assert.match(food.season,/八月中旬鲜果批次/);assert.match(food.season,/晚熟品种则在九月上市/);assert.match(food.description,/鲜龙眼/);assert.match(food.description,/龙眼干/);assert.ok(food.sources.some(item=>item[1]==='https://dongshan.tainan.gov.tw/News_Content.aspx?n=6629&s=72758'));assert.ok(food.sources.some(item=>item[1]==='https://srb.afa.gov.tw/index.php?article_id=21566&code=list&flag=detail&ids=3370'));assert.match(food.imageCaption,/不是东山实拍/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-profiles.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(root,'dist','lottery-senses.js'),'utf8'),ctx);assert.equal(ctx.window.LOTTERY_PROFILES[food.id].signature,C.signature(food));assert.equal(ctx.window.LOTTERY_PROFILES[food.id].senses.signature,C.sensorySignature(food));
 const events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES);assert.equal(C.isPeakDay(food,'2026-08-14',events),true);assert.equal(C.isPeakDay(food,'2026-08-23',events),false);
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),row=audit.rows.find(item=>item.term==='立秋');assert.ok(row.foodIds.includes(food.id));assert.equal(row.withinLimit,true);
});
