'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {load}=require('../scripts/audit-reader-copy.cjs'),C=require('../dist/lottery-core.js');
function context(){const W=load();W.FoodPurchase=require('../dist/food-purchase.js');W.FoodRecords={render:()=>''};const ctx={window:W};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/food-detail.js'),'utf8'),ctx);return W;}
function render(W,f,similar=[]){return W.FoodDetail.html(f,{recognition:{src:'',alt:'',note:'',fit:'cover'},seasonLabel:f.seasonLabel||'',category:'风物',originHtml:'',similar,imageAttrs:''});}
test('reader copies preserve all canonical safety, evidence, eligibility and draw signatures',()=>{
 const W=context();assert.equal(W.FOODS.length,354);for(const f of W.FOODS){const before=JSON.stringify(f),merged={...f,...W.EDITORIAL_DETAILS?.[f.id]},v=W.ReaderCopy.view(merged);for(const key of ['id','category','months','peakMonths','peakTerms','peakWindows','sourceYears','sources','safety'])assert.equal(JSON.stringify(v[key]),JSON.stringify(merged[key]),f.id+': '+key);assert.equal(JSON.stringify(f),before);assert.equal(C.signature(f),C.signature(JSON.parse(before)));assert.equal(C.sensorySignature(f),C.sensorySignature(JSON.parse(before)));}
});
test('every food renders without empty titles or fixed portions',()=>{
 const W=context();for(const f of W.FOODS){const html=render(W,f);assert.doesNotMatch(html,/\b(?:undefined|NaN)\b|第一次试 · 2 人份|<h[23]>\s*<\/h[23]>|<p[^>]*>\s*<\/p>/,f.id);assert.ok(html.includes(f.name));assert.ok(html.includes('reader-sources'),f.id);assert.doesNotMatch(html,/<section class="reader-next">/,f.id);}
});
test('four directed records render the revised text and meaningful sections',()=>{
 const W=context(),find=id=>W.FOODS.find(f=>f.id===id);
 const plum=render(W,find('zhenning-honey-plum'));assert.match(plum,/果肉紧实酥脆，果香清楚/);assert.doesNotMatch(plum,/本站试吃|官方资料描述|最容易失手|做到什么程度/);
 const greens=render(W,find('wujiang-xiaoxue-fragrant-greens'));assert.match(greens,/清炒吃它的香气和软糯，也适合做咸肉菜饭/);assert.match(greens,/先炒粗菜梗/);assert.match(greens,/菜梗熟软，叶片熟透/);
 const pomelo=render(W,find('cangnan-lidong-four-seasons-pomelo'));assert.match(pomelo,/剥皮分瓣，去籽和厚白络，直接鲜食/);assert.doesNotMatch(pomelo,/最容易失手|做到什么程度|<strong>准备/);
 const walnut=render(W,find('fengqing-xinhua-walnut-flowers'));assert.doesNotMatch(walnut,/<dt>香气<\/dt>/);assert.match(walnut,/摘除花穗/);assert.match(walnut,/浸泡约一天/);assert.match(walnut,/中途换水/);
});
test('blank recipes do not create a dead recipe link and comparison evidence survives hidden prose',()=>{
 const W=context(),f={id:'fixture',name:'测试风物',region:'',short:'可读简介',state:'',sources:[],steps:[],comparison:{text:'',source:'https://example.org/evidence'}};
 const html=render(W,f);assert.doesNotMatch(html,/id="foodRecipe"|data-recipe="true"|<dt>香气/);assert.match(html,/https:\/\/example.org\/evidence/);
});
test('critical preparation and contraindication text is still present in every relevant reader',()=>{
 const W=context();for(const id of ['suzhou-bailu-ginkgo','cizhousun','fengqing-xinhua-walnut-flowers','mouding-winter-early-fava']){const f=W.FOODS.find(x=>x.id===id);assert.ok(f,id);const v=W.ReaderCopy.view({...f,...W.EDITORIAL_DETAILS?.[id]});assert.equal(v.safety,f.safety,id);if(f.safety)assert.ok(render(W,f).includes(W.FoodPurchase.esc(f.safety)),id);}
});
