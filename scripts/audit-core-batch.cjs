'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js'),ctx={window:{}};
vm.createContext(ctx);
const scripts=[...fs.readFileSync(path.join(root,'dist/index.html'),'utf8').matchAll(/<script src="([^"?]+)(?:\?[^"<]*)?"/g)].map(x=>x[1]);
const dataFiles=['solar-terms.js','data.js','editorial.js','editorial-notes.js','november-additions.js','core-refinements.js'];
for(const name of scripts.filter(n=>dataFiles.includes(n)))vm.runInContext(fs.readFileSync(path.join(root,'dist',name),'utf8'),ctx);
for(const name of ['lottery-profiles.js','lottery-senses.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name),'utf8'),ctx);
const foods=ctx.window.FOODS,profiles=ctx.window.LOTTERY_PROFILES,events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES),now=Date.parse('2026-10-18T04:00:00Z');
const current=T.currentTerm(events,now),periods=[{...current,startDay:C.dayAt(current.time),endDay:C.addDays(C.dayAt(current.end),-1)},...C.nextSix(events,now)];
const prefs={avoid:[],excludeText:'',tastes:[],textures:[],cooking:[],curiosity:1};
const errors=[],ids=new Set();
for(const f of foods){
 if(ids.has(f.id))errors.push('Duplicate ID: '+f.id);ids.add(f.id);
 for(const key of ['taste','texture','buy','storage','search','recipeTitle','steps','sources'])if(!f[key]?.length)errors.push(f.id+': empty '+key);
 for(const [,url]of f.sources)if(!/^https?:\/\//.test(url))errors.push(f.id+': invalid source scheme');
 for(const key of ['image','cardImage','dishImage','cutImage'])if(f[key]&&!fs.existsSync(path.join(root,'dist',f[key])))errors.push(f.id+': missing '+f[key]);
 if(profiles[f.id]?.signature!==C.signature(f)||profiles[f.id]?.senses?.signature!==C.sensorySignature(f))errors.push(f.id+': review signature mismatch');
}
const categories=foods.reduce((a,f)=>(a[f.category]=(a[f.category]||0)+1,a),{});
console.log(JSON.stringify({auditDate:'2026-10-18',timezone:'Asia/Shanghai',scope:'Catalog and candidate coverage only; not verified inventory or exact 2026 harvest dates.',catalogCount:foods.length,categories,dataFiles:scripts.filter(n=>dataFiles.includes(n)),refinedIds:Object.keys(ctx.window.CORE_REFINEMENTS),periods:periods.map(s=>({name:s.name,startDay:s.startDay,endDay:s.endDay,candidates:C.poolFor(foods,profiles,prefs,s,events).map(f=>f.id)})),errors},null,2));
if(errors.length)process.exitCode=1;
