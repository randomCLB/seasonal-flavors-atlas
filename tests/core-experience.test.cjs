'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,'dist',n),'utf8');
const P=require('../dist/food-purchase.js'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js');
const ctx={window:{FoodPurchase:P,FoodRecords:{render:()=>''}}};vm.createContext(ctx);
vm.runInContext(read('solar-terms.js'),ctx);
const data=['data.js','editorial.js','editorial-notes.js','november-additions.js','core-refinements.js','winter-additions.js','seasonal-additions.js','term-gap-additions.js','editorial-copy.js'];
for(const file of [...data,'lottery-profiles.js','lottery-senses.js','food-detail.js'])vm.runInContext(read(file),ctx);
const foods=ctx.window.FOODS,byId=Object.fromEntries(foods.map(f=>[f.id,f]));
test('all live entrypoints use the same ordered catalog, including November and refinements',()=>{
 for(const page of ['index.html','tarot.html','lottery.html']){
  const scripts=[...read(page).matchAll(/<script src="([^"?]+)/g)].map(m=>m[1]);
  assert.deepEqual(scripts.filter(s=>data.includes(s)),data,page);
  assert.ok(scripts.indexOf('photo-review.js')>scripts.indexOf('term-gap-additions.js','editorial-copy.js'),page);
  assert.ok(scripts.indexOf('food-purchase.js')<scripts.findIndex(s=>['app.js','tarot-spread-ui.js','lottery-ui.js'].includes(s)));
 }
 const auditedCatalog=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-core-batch.cjs'],{cwd:root,encoding:'utf8'}));
 assert.equal(foods.length,auditedCatalog.catalogCount);assert.equal(new Set(foods.map(f=>f.id)).size,auditedCatalog.catalogCount);
});
test('Sanzhi red-sheath water bamboo is limited to the documented 2026 harvest-event dates with labeled editorial art',()=>{
 const f=byId['sanzhi-red-sheath-jiaobai'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'10-31,11-01');assert.equal(f.sourceYears.join(','),'2026');assert.equal(C.isPeakDay(f,'2026-10-31'),true);assert.equal(C.isPeakDay(f,'2026-11-02'),false);assert.equal(C.isPeakDay(f,'2027-10-31'),false);assert.match(f.season,/不代表活动已举办/);assert.ok(f.sources.some(x=>x[1]==='https://www.sanzhi.ntpc.gov.tw/home.jsp?act=be4f48068b2b0031&dataserno=9059d965ab024ea007376349035c3b25&id=274b37750a0ba621'));assert.match(f.imageCaption,/不是实物摄影/);assert.ok(f.procurement.checks.length>=2);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Lixian highland cherries add a sourced mid-May exclusive term entry with reviewed generic artwork and draw signatures',()=>{
 const f=byId['lixian-highland-cherry'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'05-11,05-20');assert.match(f.season,/五月中旬/);assert.match(f.seasonEvidence,/不保证 2027 年/);assert.ok(f.procurement.checks.length>=2);assert.match(f.imageCaption,/不用于理县产地或品种鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Yinghu Daxing loquat follows the sourced late-spring maturity window and keeps cultivar claims separate from its generated image',()=>{
 const f=byId['ankang-yinghu-daxing-loquat'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'05-15,06-05');assert.equal(f.seasonStartTerm,8);assert.match(f.season,/五月中下旬至六月初/);assert.match(f.imageCaption,/不用于产地或品种鉴别/);assert.ok(f.procurement.checks.length>=3);assert.ok(f.sources.some(x=>x[1]==='https://www.hanbin.gov.cn/Content-2916081.html'));assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(!pools['谷雨'].includes(f.id));assert.ok(pools['立夏'].includes(f.id));assert.ok(pools['小满'].includes(f.id));
});
test('Wanning Damao white-sugar-jar lychee has a recurring source-backed Guyu window and stays out of Lixia',()=>{
 const f=byId['wanning-damao-baitangying-lychee'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'04-25,05-04');assert.equal(f.entryTerms.join(','),'7');assert.equal(C.isPeakDay(f,'2027-05-04'),true);assert.equal(C.isPeakDay(f,'2027-05-05'),false);assert.match(f.season,/每年四月底至五月初/);assert.match(f.seasonEvidence,/日期差异/);assert.ok(f.procurement.checks.length>=2);assert.match(f.imageCaption,/不用于万宁产地或白糖罂品种鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foods]));assert.ok(pools['谷雨'].includes(f.name));assert.ok(!pools['立夏'].includes(f.name));
});
test('Qiongshan Sanmenpo Xiantao lychee uses the documented early-May Lixia harvest and stays distinct from Wanning Guyu lychee',()=>{
 const f=byId['qiongshan-sanmenpo-xiantaoli'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'05-05,05-15');assert.equal(f.entryTerms.join(','),'8');assert.match(f.season,/2025 年报道.*5 月 5 日/);assert.match(f.season,/不代表 2027 年/);assert.ok(f.sources.some(x=>x[1]==='https://agri.hainan.gov.cn/hnsnyt/gzny/mtjj/202605/t20260506_4069925.html'));assert.ok(f.sources.some(x=>x[1]==='https://res.hndaily.cn/file/news/20250529/cid_100_571961.html'));assert.ok(f.procurement.checks.length>=3);assert.match(f.imageCaption,/不作产地或品种鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['立夏'].includes(f.id));assert.ok(!pools['谷雨'].includes(f.id));assert.ok(!pools['小满'].includes(f.id));
});
test('Hubei Ejiao No. 4 summer water bamboo is limited to the documented mid-May window and labeled as a generic illustration',()=>{
 const f=byId['hubei-ejiao4-summer-jiaobai'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'05-11,05-20');assert.equal(f.entryTerms.join(','),'8');assert.match(f.season,/五月中旬上市/);assert.match(f.season,/不.*市场库存/);assert.ok(f.sources.some(x=>x[1]==='https://www.yx.gov.cn/ztzl/xdny/njtg/202003/t20200310_611690.html'));assert.ok(f.procurement.checks.length>=3);assert.match(f.imageCaption,/不用于鄂茭4号或产地鉴别/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(require('node:child_process').execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),pools=Object.fromEntries(audit.rows.map(row=>[row.term,row.foodIds]));assert.ok(pools['立夏'].includes(f.id));assert.ok(!pools['谷雨'].includes(f.id));assert.ok(!pools['小满'].includes(f.id));
});
test('Wuding Fawowo winter peach uses only the documented late-October window and labeled generic artwork',()=>{
 const f=byId['wuding-fawowo-winter-peach'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'10-23,10-31');assert.equal(f.entryTerms.join(','),'19');assert.match(f.season,/十月下旬/);assert.match(f.season,/不代表 2026 年/);assert.ok(f.sources.some(x=>x[1]==='https://www.ynwd.gov.cn/info/1050/50681.htm'));assert.match(f.imageCaption,/非武定发窝产地或品种实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Shidian Guyu fiddleheads use the reported spring window, explicit fern safety guidance and reviewed signatures',()=>{
 const f=byId['shidian-guyu-fiddleheads'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'04-20,05-04');assert.equal(f.entryTerms.join(','),'7');assert.match(f.season,/谷雨时节/);assert.match(f.description,/确认具体物种/);assert.match(f.safety,/焯水、浸泡并彻底煮熟/);assert.ok(f.sources.some(x=>x[1]==='https://www.shidian.gov.cn/info/1111/3821443.htm'));assert.ok(f.sources.some(x=>x[1]==='https://ynsjkj.yn.gov.cn/html/2025/jikongkepu_0331/603.html'));assert.match(f.imageCaption,/不用于物种鉴定/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Banan Wubu pomelo has a locality source, late-autumn window, honest generic illustration and reviewed draw tags',()=>{
 const f=byId['banan-wubu-pomelo'];assert.ok(f);assert.equal(f.seasonStartTerm,18);assert.equal(f.peakWindows[0].join(','),'10-21,11-10');assert.match(f.season,/十月下旬至十一月上旬/);assert.match(f.imageCaption,/通用柚类形态参考/);assert.ok(f.procurement.checks.length>=2);assert.ok(f.sources.some(x=>x[1]==='https://dfz.cq.gov.cn/zqlswh/ntcp/202311/t20231102_12511851.html'));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('winter-solstice addition is source-backed, searchable and clearly marked as a generic generated reference',()=>{
 const f=byId['huadu-jingtang-lotusroot'];assert.ok(f);assert.equal(f.entryTerms.join(','),'23');assert.equal(f.peakMonths.join(','),'12');
 assert.match(f.sources[0][1],/^https:\/\//);assert.ok(f.procurement.checks.length>=2);assert.match(f.imageAlt,/生成示意图/);assert.match(f.imageCaption,/不用于产地或品种鉴别/);
 assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Ningbo winter beltfish keeps its local winter-solstice scope and source-backed media labels',()=>{
 const f=byId['ningbo-youdai'];assert.ok(f);assert.equal(f.entryTerms.join(','),'23');assert.equal(f.peakMonths.join(','),'12');
 assert.equal(f.sources.length,2);assert.ok(f.procurement.checks.length>=2);assert.match(f.imageCaption,/不证明宁波产地/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Bomi wood pear has a documented winter-solstice harvest window and is not treated as an October pear',()=>{
 const f=byId['bomi-winter-muli'];assert.ok(f);assert.equal(f.entryTerms.join(','),'23');assert.equal(f.seasonStartTerm,23);assert.equal(f.peakWindows[0].join(','),'12-21,12-31');
 assert.match(f.seasonEvidence,/每年冬至前后/);assert.equal(f.sources.length,1);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Xinhui winter-after mandarin is a late-harvest batch, not a new cultivar or ordinary Da Hong Gan window',()=>{
 const f=byId['xinhui-winter-after-mandarin'];assert.ok(f);assert.equal(f.entryTerms.join(','),'23');assert.equal(f.peakWindows[0].join(','),'12-22,12-31');
 assert.match(f.seasonEvidence,/2025 年报道/);assert.match(f.description,/不是另一个柑橘品种/);assert.match(f.imageCaption,/非新会产地/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Wuhua Longcun highland sweet potato is limited to the reported post-solstice harvest window and cultivar scope',()=>{
 const f=byId['wuhua-longcun-mountain-sweet-potato'];assert.ok(f);assert.equal(f.entryTerms.join(','),'23');assert.equal(f.peakWindows[0].join(','),'12-22,12-31');
 assert.match(f.seasonEvidence,/2024 年报道/);assert.match(f.pitfall,/普薯 32 号/);assert.match(f.imageCaption,/非五华龙村或普薯 32 号实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Minhou Wenxi juyou stays within the reported winter-solstice to mid-January harvest period',()=>{
 const f=byId['minhou-wenxi-juyou'];assert.ok(f);assert.equal(f.entryTerms.join(','),'23');assert.equal(f.peakWindows[0].join(','),'12-22,01-15');
 assert.match(f.seasonEvidence,/冬至前后开采至次年一月中旬/);assert.match(f.imageCaption,/非闽侯汶溪/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Hengyang Zhuhui golden tribute pomelo is limited to its reported mid-December window',()=>{
 const f=byId['hengyang-zhuhui-golden-pomelo'];assert.ok(f);assert.equal(f.entryTerms.join(','),'22');assert.equal(f.peakWindows[0].join(','),'12-15,12-21');
 assert.match(f.season,/12月中旬/);assert.match(f.tarotImage.note,/通用柚类形态参考/);assert.ok(fs.existsSync(path.join(root,'dist',f.tarotImage.src)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Xinhui Yamen sweet-water radish keeps the reported winter-solstice window and generic image label',()=>{
 const f=byId['xinhui-yamen-tianshui-radish'];assert.ok(f);assert.equal(f.entryTerms.join(','),'23');assert.equal(f.peakWindows[0].join(','),'12-14,12-29');
 assert.match(f.seasonEvidence,/冬至前后一周/);assert.match(f.description,/农产品地理标志/);assert.match(f.imageCaption,/不用于新会品种或产地鉴别/);
 assert.match(f.search,/新会崖门.*鲜品/);assert.equal(f.steps.length,3);assert.match(f.steps[2],/不代表地方店家配方/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('spring additions use source-backed windows, clear image labels, procurement checks and current lottery signatures',()=>{
 const expected=[
  ['gejiu-cinaobao','https://www.hhgj.gov.cn/info/6691/398081.htm','03-29,04-10'],
  ['conghua-lutian-bitter-shoot','https://www.conghua.gov.cn/zjch/chgk/chlylyzx/content/post_10202286.html','03-29,04-20'],
  ['wulong-taiwan-long-mulberry','https://ws.cq.gov.cn/jz/wsgbz/jzdt/202404/t20240417_13137147.html','04-15,05-15']
 ];
 for(const [id,source,window] of expected){const f=byId[id];assert.ok(f,id);assert.equal(f.peakWindows[0].join(','),window,id);assert.ok(f.sources.some(x=>x[1]===source),id);assert.ok(f.procurement.checks.length>=2,id);assert.match(f.imageCaption,/不用于|不证明|非.*实拍/,id);assert.ok(fs.existsSync(path.join(root,'dist',f.image)),id);assert.equal(ctx.window.LOTTERY_PROFILES[id].signature,C.signature(f),id);assert.equal(ctx.window.LOTTERY_PROFILES[id].senses.signature,C.sensorySignature(f),id);}
});
test('Yaoan edible rose is limited to its reported spring harvest window and distinguished from ornamental roses',()=>{
 const f=byId['yaoan-edible-rose'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'04-20,05-15');assert.equal(f.entryTerms.join(','),'6,7');
 assert.ok(f.sources.some(x=>x[1]==='https://yaoan.gov.cn/info/10593/510524.htm'));assert.match(f.safety,/观赏花不入口/);assert.match(f.imageCaption,/不证明品种、产地或食用栽培身份/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Xuanzhou Shuidong cherries have a source-backed short harvest window and a generic non-identifying illustration',()=>{
 const f=byId['xuanzhou-shuidong-cherry'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'04-20,05-10');assert.equal(f.entryTerms.join(','),'7,8');
 assert.ok(f.sources.some(x=>x[1]==='https://www.xuancheng.gov.cn/News/show/1708955.html'));assert.match(f.season,/不代表 2027 年具体成熟日/);assert.match(f.imageCaption,/不是水东产地或品种实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Minhou Baisha late longans stay in the White Dew approximate harvest window',()=>{
 const f=byId['minhou-baisha-late-longan'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'09-08,09-15');assert.equal(f.entryTerms.join(','),'16');
 assert.ok(f.sources.some(x=>x[1]==='https://www.fuzhou.gov.cn/zwgk/zdlyxxgk/xczx/jjxc/202509/t20250916_5078618.htm'));assert.match(f.season,/白露前后/);assert.match(f.imageCaption,/产地或品种实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Wenchuan Qingcui plums use the reported July harvest, source, and non-identifying artwork',()=>{
 const f=byId['wenchuan-qingcui-plum'];assert.ok(f);assert.equal(f.peakMonths.join(','),'7');assert.equal(f.seasonStartTerm,13);assert.equal(f.entryTerms.join(','),'13');
 assert.ok(f.sources.some(x=>x[1]==='https://wenchuan.gov.cn/wcxrmzf/jrwc/202607/e4bf1ddf20fe43f2828d76d7ba64fbfe.shtml'));assert.match(f.season,/2026 年 7 月 31 日/);assert.match(f.imageCaption,/非汶川产地/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Shidian autumn long bamboo shoots stay within the reported post-Liqiu season and distinguish edible preparation from sweet bamboo',()=>{
 const f=byId['shidian-autumn-longzhu-shoot'];assert.ok(f);assert.equal(f.seasonStartTerm,14);assert.deepEqual(Array.from(f.peakMonths),[8]);assert.equal(f.entryTerms.join(','),'14,15');
 assert.ok(f.sources.some(x=>x[1]==='https://www.shidian.gov.cn/info/1111/3845333.htm'));assert.match(f.pitfall,/甜龙竹/);assert.match(f.safety,/焯水/);assert.match(f.imageCaption,/非施甸实拍/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Hulin liuhao shoots are limited to the locally reported late-May wild-vegetable window and safe sourcing',()=>{
 const f=byId['hulin-liuhao-shoot'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'05-15,05-31');assert.equal(f.entryTerms.join(','),'8,9');
 assert.ok(f.sources.some(x=>x[1]==='https://www.hljhulin.gov.cn/hls/c100910/202605/c06_363571.shtml'));assert.match(f.safety,/不要凭图片或俗名自行采食/);assert.match(f.imageCaption,/物种鉴别图/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Yellow and Bohai eagle-claw shrimp has a sourced Start-of-Winter window and distinct local names',()=>{
 const f=byId['huangbohai-yingzhuaxia'];assert.ok(f);assert.equal(f.seasonStartTerm,20);assert.deepEqual(Array.from(f.peakMonths),[11]);
 assert.match(f.season,/不代表 2026 年具体渔获/);assert.equal(f.placeSeasons[0].source,'https://jgs.agri.gov.cn/detail/zh/39871.html');
 assert.match(f.imageCaption,/非实物摄影/);assert.match(f.procurement.checks.join(' '),/鹰爪虾/);
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('Yongjia Hesheng persimmon is scoped to its reported pre-winter harvest and not confused with other persimmons',()=>{
 const f=byId['yongjia-hesheng-red-persimmon'];assert.ok(f);assert.equal(f.entryTerms.join(','),'20');assert.equal(Array.from(f.peakMonths).join(','),'11');
 assert.ok(f.sources.some(x=>x[1]==='https://www.ourchinastory.com/cn/9169'));assert.match(f.season,/立冬前后/);assert.match(f.imageCaption,/不证明永嘉产地/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));
 assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
test('twelve records have actionable state checks and source-backed comparison without altering recipes',()=>{
 const previous=JSON.parse(fs.readFileSync(path.join(root,'docs/first-batch-20261018/before-foods.json'),'utf8'));
 assert.equal(Object.keys(ctx.window.CORE_REFINEMENTS).length,12);
 for(const old of previous){const f=byId[old.id];assert.ok(f.procurement.checks.length>=2);assert.ok(f.procurement.route);assert.match(f.comparison.source,/^https:\/\//);assert.equal(C.signature(f),C.signature(old),f.id);}
 for(const f of foods){const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f),f.id);assert.equal(p.senses.signature,C.sensorySignature(f),f.id);}
});
test('search query round-trips punctuation and cannot inject markup or destinations',()=>{
 const f={name:'test',search:'台东 花萼 & "鲜货" #? 🍒',procurement:{checks:['<img onerror=bad()>']}};
 const links=P.links(f);assert.deepEqual(links.map(x=>new URL(x.url).hostname),['www.bing.com','s.taobao.com','search.jd.com']);
 for(const x of links){const u=new URL(x.url);assert.equal(u.searchParams.get(u.hostname==='search.jd.com'?'keyword':'q'),f.search);}
 const html=P.render(f);assert.ok(!html.includes('<img onerror'));assert.ok(html.includes('&lt;img'));assert.equal((html.match(/target="_blank"/g)||[]).length,3);assert.match(html,/rel="noopener noreferrer"/);
});
test('optional local city only augments search terms and is never presented as verified stock',()=>{
 const f={name:'test',search:'兰州 鲜甜百合 鲜货'};P.setCity('西安 & 周边');
 const links=P.links(f);for(const x of links){const u=new URL(x.url);assert.equal(u.searchParams.get(u.hostname==='search.jd.com'?'keyword':'q'),'兰州 鲜甜百合 鲜货 西安 & 周边');}
 const html=P.render(f);assert.match(html,/按 <strong>西安 &amp; 周边<\/strong> 的线索搜索/);assert.match(html,/不代表本地有货/);assert.match(html,/maxlength="40"/);assert.match(html,/供应情况请自行核对/);P.setCity('');
});
test('every food can show a procurement entry with a manual-copy fallback and honest stock label',()=>{
 for(const f of foods){const html=P.render(f);assert.match(html,/去找这味/);assert.match(html,/供应情况请自行核对/);assert.match(html,/<textarea readonly/);assert.equal((html.match(/target="_blank"/g)||[]).length,3);}
});
test('refined display media exists, identifies generated references and excludes pending-license dishes',()=>{
 const prohibited=['cizhousun-salad.jpg','baoying-cigu-pork2.jpg','zengcheng-caixin-plem.jpg','lyg-shaguang-soup.jpg','lintong-huojing-cut.jpg','jinjiang-zicai-soup.jpg'];
 for(const id of Object.keys(ctx.window.CORE_REFINEMENTS)){
  const f=byId[id],m=T.mediaFor(f);assert.ok(m,id);assert.ok(fs.existsSync(path.join(root,'dist',m.src)));
  assert.ok(!prohibited.some(p=>m.src.endsWith(p)),id);
  if(/generated/.test(m.src))assert.match(T.imageNote(f),/生成/);
  const recognition={src:f.image||f.cardImage,alt:f.imageAlt||f.cardImageAlt,note:f.imageCaption||f.cardNote,fit:'cover'};
  const html=ctx.window.FoodDetail.html(f,{recognition,seasonLabel:'时令参考',category:'test',originHtml:'',similar:[],imageAttrs:''});
  assert.equal((html.match(/class="reader-section"/g)||[]).length,4);
  if(f.dishImage===recognition.src)assert.equal((html.match(/<img /g)||[]).length,1,id);
 }
});

test('Longlin March plum is a single-year source-backed Grain Rain addition with transparent uncertainty',()=>{
 const f=byId['longlin-march-plum'];assert.ok(f);assert.equal(f.peakWindows[0].join(','),'04-20,05-05');assert.equal(Array.from(f.sourceYears).join(','),'2026');assert.equal(C.isPeakDay(f,'2026-04-22'),true);assert.equal(C.isPeakDay(f,'2027-04-22'),false);assert.equal(f.entryTerms.join(','),'7');assert.match(f.season,/2026 年 4 月 22 日/);assert.match(f.season,/不代表其他年份/);assert.ok(f.sources.some(x=>x[1]==='https://m.longlin.gov.cn/index.php?c=show&id=77870'));assert.match(f.imageCaption,/非隆林产地/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].signature,C.signature(f));assert.equal(ctx.window.LOTTERY_PROFILES[f.id].senses.signature,C.sensorySignature(f));
});
