'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');

test('opening saved tasting records keeps unpictured foods readable without broken image requests',()=>{
 const recordList={innerHTML:''},filters=['want','tried'].map(state=>({dataset:{recordFilter:state},setAttribute(){},querySelector:()=>({textContent:''})}));
 const dialog={open:false,setAttribute(){},showModal(){this.open=true;},querySelectorAll:selector=>selector==='[data-record-filter]'?filters:[],querySelector:selector=>selector==='.records-list'?recordList:null};
 const food=(id,name,image)=>({id,name,region:'测试产地',image,cardImage:'',imageAlt:name});
 const foods=[food('unpictured','暂无图片的一味',''),food('pictured','已有图片的一味','assets/known-photo.webp')];
 const saved=JSON.stringify({version:1,items:{unpictured:{state:'want',updatedAt:2},pictured:{state:'want',updatedAt:1}}});
 const document={querySelectorAll:()=>[],addEventListener(){},createElement:tag=>{assert.equal(tag,'dialog');return dialog;},body:{append(){}}};
 const ctx={window:{FOODS:foods,addEventListener(){}},document,localStorage:{getItem:key=>key==='fengwu.food-records.v1'?saved:null}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/food-records.js'),'utf8'),ctx);
 ctx.window.FoodRecords.open();
 assert.equal(dialog.open,true);
 const entries=[...recordList.innerHTML.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(match=>match[0]);
 assert.equal(entries.length,2);
 const unpictured=entries.find(html=>html.includes('food=unpictured')),pictured=entries.find(html=>html.includes('food=pictured'));
 assert.ok(unpictured.includes('暂无图片的一味'),'the food name and detail link remain available');
 assert.doesNotMatch(unpictured,/<img\b/,'an absent source is rendered as a text placeholder, not a broken image');
 assert.match(pictured,/<img\b[^>]*src="assets\/known-photo\.webp"/,'existing photos still render');
 assert.doesNotMatch(recordList.innerHTML,/<img\b[^>]*src\s*=\s*["']\s*["']|\bundefined\b/);
});
