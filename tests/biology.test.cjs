'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {load}=require('../scripts/audit-reader-access.cjs');
test('reviewed identities render evidence without inventing species or origins',()=>{
 const ctx=load();vm.runInContext(fs.readFileSync('dist/biology.js','utf8'),ctx);
 const {FoodBiology:biology}=ctx.window;
 const chayote=biology.html({id:'foshougua-miao'});
 assert.match(chayote,/Sicyos edulis/);assert.match(chayote,/Sechium edule/);
 assert.match(chayote,/1991 年起源研究/);assert.match(chayote,/年代仍有争议/);
 assert.match(biology.html({id:'congjun'}),/种暂未核实/);
 assert.match(biology.html({id:'binchuan-renong1-yuganzi'}),/2019/);
 assert.equal(biology.html({id:'ganbajun'}),'');
 assert.equal(biology.html({id:'unknown'}),'');
});
