'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {load}=require('./audit-reader-access.cjs'),root=path.join(__dirname,'..');
function audit(){
 const ctx=load(),W=ctx.window,M=W.FoodMedia,I=W.IngredientIdentity,V=W.VisualStandard,publicFoods=vm.runInContext('canonicalCatalog',ctx);
 const rows=publicFoods.map(f=>{const home=M.ingredient(f),detail=M.detail(I.detail(f.id,vm.runInContext('foods',ctx))||f);return {id:f.id,name:f.name,home:home.src,homeScene:home.scene,detail:detail?.src||'',detailScene:detail?.scene||'',visualKey:home.visualKey||home.src,homeChanged:!!V.record(f)?.home};});
 const grouped=new Map();for(const r of rows)if(r.home){const bytes=fs.readFileSync(path.join(root,'dist',r.home)),hash=crypto.createHash('sha256').update(bytes).digest('hex');const list=grouped.get(hash)||[];list.push({id:r.id,name:r.name,src:r.home});grouped.set(hash,list);}
 const groups=[...grouped.entries()].filter(([,r])=>r.length>1).map(([sha256,entries])=>({sha256,entries}));
 const features=vm.runInContext('termWindow.map(t=>({term:termNames[t.index],id:window.SEASON_FEATURES[t.index].foodId,foods:seasonFoodsFor(t).map(f=>({id:f.id,scene:window.FoodMedia.ingredient(f).scene,src:window.FoodMedia.ingredient(f).src}))}))',ctx);
 return {version:V.version,publicIngredients:rows.length,homeCovered:rows.filter(r=>r.home).length,detailCovered:rows.filter(r=>r.detail).length,paired:rows.filter(r=>r.home&&r.detail).length,explicitHomeUpdates:rows.filter(r=>r.homeChanged).length,missingHome:rows.filter(r=>!r.home).map(({id,name})=>({id,name})),missingDetail:rows.filter(r=>!r.detail).map(({id,name})=>({id,name})),admittedObservationMissingHome:vm.runInContext('foods.filter(f=>!window.FoodMedia.hasIngredient(f)).length',ctx),sourceMissingHome:W.FOODS.filter(f=>!M.hasIngredient(f)).length,sharedSourceGroups:groups,features,rows};
}
module.exports={audit};if(require.main===module){const r=audit();if(process.env.VISUAL_AUDIT_OUTPUT)fs.writeFileSync(process.env.VISUAL_AUDIT_OUTPUT,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(r).filter(([,v])=>!Array.isArray(v)))));}
