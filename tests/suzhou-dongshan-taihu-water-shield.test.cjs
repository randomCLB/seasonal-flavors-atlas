'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Suzhou Dongshan Taihu water shield is featured at its sourced early-spring window',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='suzhou-dongshan-taihu-water-shield',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[4]);assert.deepEqual(Array.from(food.entryTerms),[4]);assert.match(food.season,/3月中下旬至6月最鲜嫩/);assert.match(food.season,/惊蛰作为春季初上市线索/);assert.match(food.description,/叶片下方/);assert.match(food.pitfall,/鲜品、盐渍品和瓶装品/);
 assert.ok(food.sources.some(x=>x[1]==='https://nyncj.suzhou.gov.cn/nlj/zwyw/202404/e034a8dceec64a59b1afcc89ae5a94ce.shtml'));assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非产地或等级鉴别/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));const jingzhe=audit.rows.find(x=>x.term==='惊蛰'),spring=audit.rows.find(x=>x.term==='春分');
 assert.ok(jingzhe.foodIds.includes(id));assert.ok(!spring.foodIds.includes(id));
});
