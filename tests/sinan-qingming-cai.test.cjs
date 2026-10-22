'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('思南鼠曲草嫩苗按清明前后较佳采食窗口收录并与当地清明粑相连',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='sinan-qingming-cai-mouse-ear',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js');assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[6]);assert.deepEqual(Array.from(food.entryTerms),[6]);assert.equal(food.seasonStartTerm,5);assert.equal(food.category,'vegetable');assert.ok(food.sources.some(source=>source[1]==='https://gz.people.com.cn/BIG5/n2/2020/0330/c375237-33913890-7.html'));assert.ok(food.sources.some(source=>source[1]==='https://gz.people.com.cn/n2/2026/0327/c405505-41535845.html'));assert.match(food.description,/鼠曲草/);assert.match(food.safety,/不要自行采摘野生植物/);assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 assert.ok(food.sources.some(x=>x[1]==='https://gz.people.com.cn/BIG5/n2/2020/0330/c375237-33913890-7.html'));assert.ok(food.sources.some(x=>x[1]==='https://gz.people.com.cn/n2/2026/0327/c405505-41535845.html'));
 const profile=ctx.window.LOTTERY_PROFILES[id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),qingming=audit.rows.find(x=>x.term==='清明'),spring=audit.rows.find(x=>x.term==='春分');assert.ok(qingming.foodIds.includes(id));assert.ok(!spring.foodIds.includes(id));assert.equal(qingming.repeatRate,.5);assert.equal(qingming.withinLimit,true);assert.equal(audit.overLimit,audit.rows.filter(row=>!row.withinLimit).length);
});
