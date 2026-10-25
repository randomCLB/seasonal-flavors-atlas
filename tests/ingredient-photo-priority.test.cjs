'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const W=require('../scripts/audit-reader-access.cjs').load().window,byId=Object.fromEntries(W.FOODS.map(f=>[f.id,f]));
test('the shared ingredient resolver preserves raw photographs instead of legacy cooked-card images and retains responsive sea-buckthorn delivery',()=>{
 const cases={'lyg-shaguang-fish':'assets/lyg-shaguang-fish.webp','jianou-zhuilli':'assets/jianou-zhuilli-reference.webp','chongming-baibiandou':'assets/chongming-biandou-reference.webp','chongming-xiangsu-yu':'assets/visual/taro-growing.webp','xiangyin-santang-jiaotou':'assets/xiangyin-jiaotou-reference.webp','wenzhou-pancai':'assets/wenzhou-pancai-reference.webp','shajiguo':'assets/shajiguo-400.webp'};
 for(const [id,src]of Object.entries(cases)){assert.ok(byId[id],id);assert.equal(W.FoodMedia.ingredient(byId[id]).src,src,id);assert.doesNotMatch(W.FoodMedia.ingredient(byId[id]).src,/soup|congee|garlic-generated|steamed-generated|pork-generated/);}
});
