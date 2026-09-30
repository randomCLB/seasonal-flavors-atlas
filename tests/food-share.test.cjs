'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {shareData,bind}=require('../dist/food-share.js');
const food={id:'shajiguo',name:'沙棘果'};
function fixture(navigator={}){
 const el=()=>({disabled:false,hidden:true,textContent:'',value:'',setAttribute(k,v){this[k]=v},focus(){this.focused=true},select(){this.selected=true}});
 const args={button:el(),status:el(),fallback:el(),input:el(),copy:el(),navigator,href:()=> 'https://randomclb.github.io/seasonal-flavors-atlas/?food=old&utm_source=test#recipe'};
 const controller=bind(args);controller.setFood(food);return {...args,...controller};
}
test('stable canonical ingredient URLs discard unrelated query and fragments',()=>{
 for(const page of ['','index.html','preview/v1.1/','preview/v1.1/index.html']){
  const d=shareData(food,'https://randomclb.github.io/seasonal-flavors-atlas/'+page+'?food=wrong&token=private#recipe');
  assert.deepEqual(d,{title:'沙棘果 · 时令风物',url:'https://randomclb.github.io/seasonal-flavors-atlas/index.html?food=shajiguo'});
 }
});
test('food ID is URL encoded and title is plain text',()=>{assert.equal(new URL(shareData({id:'a&b',name:'<味>'},'https://example.com/').url).searchParams.get('food'),'a&b')});
test('native share is invoked synchronously once with exact title and URL',async()=>{
 let resolve,calls=[];const f=fixture({share:d=>{calls.push(d);return new Promise(r=>resolve=r)}});
 const pending=f.button.onclick();assert.equal(calls.length,1);assert.equal(f.button.disabled,true);
 await f.button.onclick();assert.equal(calls.length,1);resolve();await pending;
 assert.equal(f.button.disabled,false);assert.equal(f.status.textContent,'');assert.deepEqual(calls[0],shareData(food,f.href()));
});
test('cancel does not copy and permits another share',async()=>{
 let copies=0,calls=0;const f=fixture({share:async()=>{calls++;throw {name:'AbortError'}},clipboard:{writeText:async()=>copies++}});
 await f.button.onclick();assert.equal(copies,0);assert.equal(f.status.textContent,'已取消分享');
 await f.button.onclick();assert.equal(calls,2);assert.equal(f.button.disabled,false);
});
for(const kind of ['absent','unsupported','throws','rejected'])test(kind+' native share falls back to copying',async()=>{
 let copied;const navigator={clipboard:{writeText:async s=>copied=s}};
 if(kind==='unsupported'){navigator.canShare=()=>false;navigator.share=()=>assert.fail('unsupported share');}
 if(kind==='throws'){navigator.canShare=()=>{throw Error()};navigator.share=()=>assert.fail('unsupported share');}
 if(kind==='rejected')navigator.share=async()=>{throw {name:'NotAllowedError'}};
 const f=fixture(navigator);await f.button.onclick();assert.equal(copied,shareData(food,f.href()).url);assert.match(f.status.textContent,/链接已复制/);assert.equal(f.fallback.hidden,true);
});
for(const kind of ['missing','denied'])test(kind+' clipboard reveals selectable accessible manual link',async()=>{
 const f=fixture(kind==='denied'?{clipboard:{writeText:async()=>{throw Error()}}}:{});
 await f.button.onclick();assert.equal(f.fallback.hidden,false);assert.equal(f.input.value,shareData(food,f.href()).url);assert.equal(f.input.focused,true);assert.equal(f.input.selected,true);assert.match(f.status.textContent,/长按/);assert.equal(f.button.disabled,false);
 f.navigator.clipboard={writeText:async()=>{}};await f.copy.onclick();assert.match(f.status.textContent,/已复制/);assert.equal(f.fallback.hidden,true);
});
test('navigating to another food drops stale share errors and uses new food next time',async()=>{
 let reject,calls=[];const f=fixture({share:d=>{calls.push(d);return new Promise((_,r)=>reject=r)}});
 const pending=f.button.onclick();f.setFood({id:'cili',name:'刺梨'});reject(Error('failed'));await pending;
 assert.equal(f.fallback.hidden,true);assert.equal(f.status.textContent,'');
 const next=f.button.onclick();assert.equal(new URL(calls[1].url).searchParams.get('food'),'cili');reject({name:'AbortError'});await next;
});
test('closing while clipboard pending cannot show stale result or reenable closed view',async()=>{
 let resolve;const f=fixture({clipboard:{writeText:()=>new Promise(r=>resolve=r)}});
 const pending=f.button.onclick();f.setFood(null);resolve();await pending;
 assert.equal(f.status.textContent,'');assert.equal(f.button.disabled,true);assert.equal(f.fallback.hidden,true);
});
test('manual copy ignores repeated clicks while busy',async()=>{
 const f=fixture();await f.button.onclick();let resolve,calls=0;
 f.navigator.clipboard={writeText:()=>{calls++;return new Promise(r=>resolve=r)}};
 const p=f.copy.onclick();await f.copy.onclick();assert.equal(calls,1);resolve();await p;assert.equal(f.copy.disabled,false);
});
