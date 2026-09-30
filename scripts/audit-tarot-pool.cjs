'use strict';
// Run: node scripts/audit-tarot-pool.cjs [2027]
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js'),ctx={window:{}};
const year=Number(process.argv[2]||2027);if(!Number.isInteger(year)||year<2000||year>2100)throw Error('Invalid audit year');
vm.createContext(ctx);for(const name of ['solar-terms','data','editorial','editorial-notes','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const foods=JSON.parse(JSON.stringify(ctx.window.FOODS)),profiles=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES)),events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES);
const rows=[];
for(let m=1;m<=12;m++)for(const d of [1,15,28]){const date=`${year}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`,now=Date.parse(date+'T04:00:00Z');const pool=T.pool({foods,profiles,events,now});rows.push({date,count:pool.length,ids:pool.map(x=>x.food.id),names:pool.map(x=>x.food.name)});}
console.log(JSON.stringify({catalogCount:foods.length,sampling:'Each month 1st/15th/28th at 12:00 China time; no dietary exclusions. Counts are site-data coverage, not market availability.',minimum:Math.min(...rows.map(r=>r.count)),rows},null,2));
