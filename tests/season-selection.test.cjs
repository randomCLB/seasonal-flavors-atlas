'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../dist/season-selection.js'),'utf8'),context);
const S=context.window.SeasonSelection;
test('different local pomelos have one seasonal winner and photographic foods keep distinct identities',()=>{
 const food=(id,name,image)=>({id,name,cardImage:image});
 const pomelos=[food('rongxian-shatian-pomelo','容县沙田柚','a.jpg'),food('tainan-madou-frost-white-pomelo','台南麻豆霜降白柚','b.jpg')];
 assert.equal(S.select(pomelos,19)[0].id,'tainan-madou-frost-white-pomelo');
 assert.equal(S.select([food('a','砂糖桔','a.jpg'),food('b','早橘','b.jpg')],18).length,1);
 assert.notEqual(S.group(food('a','樱桃')),S.group(food('b','蜜桃')));
 assert.notEqual(S.group(food('a','软枣猕猴桃')),S.group(food('b','蜜桃')));
 assert.notEqual(S.group(food('a','凤梨释迦')),S.group(food('b','莱阳梨')));
 assert.notEqual(S.group(food('a','西盟鲜竹虫')),S.group(food('b','刺竹笋')));
 assert.equal(S.group(food('a','启东吕四冬至带鱼')),S.group(food('b','苏澳霜降百带鱼')));
});
test('the complete displayed list rotates repeats at fifty percent without altering sourced candidates',()=>{
 const f=id=>({id});const previous=[f('a'),f('b'),f('c')],pools=[[f('a'),f('b'),f('c'),f('d')],[f('a'),f('d'),f('e')]];
 const before=JSON.stringify(pools),lists=S.plan(pools,previous);let prior=previous;
 for(let i=0;i<lists.length;i++){
  const ids=new Set(prior.map(food=>food.id));assert.ok(lists[i].filter(food=>ids.has(food.id)).length/lists[i].length<=.5);
  assert.ok(lists[i].every(food=>pools[i].includes(food)));prior=lists[i];
 }
 assert.equal(JSON.stringify(pools),before);
});
test('a calendar quarter keeps one hairtail selection and favors the distinct northern-ocean variety',()=>{
 const f=(id,name)=>({id,name,cardImage:id+'.jpg'});
 const lists=S.plan([[f('suao-frost-beltfish','苏澳霜降百带鱼')],[f('ningbo-youdai','宁波北洋油带鱼'),f('qidong-lyusi-winter-solstice-hairtail','启东吕四冬至带鱼')]],[],['2026-Q4','2026-Q4']);
 assert.deepEqual(lists.map(list=>list.map(food=>food.id)),[[],['ningbo-youdai']]);
});
