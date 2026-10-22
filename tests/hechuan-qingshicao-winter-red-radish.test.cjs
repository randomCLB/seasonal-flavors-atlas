'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Hechuan Qingshicao red radish is a sourced Winter Solstice entry',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='hechuan-qingshicao-winter-red-radish',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.equal(food.category,'vegetable');assert.deepEqual(Array.from(food.peakTerms),[23]);assert.deepEqual(Array.from(food.entryTerms),[23]);
 assert.match(food.season,/冬至至春节/);assert.match(food.description,/皮脆、肉嫩/);assert.ok(food.sources.some(x=>x[1]==='https://www.hc.gov.cn/sjzzz/202105/t20210521_9314885.html'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非青草坝红皮萝卜实拍/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const term=audit.rows.find(x=>x.term==='冬至'),previous=audit.rows.find(x=>x.term==='大雪');
 assert.ok(term.foodIds.includes(id));assert.ok(!previous.foodIds.includes(id));
});
