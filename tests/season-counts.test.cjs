'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../dist/lottery-core.js'),root=path.join(__dirname,'../dist');
function fixture(){
 const nodes=new Map(),document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,{style:{},querySelectorAll:()=>[]});return nodes.get(id)},querySelectorAll:()=>[]};
 class Clock extends Date{constructor(...args){super(...(args.length?args:['2026-10-03T04:00:00Z']))}static now(){return Date.parse('2026-10-03T04:00:00Z')}}
 const ctx={window:{FengwuLottery:C},document,Date:Clock};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes'])vm.runInContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'),ctx);
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
 vm.runInContext(app.slice(0,app.indexOf('function renderTermRail')),ctx);
 vm.runInContext(app.slice(app.indexOf('function renderCategoryFilter'),app.indexOf("$('termPrev').onclick")),ctx);
 return {ctx,nodes};
}
function counts(nodes){return [...nodes.get('categoryFilter').innerHTML.matchAll(/data-category="([^"]+)"[^>]*>[^<]*<span>(\d+)<\/span>/g)].map(m=>[m[1],Number(m[2])])}
function cardCount(nodes){return (nodes.get('seasonCards').innerHTML.match(/<article /g)||[]).length}
test('cross-month current term counts its retained hero in all and category totals',()=>{
 const {ctx,nodes}=fixture();vm.runInContext('renderSeason()',ctx);
 const totals=Object.fromEntries(counts(nodes));
 assert.equal(totals.all,cardCount(nodes));
 assert.equal(totals.all,totals.vegetable+totals.fruit+totals.protein);
 assert.ok(nodes.get('seasonHeading').textContent.includes(`${totals.all} 味`));
 const hero=nodes.get('hero').innerHTML.match(/data-food="([^"]+)"/)[1];
 assert.ok(nodes.get('seasonCards').innerHTML.includes(`data-food="${hero}"`));
});
test('every term and category keeps consistent totals while retaining the hero once',()=>{
 const {ctx,nodes}=fixture();
 for(let index=0;index<24;index++)for(const category of ['all','vegetable','fruit','protein']){
  vm.runInContext(`selectedTerm=termWindow[${index}];selectedCategory='${category}';renderSeason()`,ctx);
  const totals=Object.fromEntries(counts(nodes)),hero=nodes.get('hero').innerHTML.match(/data-food="([^"]+)"/),food=hero&&ctx.window.FOODS.find(f=>f.id===hero[1]);
  assert.equal(totals.all,totals.vegetable+totals.fruit+totals.protein);
  const expected=totals[category]+Number(category!=='all'&&!!food&&food.category!==category);
  assert.equal(cardCount(nodes),expected,`${index}/${category}`);
  assert.ok(nodes.get('seasonHeading').textContent.includes(`${expected} 味`));
  if(hero)assert.equal((nodes.get('seasonCards').innerHTML.match(new RegExp(`<button data-food="${hero[1]}" class="season-list-image-button"`,'g'))||[]).length,1);
 }
});
