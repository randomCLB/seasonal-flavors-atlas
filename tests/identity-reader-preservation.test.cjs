'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const W=require('../scripts/audit-reader-copy.cjs').load(),ctx={window:W},byId=Object.fromEntries(W.FOODS.map(f=>[f.id,f]));vm.createContext(ctx);
for(const f of ['ingredient-identity','food-detail'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',f+'.js'),'utf8'),ctx);
W.FoodPurchase=require('../dist/food-purchase.js');W.FoodRecords={render:()=>''};
const I=W.IngredientIdentity;
test('canonical details retain the expanded recipes written in the previous release',()=>{
 for(const [id,source]of Object.entries(I.recipeSources)){
  const raw=byId[source],original=W.ReaderCopy.view({...raw,...W.EDITORIAL_DETAILS?.[source]}),food=I.detail(id),before=JSON.stringify(W.FOODS),view=I.reading(food);
  assert.deepEqual(Array.from(view.steps),Array.from(original.steps),id);assert.equal(view.kitchen,original.kitchen,id);assert.equal(view.storage,original.storage,id);assert.equal(view.name,I.descriptor(id).name);assert.equal(view.recipeSourceId,source);
  const html=W.FoodDetail.html(food,{recognition:{src:'',alt:'',note:'',fit:'cover'},seasonLabel:'',category:'食材',originHtml:I.sourceHtml(food)});
  for(const step of original.steps)assert.ok(html.includes(W.FoodPurchase.esc(step)),source+': '+step);
  assert.equal(JSON.stringify(W.FOODS),before);
 }
});
test('canonical detail rendering keeps every merged evidence link after editorial overlays',()=>{
 for(const g of I.groups){const food=I.detail(g.id),view=I.reading(food);assert.equal(JSON.stringify(view.sources),JSON.stringify(food.sources));assert.equal(view.name,g.name);assert.equal(view.region,food.region);const html=W.FoodDetail.html(food,{recognition:{src:'',alt:'',note:'',fit:'cover'},seasonLabel:'',category:'食材',originHtml:I.sourceHtml(food)});for(const [,url]of food.sources)assert.ok(html.includes(W.FoodPurchase.esc(url)),g.id+': '+url);}
});
