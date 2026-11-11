'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),dir=path.join(root,'dist');
const ctx=require('./audit-reader-access.cjs').load(),W=ctx.window,N=W.FieldNotes;
const foods=vm.runInContext('canonicalCatalog',ctx),esc=N.esc;
for(const name of ['index.html','tarot.html','lottery.html','credits.html']){
 const file=path.join(dir,name);let html=fs.readFileSync(file,'utf8');
 if(name==='credits.html')html=html.replace('<body>','<body class="credits-page">');
 if(!html.includes('href="field-notes.css'))html=html.replace('</head>','<link rel="stylesheet" href="field-notes.css?v=20261110-depth2">\n</head>');
 html=html.replace(/src="((?:app|reader-depth|season-features|food-detail|food-records|ingredient-identity|lottery-ui|tarot-spread-ui)\.js[^\"]*)"/g,(all,url)=>`src="${/[?&]content=/.test(url)?url.replace(/([?&])content=[^&"]*/,'$1content=20261110-depth2'):url+(url.includes('?')?'&':'?')+'content=20261110-depth2'}"`);
 html=html.replace(/文案版 [^<]+/g,'文案版 '+N.version);
 fs.writeFileSync(file,html);
}
const rows=foods.map(food=>{
 const raw=N.source(food),note=N.entry(food),image=W.FoodMedia.ingredient(food),view=W.ReaderCopy.view({...raw,...W.EDITORIAL_DETAILS?.[raw.id]});
 return {id:food.id,name:food.name,representative:Object.hasOwn(N.stories,raw.id),existing:{intro:!!view.intro,season:!!view.season,place:!!view.place},published:{lead:!!note.lead,season:!!note.season,place:!!note.place,kitchen:!!note.kitchen,image:!!image.src},needsResearch:['place','kitchen'].filter(field=>!note[field]),sources:raw.sources||[]};
});
const terms=Object.entries(W.SEASON_FEATURES).map(([index,feature])=>({index:Number(index),name:W.SOLAR_TERM_NAMES[index],intro:feature.intro,readings:feature.readings,representative:Object.entries(N.stories).find(([,note])=>note.term===Number(index))?.[0]}));
const report={version:N.version,publicIngredients:foods.length,termIntroductions:terms.length,deepStories:Object.keys(N.stories).length,coverage:Object.fromEntries(['lead','season','place','kitchen','image'].map(field=>[field,rows.filter(row=>row.published[field]).length])),terms,ingredients:rows};
fs.writeFileSync(path.join(root,'docs','CONTENT_DEPTH_20261110.json'),JSON.stringify(report,null,2)+'\n');
const index='<section id="field-image-index"><details><summary>按食材找图片 · '+foods.length+' 味</summary>'+foods.map(food=>{
 const image=W.FoodMedia.ingredient(food),caption=N.caption(food,image),credit=image.creditHref||'credits.html#visual-media-credits';
 const prepared=W.FoodMedia.detail(food),preparedCredit=prepared?.creditHref||'credits.html#visual-media-credits';
 const dish=prepared?`<p>${esc(prepared.kind==='fruit-cut'?'果切':'上桌')} · ${esc(N.caption(food,prepared))}</p><a href="${esc(preparedCredit)}">查看这张图片的来源 ↗</a>`:'';
 return `<div class="field-image-row" id="field-image-${esc(food.id)}"><a href="index.html?food=${encodeURIComponent(food.id)}">${esc(food.name)} ↗</a><div><p>${esc(image.src?caption:'原料图片待补，可先阅读食材详情。')}</p>${image.src?`<a href="${esc(credit)}">查看对应图片的来源与标识 ↗</a>`:''}${dish}</div></div>`;
}).join('')+'</details></section>';
const file=path.join(dir,'credits.html');let credits=fs.readFileSync(file,'utf8').replace(/<section id="field-image-index">[\s\S]*?<\/section>/,'');
if(!credits.includes('<h1>图片来源</h1>'))throw Error('Missing image credits heading');
credits=credits.replace('<h1>图片来源</h1>','<h1>图片来源</h1>'+index);fs.writeFileSync(file,credits);
console.log('Prepared field notes',N.version,report.publicIngredients,'ingredients,',report.deepStories,'stories,',report.termIntroductions,'term introductions');
module.exports=report;
