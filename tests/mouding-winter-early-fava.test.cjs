const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root=require('node:path').join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(require('node:path').join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='mouding-winter-early-fava'),profile=ctx.window.LOTTERY_PROFILES['mouding-winter-early-fava'];
test('Mouding winter fava beans use the reported month-level harvest and distinguish fresh pods',()=>{
 assert.ok(food);assert.equal(food.peakMonths.join(','),'11');assert.equal(food.seasonStartTerm,20);assert.match(food.season,/十一月采收/);assert.match(food.season,/不提供具体开采日/);
 assert.match(food.buy,/鲜荚/);assert.match(food.pitfall,/干蚕豆/);assert.ok(food.steps.length>=3);assert.ok(food.sources.some(source=>source[1]==='https://www.mdx.gov.cn/info/1040/336735.htm'));
 assert.ok(fs.existsSync(require('node:path').join(root,'dist',food.image)));assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
});
