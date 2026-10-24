'use strict';
/* Exact, idempotent integration. The canonical source observations and draw evidence are not rewritten. */
const fs=require('node:fs'),path=require('node:path');const root=path.join(__dirname,'..');
function patch(file,from,to){const p=path.join(root,file),s=fs.readFileSync(p,'utf8');if(s.includes(to))return;if(s.split(from).length!==2)throw Error(file+': identity integration anchor: '+from.slice(0,95));fs.writeFileSync(p,s.replace(from,to));}
for(const page of ['index.html','tarot.html','lottery.html']){
 const file=path.join(root,'dist',page);let s=fs.readFileSync(file,'utf8');
 if(!s.includes('src="ingredient-identity.js'))s=s.replace('<script src="reader-copy.js',`<script src="ingredient-identity.js?v=20261024-1"${page==='index.html'?'':' defer'}></script><script src="reader-copy.js`);
 if(!s.includes('href="ingredient-identity.css'))s=s.replace('</head>','<link rel="stylesheet" href="ingredient-identity.css?v=20261024-1">\n</head>');
 s=s.replace(/src="((?:app|season-selection|food-records|food-detail)\.js[^\"]*)"/g,(all,url)=>`src="${/[?&]identity=/.test(url)?url:url+(url.includes('?')?'&':'?')+'identity=20261024-1'}"`);
 if(page==='index.html'&&!s.includes('class="identity-build"'))s=s.replace('</footer>','<small class="identity-build">目录版 2026.10.24-identity.1</small></footer>');
 fs.writeFileSync(file,s);
}
patch('dist/season-selection.js',"function group(food){\n  if(food.category==='tea')", "function group(food){\n  const identityFamily=root.IngredientIdentity?.family(food);if(identityFamily)return identityFamily;\n  if(food.category==='tea')");
patch('dist/season-selection.js','const ids=new Set(previous.map(food=>food.id)),fresh=pool.filter(food=>!ids.has(food.id)),feature=pool.find(food=>food.id===featuredIds[i]),repeated=pool.filter(food=>ids.has(food.id));','const ids=new Set(previous.map(group)),fresh=pool.filter(food=>!ids.has(group(food))),feature=pool.find(food=>food.id===featuredIds[i]),repeated=pool.filter(food=>ids.has(group(food)));');
patch('dist/season-selection.js','if(feature&&ids.has(feature.id))','if(feature&&ids.has(group(feature)))');
patch('dist/season-selection.js',"variants:(food,catalog)=>(catalog||[]).filter(other=>other.id!==food.id&&group(other)===group(food))", "variants:(food,catalog)=>{const I=root.IngredientIdentity,list=I?I.catalog(catalog||[]):catalog||[];return list.filter(other=>(I?I.key(other)!==I.key(food):other.id!==food.id)&&group(other)===group(food));}");
patch('dist/app.js','const byId=Object.fromEntries(foods.map(food=>[food.id,food]));','const byId=Object.fromEntries(foods.map(food=>[food.id,food]));\nconst canonicalCatalog=window.IngredientIdentity?window.IngredientIdentity.catalog(foods):foods;');
patch('dist/app.js','const list=(catalogScope===\'all\'?rankSeasonFoods(foodMonth,selectedTerm):seasonFoodsFor(selectedTerm)).slice();','const list=(catalogScope===\'all\'?rankSeasonFoods(foodMonth,selectedTerm):seasonFoodsFor(selectedTerm)).map(f=>window.IngredientIdentity?window.IngredientIdentity.present(f):f);');
patch('dist/app.js',"const reviewed=window.PhotoReview?.records?.[food.id];","const reviewed=window.FoodMedia?.ingredient(food)||food.identityPhoto||window.PhotoReview?.records?.[food.sourceId||food.id]||window.PhotoReview?.records?.[food.id];");
patch('dist/app.js','const monthList=mapOnlySeason?monthFoods(selectedMonth):foods;','const monthList=window.IngredientIdentity?window.IngredientIdentity.catalog(mapOnlySeason?monthFoods(selectedMonth):foods):(mapOnlySeason?monthFoods(selectedMonth):foods);');
patch('dist/app.js','const unique=[...new Map(group.map(x=>[`${x.food.id}|${x.place.name}`,x])).values()];','const unique=window.IngredientIdentity?window.IngredientIdentity.mapEntries(group):[...new Map(group.map(x=>[`${x.food.id}|${x.place.name}`,x])).values()];');
patch('dist/app.js','<small>${x.place.name} · ${formatMonths(x.place.months)} · 查看详情 ↗</small>', "${window.IngredientIdentity?window.IngredientIdentity.mapPlacesHtml(x,formatMonths)+'<small>查看详情 ↗</small>':`<small>${x.place.name} · ${formatMonths(x.place.months)} · 查看详情 ↗</small>`}");
patch('dist/app.js',"${x.place.flavorNote?`<small>${x.place.flavorNote}</small>`:''}", "${window.IngredientIdentity?'':`${x.place.flavorNote?`<small>${x.place.flavorNote}</small>`:''}`}");
patch('dist/app.js','<small>${y.place.name} · ${formatMonths(y.place.months)}</small>', '${window.IngredientIdentity?window.IngredientIdentity.mapPlacesHtml(y,formatMonths):`<small>${y.place.name} · ${formatMonths(y.place.months)}</small>`}');
patch('dist/app.js','new Set(group.map(x=>window.SeasonSelection.group(x.food))).size','new Set(group.map(x=>window.IngredientIdentity?window.IngredientIdentity.key(x.food):x.food.id)).size');
patch('dist/app.js',"function relatedFoods(f){return foods.filter(other=>other.id!==f.id)","function relatedFoods(f){return canonicalCatalog.filter(other=>window.IngredientIdentity?window.IngredientIdentity.key(other)!==window.IngredientIdentity.key(f):other.id!==f.id)");
patch('dist/app.js',"function detailHtml(f){\n const recognition=", "function detailHtml(f){\n f=window.IngredientIdentity?.detail(f.id,foods)||f;\n const recognition=");
patch('dist/app.js','originHtml:originDetails(f),variants:window.SeasonSelection.variants(f,foods)','originHtml:window.IngredientIdentity?.sourceHtml(f)||originDetails(f),variants:window.SeasonSelection.variants(f,canonicalCatalog)');
patch('dist/app.js','function openFood(id,push=true,jumpRecipe=false){const f=byId[id];if(!f)return;','function openFood(id,push=true,jumpRecipe=false){id=window.IngredientIdentity?.key(id)||id;const f=window.IngredientIdentity?.detail(id,foods)||byId[id];if(!f)return;if(!push){const url=new URL(location.href);if(url.searchParams.get(\'food\')!==id){url.searchParams.set(\'food\',id);history.replaceState({food:id},\'\',url);}}');
patch('dist/app.js','const matches=q?foods.filter(', 'const matches=q?canonicalCatalog.filter(');
patch('dist/app.js','some(value=>value.toLowerCase().includes(q))):foods;', 'some(value=>value.toLowerCase().includes(q))):canonicalCatalog;');
patch('dist/app.js','const selected=byId[starSelected],visual=foodVisual(selected),matches=starTagFilter===\'all\'?foods:foods.filter(', 'const selected=window.IngredientIdentity?.detail(starSelected,foods)||byId[starSelected],visual=foodVisual(selected),matches=starTagFilter===\'all\'?canonicalCatalog:canonicalCatalog.filter(');
patch('dist/app.js','function starTreeData(){return starTerms.map(event=>{let list=seasonFoodsFor(event);','function starTreeData(){return starTerms.map(event=>{let list=seasonFoodsFor(event).map(f=>window.IngredientIdentity?window.IngredientIdentity.present(f):f);');
patch('dist/app.js',"const food=byId[node.id],box=$('flavorCanvas')", "const food=window.IngredientIdentity?.detail(node.id,foods)||byId[node.id],box=$('flavorCanvas')");
console.log('Prepared stable ingredient identities 2026.10.24-identity.1');
