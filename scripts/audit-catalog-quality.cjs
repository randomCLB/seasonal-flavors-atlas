'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),dir=path.join(root,'dist');
function audit(){
 const ctx={window:{},document:{getElementById:()=>({style:{}})}};vm.createContext(ctx);
 const layers=['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','editorial-copy','photo-review','catalog-photos','ingredient-identity','reader-copy','reader-copy-curation','reader-depth','season-features','season-selection'];
 for(const layer of layers)vm.runInContext(fs.readFileSync(path.join(dir,layer+'.js'),'utf8'),ctx);
 ctx.window.FengwuLottery=require('../dist/lottery-core.js');
 const app=fs.readFileSync(path.join(dir,'app.js'),'utf8');vm.runInContext(app.slice(0,app.indexOf('function renderTermRail')),ctx);
 const rows=ctx.window.FOODS.map(food=>{
  const raw={...food,...ctx.window.EDITORIAL_DETAILS?.[food.id]},read=ctx.window.ReaderCopy.view(raw),visual=vm.runInContext(`foodVisual(byId[${JSON.stringify(food.id)}])`,ctx);
  const lostFields=['intro','taste','aroma','texture','kitchen','finish','pair','season','context'].filter(key=>raw[key]&&!read[key]);
  return {id:food.id,ingredientId:ctx.window.IngredientIdentity.key(food),name:food.name,image:visual.src||'',lostFields,steps:(read.steps||[]).length,readerCharacters:['short','intro','taste','aroma','texture','buy','buyDetail','storage','ingredients','finish','pair','kitchen'].reduce((n,k)=>n+String(read[k]||'').length,0)+(read.steps||[]).join('').length};
 });
 const terms=vm.runInContext('termWindow.map(t=>({year:t.year,index:t.index,term:termNames[t.index],foods:seasonFoodsFor(t).map(f=>({id:f.id,ingredientId:window.IngredientIdentity.key(f),name:f.name,group:window.SeasonSelection.group(f)}))}))',ctx);
 return {catalogCount:rows.length,ingredientCount:ctx.window.IngredientIdentity.catalog(ctx.window.FOODS).length,missingImages:rows.filter(r=>!r.image).length,terms,rows};
}
module.exports={audit};if(require.main===module)console.log(JSON.stringify(audit(),null,2));
