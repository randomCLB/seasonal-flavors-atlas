'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'../dist'),C=require('../dist/lottery-core.js'),context={window:{}};
for(const name of ['data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions'])vm.runInNewContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'),context);
const before=JSON.parse(JSON.stringify(context.window.FOODS));
vm.runInNewContext(fs.readFileSync(path.join(root,'editorial-copy.js'),'utf8'),context);
const after=JSON.parse(JSON.stringify(context.window.FOODS));
test('card names and summaries use food language rather than collection or procurement instructions',()=>{
 const apple=after.find(f=>f.id==='qixia-lidong-winter-after-apple');
 assert.equal(apple.name,'冬后苹果');assert.match(apple.short,/甜/);assert.match(apple.short,/切瓣/);
 for(const food of after){
  assert.doesNotMatch(food.name,/批次|采收记录|渔讯|试验|专题|早市/,food.id);
  assert.doesNotMatch(food.short,/核对|批次|记录|报道|资料|渔讯|不代表|参考|未实测|先问|合为一篇|线索|标准描述|待核|身份|认准|现场|试验/,food.id);
  assert.ok(food.short.length<=55,food.id);
 }
});
test('editorial changes preserve original IDs, season evidence, recipes, sources and draw signatures',()=>{
 assert.equal(after.length,before.length);
 for(let i=0;i<before.length;i++){
  const original=before[i],revised=after[i];assert.equal(C.signature(revised),C.signature(original),revised.id);assert.equal(C.sensorySignature(revised),C.sensorySignature(original),revised.id);
  const protectedFields=food=>Object.fromEntries(Object.entries(food).filter(([key])=>!['name','short'].includes(key)));
  assert.deepEqual(protectedFields(revised),protectedFields(original),revised.id);
 }
});
test('all entrypoints apply the same editorial copy after the complete catalog and before readers',()=>{
 for(const page of ['index.html','tarot.html','lottery.html']){
  const scripts=[...fs.readFileSync(path.join(root,page),'utf8').matchAll(/<script src="([^"?]+)/g)].map(m=>m[1]);
  assert.equal(scripts.filter(s=>s==='editorial-copy.js').length,1,page);
  assert.ok(scripts.indexOf('editorial-copy.js')>scripts.indexOf('term-gap-additions.js'),page);
  assert.ok(scripts.indexOf('editorial-copy.js')<scripts.indexOf('photo-review.js'),page);
 }
});
test('reader naming separates location and retains identified cultivar notation',()=>{
 const byId=Object.fromEntries(after.map(f=>[f.id,f]));
 for(const [id,name] of [['luoping-hongguoshen','红果参'],['huangbohai-yingzhuaxia','蛎虾（鹰爪虾）'],['qingdao-shuangdongmi-peach','“双冬蜜”极晚熟桃'],['binchuan-renong1-yuganzi','“热农1号”余甘子'],['qixia-lidong-winter-after-apple','冬后苹果']])assert.equal(byId[id].name,name,id);
 assert.equal(context.window.READER_OLD_NAMES['luoping-hongguoshen'],'罗平红果参');
});
test('source observations and previously overlooked geographic product labels use the reader naming rule',()=>{
 const byId=Object.fromEntries(after.map(f=>[f.id,f]));
 for(const [id,name] of [['nanhu-ling','菱'],['weixian-frost-radish','萝卜'],['banan-wubu-pomelo','柚子'],['xihu-longjing-group-late-march','龙井茶（群体种）'],['hanzhong-qingming-xiangchun-shoots','香椿芽'],['suao-frost-beltfish','白带鱼'],['taiwan-lidong-east-jiana-fish','真鲷（加纳鱼）']]){
  assert.equal(byId[id].name,name,id);assert.notEqual(context.window.READER_OLD_NAMES[id],name,id);
 }
});
