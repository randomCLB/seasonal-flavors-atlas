'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),child=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='guangning-lidong-ma-bamboo-shoot');
test('Guangning Ma bamboo shoot keeps the Lidong harvest observation year explicit',()=>{
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[20]);assert.match(food.season,/2024年地方报道/);assert.match(food.season,/不确认2026年仍有鲜笋/);
 assert.ok(food.sources.some(source=>source[1]==='https://ysln.ycwb.com/content/2024-11/08/content_53042214.html'));
 assert.ok(food.sources.some(source=>source[1]==='https://www.forestry.gov.cn/c/www/gglcy/581736.jhtml'));
 assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const profile=ctx.window.LOTTERY_PROFILES[food.id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(child.execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const frost=audit.rows.find(row=>row.term==='霜降'),lidong=audit.rows.find(row=>row.term==='立冬');assert.ok(!frost.foodIds.includes(food.id));assert.ok(lidong.foodIds.includes(food.id));
 ;
});
