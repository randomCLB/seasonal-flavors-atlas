'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);const C=require(path.join(root,'dist/lottery-core.js')),audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));

test('Keelung North Xiaoshu amberjack and red emperor are separate sourced catch entries with species and stock limits',()=>{
 const cases=[
  ['keelung-north-xiaoshu-red-amberjack','基隆北方小暑红魽','杜氏鰤','https://fishdb.sinica.edu.tw/eng/species.php?id=381549','cbb4d517','c9e50b11'],
  ['keelung-north-xiaoshu-red-emperor-bream','基隆北方小暑赤宗','黄背牙鲷','https://www.tfrin.gov.tw/redirect_files.php?file_name=SlashHamIpQIyvb4q7LkKhaVK7cHvD5MltUbVZv0bW7P7UXVd17PrWGSlashLZx9CNWGPlusQNWqohOWG&id=61468','19a70e23','97c8ad1f']
 ];
 for(const [id,name,species,speciesUrl,signature,senses] of cases){const f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];assert.ok(f);assert.equal(f.name,name);assert.deepEqual(Array.from(f.peakTerms),[12]);assert.equal(f.seasonPrecision,'solar-term-window');assert.match(f.season,/不表示当年有货|不表示现在有货/);assert.match(f.description,new RegExp(species));assert.ok(f.sources.some(x=>x[1]==='https://www.moa.gov.tw/ws.php?id=2507783'));assert.ok(f.sources.some(x=>x[1]===speciesUrl));assert.match(f.imageCaption,/不用于物种、产地或当年渔获鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(p.signature,C.signature(f));assert.equal(p.signature,signature);assert.equal(p.senses.signature,C.sensorySignature(f));assert.equal(p.senses.signature,senses)}
 const xiaoshu=audit.rows.find(x=>x.term==='小暑');for(const id of cases.map(x=>x[0])){assert.ok(xiaoshu.foodIds.includes(id));assert.ok(!audit.rows.find(x=>x.term==='大暑').foodIds.includes(id))}
});
