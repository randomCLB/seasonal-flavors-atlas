'use strict';
// Audit actual prepared presentation images and Taiwan seafood records before curation.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),dir=path.join(root,'dist');
const ctx={window:{},document:{getElementById:()=>({style:{}})}};vm.createContext(ctx);
const layers=['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','editorial-copy','photo-review','catalog-photos','ingredient-identity','reader-copy','reader-copy-curation','reader-depth','season-features','season-selection'];
for(const n of layers)vm.runInContext(fs.readFileSync(path.join(dir,n+'.js'),'utf8'),ctx,{filename:n});
ctx.window.FengwuLottery=require('../dist/lottery-core.js');const app=fs.readFileSync(path.join(dir,'app.js'),'utf8');vm.runInContext(app.slice(0,app.indexOf('function renderTermRail')),ctx);
const rows=vm.runInContext(`canonicalCatalog.map(f=>({id:f.id,name:f.name,region:f.region,category:f.category,cover:foodVisual(f).src||'',rawImage:f.image||'',rawCard:f.cardImage||'',identityMembers:f.identityMembers||[f.id],sources:f.sources}))`,ctx);
for(const f of rows){f.coverExists=Boolean(f.cover&&fs.existsSync(path.join(dir,f.cover)));f.bytes=f.coverExists?fs.statSync(path.join(dir,f.cover)).size:0;}
const seafood=rows.filter(f=>['protein','seafood'].includes(f.category)&&/台湾|台灣/.test(f.region));
const report={catalogCount:rows.length,missing:rows.filter(f=>!f.cover),broken:rows.filter(f=>f.cover&&!f.coverExists),registryOnly:rows.filter(f=>f.cover&&!f.rawImage&&!f.rawCard),seafood,rows};
fs.writeFileSync('/tmp/reader-access.json',JSON.stringify(report,null,2));console.log(JSON.stringify({catalog:rows.length,missing:report.missing.length,broken:report.broken.length,registryOnly:report.registryOnly.length,taiwanSeafood:seafood.length}));
