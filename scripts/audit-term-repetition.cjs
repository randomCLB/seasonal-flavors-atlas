'use strict';
// Run: node scripts/audit-term-repetition.cjs [year]
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),ctx={window:{}};
const year=Number(process.argv[2]||2026);if(!Number.isInteger(year)||year<2000||year>2100)throw Error('Invalid audit year');
vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','editorial-copy'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const events=C.eventsFrom(ctx.window.SOLAR_TERM_TIMES,ctx.window.SOLAR_TERM_NAMES),start=events.findIndex(e=>e.year===year&&e.index===17);
if(start<0||events[start+24]?.index!==17||events[start+24]?.year!==year+1)throw Error(`24-term cycle unavailable for ${year}`);
const foods=ctx.window.FOODS,terms=events.slice(start,start+24);
function isVisibleInTerm(food,term,next){
  const first=C.dayAt(term.time),last=C.addDays(C.dayAt(next.time),-1);let inSeason=false;
  if(food.sourceYears?.length&&!food.sourceYears.some(year=>first.slice(0,4)<=String(year)&&last.slice(0,4)>=String(year)))return false;
  if(food.peakTerms?.length)inSeason=food.peakTerms.includes(term.index);
  else for(let day=first;day<=last;day=C.addDays(day,1)){
    if(food.sourceYears?.length&&!food.sourceYears.includes(Number(day.slice(0,4))))continue;
    const month=Number(day.slice(5,7));
    if(food.peakWindows?.length?C.isPeakDay(food,day):(food.peakMonths||[]).includes(month)){inSeason=true;break;}
  }
  if(!inSeason)return false;
  const seasonStart=food.seasonStartTerm;
  if(!Number.isInteger(seasonStart))return true;
  const anchorYear=seasonStart>=17?(term.index<17?term.year-1:term.year):(term.index>=17?term.year+1:term.year);
  const anchor=events.find(event=>event.year===anchorYear&&event.index===seasonStart);
  return Boolean(anchor&&term.time>=anchor.time);
}
const pools=terms.map((term,i)=>foods.filter(food=>isVisibleInTerm(food,term,events[start+i+1])));
const rows=terms.map((term,i)=>{
  const current=pools[i];
  const previous=i===0
    ? foods.filter(food=>isVisibleInTerm(food,events[start-1],events[start]))
    : pools[i-1];
  const previousIds=new Set(previous.map(food=>food.id));
  const repeated=current.filter(food=>previousIds.has(food.id)),newFoods=current.filter(food=>!previousIds.has(food.id));
  const ratio=current.length?repeated.length/current.length:0;
  const requiredNewTermAppearancesIfRetainingCurrentPool=Math.max(0,2*repeated.length-current.length);
  const projectedTotalAfterExclusiveAdditions=current.length+requiredNewTermAppearancesIfRetainingCurrentPool;
  return {term:term.name,year:term.year,index:term.index,previousTerm:i===0?events[start-1].name:terms[i-1].name,count:current.length,repeated:repeated.length,repeatRateDenominator:'current-term-total',repeatRate:ratio,withinLimit:ratio<=0.5,
    requiredNewTermAppearancesIfRetainingCurrentPool,requiredAdditionalFoodsNotInPreviousTerm:requiredNewTermAppearancesIfRetainingCurrentPool,projectedTotalAfterExclusiveAdditions,projectedRepeatRateAfterExclusiveAdditions:projectedTotalAfterExclusiveAdditions?repeated.length/projectedTotalAfterExclusiveAdditions:0,repeatedFoodIds:repeated.map(food=>food.id),foodIds:current.map(food=>food.id),repeatedFoods:repeated.map(food=>food.name),newFoods:newFoods.map(food=>food.name),foods:current.map(food=>food.name)};
});
const result={auditYear:year,cycle:'autumn-equinox to next autumn-equinox',scope:'All catalog entries visible in the homepage season list for each term. A food with peakTerms is included only for those solar-term indexes; otherwise its peakWindows or peakMonths must overlap at least one day in the term. The seasonStartTerm gate applies in either case. Repeat rate is the count also present in the immediately preceding term divided by the current term total. The first term compares with the immediately preceding White Dew.',repeatRateDenominator:'current-term-total',catalogCount:foods.length,limit:0.5,overLimit:rows.filter(row=>!row.withinLimit).length,requiredNewTermAppearancesIfRetainingCurrentPools:rows.reduce((n,row)=>n+row.requiredNewTermAppearancesIfRetainingCurrentPool,0),requiredAdditionalCurrentTermEntriesNotInPreviousTerm:rows.reduce((n,row)=>n+row.requiredAdditionalFoodsNotInPreviousTerm,0),gapNote:'This is a total of per-term list entries that must not appear in the immediately preceding term; it is not a count of globally distinct food IDs. One food may contribute to multiple term lists only when its full sourced window supports those appearances.',rows};
console.log(JSON.stringify(result,null,2));
