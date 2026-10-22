'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8');
const context={window:{FengwuLottery:require('../dist/lottery-core.js')},console};
vm.createContext(context);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','term-gap-additions','editorial-copy'])vm.runInContext(read(name),context);
const before=JSON.parse(JSON.stringify(context.window.FOODS));
for(const name of ['photo-review','season-selection'])vm.runInContext(read(name),context);
const foods=context.window.FOODS,fields=['cardImage','image','dishImage','cutImage'];
const missing=foods.filter(food=>fields.some(key=>food[key]&&!fs.existsSync(path.join(root,'dist',food[key]))));
if(missing.length)throw Error(`有 ${missing.length} 个条目引用的图片文件不存在`);
const photographicBefore=before.filter(f=>fields.some(key=>/generated/i.test(f[key]||'')));
for(const food of photographicBefore){
 const current=foods.find(f=>f.id===food.id);
 for(const key of fields)if(/generated/i.test(food[key]||'')&&current[key]!==food[key])throw Error(`已接受的照片质感图片被误撤：${food.id}/${key}`);
}
vm.runInContext(read('app').split('function renderTermRail')[0],context);
const rows=vm.runInContext(`termWindow.map(event=>{
 const month=chinaParts(new Date(event.time+86400000)).month;
 const list=seasonFoodsFor(event);
 const featured=featuredAssignment('all').get(event.year+'-'+event.index);
 return {term:termNames[event.index],index:event.index,foods:list.map(food=>({id:food.id,name:food.name,group:window.SeasonSelection.group(food),image:foodVisual(food).src})),featured:featured&&{id:featured.id,image:foodVisual(featured).src}};
})`,context);
for(const row of rows){
 if(!row.foods.length||!row.featured?.image)throw Error(`${row.term} 没有可用主推图片`);
 if(!row.foods.some(f=>f.id===row.featured.id))throw Error(`${row.term} 主推不在精选列表`);
 for(const key of ['group','image'])if(new Set(row.foods.map(food=>food[key])).size!==row.foods.length)throw Error(`${row.term} 有重复${key}`);
 if(row.foods.some(food=>!food.image||/\.svg|illustration/i.test(food.image)))throw Error(`${row.term} 仍有空图或临时线稿`);
}
const frost=rows.find(row=>row.index===19);
if(frost.foods.filter(f=>f.group==='pomelo').length!==1||!frost.foods.some(f=>f.id==='tainan-madou-frost-white-pomelo'))throw Error('霜降应只选麻豆白柚一味柚类');
const hanlu=rows.find(row=>row.index===18);
if(!hanlu.foods.some(f=>f.id==='lancang-nannai-duoyi'&&f.image.includes('lancang-nannai-duoyi')))throw Error('多依果原有图片未恢复');
const repeated=rows.map((row,i)=>{const previous=i?rows[i-1]:null;const ids=new Set(previous?previous.foods.map(f=>f.id):vm.runInContext(`(()=>{const event=termEvents[termEvents.indexOf(termWindow[0])-1];return rankSeasonFoods(chinaParts(new Date(event.time+86400000)).month,event).filter(food=>seasonHasBegun(food,event)).map(food=>food.id)})()`,context));const count=row.foods.filter(f=>ids.has(f.id)).length;return {term:row.term,count:row.foods.length,repeated:count,rate:count/row.foods.length};});
if(repeated.some(row=>row.rate>.5))throw Error('相邻节气精选重复率超过 50%');
const result={catalogCount:foods.length,preservedPhotographicReferences:photographicBefore.length,replacedVectorDrafts:context.window.PhotoReview.replaced,pendingImages:foods.filter(f=>!f.image&&!f.cardImage).map(f=>({id:f.id,name:f.name})),terms:rows,adjacentRepetition:{limit:.5,overLimit:repeated.filter(row=>row.rate>.5).length,rows:repeated},errors:[]};
console.log(JSON.stringify(result,null,2));
