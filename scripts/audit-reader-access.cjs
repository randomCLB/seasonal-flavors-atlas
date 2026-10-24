'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),dir=path.join(root,'dist');
function load(){
 const ctx={window:{},document:{getElementById:()=>({style:{}})}};vm.createContext(ctx);
 const layers=['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','editorial-copy','photo-review','catalog-photos','ingredient-identity','reader-copy','reader-copy-curation','reader-depth','season-features','season-selection','reader-media-additions','reader-access','food-media'];
 for(const n of layers)vm.runInContext(fs.readFileSync(path.join(dir,n+'.js'),'utf8'),ctx,{filename:n});
 ctx.window.FengwuLottery=require('../dist/lottery-core.js');const app=fs.readFileSync(path.join(dir,'app.js'),'utf8');vm.runInContext(app.slice(0,app.indexOf('function renderTermRail')),ctx);return ctx;
}
function audit(){
 const ctx=load(),W=ctx.window,I=W.IngredientIdentity,A=W.ReaderAccess,M=W.FoodMedia;
 const all=I.catalog(W.FOODS),publicFoods=vm.runInContext('canonicalCatalog',ctx);
 const rows=publicFoods.map(f=>{const image=M.ingredient(f),dish=M.dish(f);return {id:f.id,name:f.name,cover:image.src,coverExists:!!image.src&&fs.existsSync(path.join(dir,image.src)),dish: dish?.src||'',sourceIds:f.identityMembers||[f.id]};});
 const withdrawn=all.filter(f=>!A.visible(f)).map(f=>({id:f.id,name:f.name,sourceIds:f.identityMembers||[f.id],reason:'尚未核实身份匹配的大陆食用供应或有效B站介绍，暂不公开推荐'}));
 const terms=vm.runInContext('termWindow.map(t=>({term:termNames[t.index],featured:window.SEASON_FEATURES[t.index].foodId,curated:seasonFoodsFor(t).map(f=>f.id),all:rankSeasonFoods(chinaParts(new Date(t.time+86400000)).month,t).map(f=>f.id)}))',ctx);
 const rawMissing=W.FOODS.filter(f=>!M.ingredient(f).src).length;
 return {version:A.version,sourceObservations:W.FOODS.length,rawCanonical:all.length,publicObservations:vm.runInContext('foods.length',ctx),publicIngredients:publicFoods.length,withdrawnCount:withdrawn.length,withdrawnSourceCount:W.FOODS.filter(f=>!A.visible(f)).length,missing:rows.filter(f=>!f.cover),broken:rows.filter(f=>f.cover&&!f.coverExists),covered:rows.filter(f=>f.coverExists).length,rawMissing,retainedTaiwan:publicFoods.filter(A.scope).map(f=>({id:f.id,name:f.name,evidence:A.entry(f)})),withdrawn,terms,rows};
}
module.exports={load,audit};
if(require.main===module){const report=audit();fs.writeFileSync('/tmp/reader-access.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...Object.fromEntries(Object.entries(report).filter(([,v])=>!Array.isArray(v))),missing:report.missing.length,broken:report.broken.length,retainedTaiwan:report.retainedTaiwan.length}));}
