'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8'),html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),css=fs.readFileSync(path.join(root,'dist/social-experience.css'),'utf8');

test('the four public categories are shared by the homepage and map while the source taxonomy stays internal',()=>{
 assert.match(app,/categoryNames=\{vegetable:'蔬菜',fruit:'水果',protein:'肉类',other:'其他'\}/);
 assert.match(app,/food\.category==='vegetable'\|\|food\.category==='fruit'.*\['protein','seafood'\]/);
 assert.match(html,/<select id="mapCategory"[\s\S]*?<option value="vegetable">蔬菜<\/option><option value="fruit">水果<\/option><option value="protein">肉类<\/option><option value="other">其他<\/option>/);
 assert.doesNotMatch(html,/<option value="(?:fungus|flower|tea|seed|spice|oilseed)">/);
});

test('homepage display imagery uses ingredient identification photos, leaving dish photography to details',()=>{
 assert.match(app,/const originalSrc=role==='appetite'\|\|role==='recognition'\?food\.image\|\|food\.cardImage:food\.cardImage\|\|food\.image/);
 assert.doesNotMatch(app,/const edible=role==='appetite'.*food\.dishImage/);
 assert.match(app,/role==='appetite'&&!\['houtui-cai','rugao-takecai','gaochun-liuyuehuang'\]/);
});

test('map and flavor tree expose pointer, trackpad, pinch and visible zoom controls',()=>{
 assert.match(html,/id="mapZoomOut"[\s\S]*id="mapZoomIn"/);
 assert.match(app,/mapImage\.addEventListener\('wheel',[\s\S]*event\.ctrlKey/);
 assert.match(app,/startMapGesture\(\)[\s\S]*type:'pinch'/);
 assert.match(html,/id="flavorZoomOut"[\s\S]*id="flavorZoomIn"[\s\S]*id="flavorZoomReset"/);
 assert.match(app,/const starTerms=termWindow\.slice\(\)\.sort\(\(a,b\)=>a\.index-b\.index\)/);
 assert.match(app,/Math\.floor\(event\.index\/6\)/);
 assert.match(app,/canvas\.addEventListener\('wheel'/);
 assert.match(css,/\.flavor-zoom-controls/);
});

test('the page carries a readable build marker for release verification',()=>assert.match(html,/版次 2026\.10\.23 · 四类风物 \/ 节气风味树/));
