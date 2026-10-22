'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),ctx={window:{}};
vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const additions=ctx.window.FOODS.slice(-18),byId=new Map(additions.map(food=>[food.id,food]));

test('18 sourced seasonal records close the four adjacent-term gaps and remain eligible for draws',()=>{
 assert.equal(additions.length,18);
 assert.equal(new Set(additions.map(food=>food.id)).size,18);
 for(const food of additions){
  assert.equal(food.peakTerms.length,1,food.id);
  assert.equal(food.peakTerms[0],food.seasonStartTerm,food.id);
  assert.equal(food.seasonPrecision,'historical-term-record',food.id);
  assert.ok(food.sources.length&&/^https:\/\//.test(food.sources[0][1]),food.id);
  assert.ok(food.search&&food.buy&&food.recipeTitle&&food.steps.length,food.id);
  assert.ok(!food.image||fs.existsSync(path.join(root,'dist',food.image)),food.id);
  const profile=ctx.window.LOTTERY_PROFILES[food.id];
  assert.ok(C.eligible(food,profile,{avoid:[],tastes:[],textures:[],cooking:[],curiosity:2},new Set()),food.id);
 }
 const expected=[
  ['小寒','tengchong-fenghuang-xiaohan-yam','hezhou-xialiang-xiaohan-goji-greens','luocheng-dafu-xiaohan-black-wood-ear','ganyu-zhaohu-xiaohan-greenhouse-strawberry','yingde-langbu-xiaohan-red-pine-mushroom','jiangan-changsha-xiaohan-early-tea-first-pick','nanxian-wushenggong-xiaohan-caitai'],
  ['大寒','yulin-xiaohan-sesame-melon','danling-great-cold-late-citrus','suixian-lishan-great-cold-shiitake','lianjiang-great-cold-abalone','lianjiang-great-cold-kelp-seedlings'],
  ['芒种','jinghe-bajiahu-mangzhong-pearl-nectarine','dazhou-tanzi-mangzhong-green-plum-last-pick','suzhou-dongshan-xidi-mangzhong-fine-stem-waxberry','wuxi-mashan-mangzhong-yangmei'],
  ['小暑','lianjiang-xiaoshu-june-hemp-bamboo-shoot','hejiang-xiaoshu-late-lychee'],
 ];
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 assert.equal(audit.overLimit,0);
 for(const [term,...ids] of expected){const row=audit.rows.find(item=>item.term===term);for(const id of ids)assert.ok(row.foodIds.includes(id),`${term} should include ${id}`);}
 assert.equal(byId.get('lianjiang-xiaoshu-june-hemp-bamboo-shoot').peakTerms[0],12);
});
