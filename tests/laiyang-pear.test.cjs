const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require('../dist/lottery-core.js'),food=ctx.window.FOODS.find(item=>item.id==='laiyang-pear'),profile=ctx.window.LOTTERY_PROFILES['laiyang-pear'];
test('Laiyang pear is limited to the source-recommended Cold Dew-to-Frost-Descent interval',()=>{
 assert.ok(food);assert.equal(food.peakWindows[0].join(','),'10-08,10-22');assert.equal(food.seasonStartTerm,18);assert.match(food.season,/寒露至霜降期间/);assert.match(food.season,/近似映射/);
 assert.ok(food.sources.some(source=>source[1]==='https://www.yantai.gov.cn/col/col12814/art/2026/art_0e08d98b7e3b4fd5a696a5ef048e4611.html'));
 assert.match(food.pitfall,/储藏果/);assert.ok(food.procurement.checks.length>=2);assert.ok(food.steps.length>=3);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
});
test('Laiyang pear uses the licensed generic pear photo across food and tarot views',()=>{
 assert.equal(food.image,'assets/taixing-sucui1-generic-dusan-bicanski-pd.jpg');assert.equal(food.cardImage,food.image);assert.equal(food.tarotImage.src,food.image);assert.match(food.imageAlt,/非莱阳产地/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
});
