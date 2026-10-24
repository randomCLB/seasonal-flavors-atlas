'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
test('search photographs keep a readable text column and move long regional labels below the ingredient name',()=>{const css=fs.readFileSync(path.join(__dirname,'../dist/reader-access.css'),'utf8');assert.match(css,/button\[data-food\]\{display:grid;grid-template-columns:72px minmax\(0,1fr\)/);assert.match(css,/>em\{grid-column:2;/);assert.match(css,/grid-template-columns:54px minmax\(0,1fr\)/);});
