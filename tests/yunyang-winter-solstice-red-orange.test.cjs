'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));

test('云阳红橙以来源明确的冬至成熟批次入选，通用插画不冒充产地实拍',()=>{
 const id='yunyang-winter-solstice-red-orange',food=ctx.window.FOODS.find(x=>x.id===id),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual([...food.peakTerms],[23]);assert.equal(food.seasonPrecision,'local-term-feature');assert.equal(food.seasonBasis,'harvest');
 assert.ok(food.sources.some(x=>x[1]==='https://e.weather.com.cn/news/2024/12/4007299.shtml'));assert.ok(food.sources.some(x=>x[1]==='https://nyncw.cq.gov.cn/zwxx_161/qxlb/202412/t20241223_14009787.html'));
 assert.match(food.season,/冬至期间成熟/);assert.match(food.pitfall,/多个品种/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const a=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),dongzhi=a.rows.find(x=>x.term==='冬至'),daxue=a.rows.find(x=>x.term==='大雪');
 assert.ok(dongzhi.foodIds.includes(id));assert.ok(!daxue.foodIds.includes(id));
});
