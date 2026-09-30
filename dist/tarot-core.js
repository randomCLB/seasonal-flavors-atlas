/* A fictional oracle over real seasonal recipe records. No preference scoring. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./lottery-core.js'),require('./tarot-deck.js'));else root.FengwuTarot=factory(root.FengwuLottery,root.FengwuTarotDeck);})(globalThis,function(C,deck){
'use strict';
const VERSION='tarot-1',DISCLAIMER='签文为虚构的餐桌占卜，仅供娱乐；不预测运势。时令、吃法与图片说明来自风物资料。';
const DISH_NAMES={'nanhu-ling':'熟煮南湖菱','jitoumi':'桂花鸡头米','foshougua-miao':'蒜香佛手瓜苗','cinenya':'蘸酱刺嫩芽','cigu':'慈姑烧肉','dier':'地耳鸡蛋汤','zengcheng-caixin':'白灼增城迟菜心','tanglihua':'凉拌棠梨花','houtui-cai':'猴腿菜炒肉丝'};
function dishName(food){return DISH_NAMES[food.id]||food.recipeTitle;}
function currentTerm(events,now){if(!Number.isFinite(now)||events.length<2||now<events[0].time||now>=events.at(-1).time)throw Error('节气资料未覆盖此刻，请先回风物首页逛逛。');let i=events.findIndex(e=>e.time>now)-1;return {...events[i],end:events[i+1].time};}
function preferences(avoid=[],excludeText=''){const prefs={avoid,excludeText,tastes:[],textures:[],cooking:[],curiosity:0};return C.validatePrefs(prefs);}
function pool({foods,profiles,events,now,avoid=[],excludeText=''}){
 currentTerm(events,now);const prefs=preferences(avoid,excludeText),excluded=C.resolveExclusions(excludeText,foods);
 if(excluded.unknown.length)throw Error(`尚未识别：${excluded.unknown.join('、')}。请用本站食材名或已有忌口选项。`);
 const day=C.dayAt(now),slot={startDay:day,endDay:day};
 return foods.filter(f=>f.dishImage&&/^assets\/[a-zA-Z0-9._/-]+$/.test(f.dishImage)&&!f.dishImage.includes('..')&&f.recipeTitle&&f.ingredients&&f.steps?.length&&C.eligible(f,profiles[f.id],prefs,excluded.ids)).map(f=>({food:f,days:C.candidateDays(f,profiles[f.id],slot,events)})).filter(x=>x.days.length).map(x=>({food:x.food,place:x.days[0]}));
}
function imageNote(f){return /generated|示意图/.test(`${f.dishImage} ${f.dishImageAlt}`)?'生成示意图，非实物摄影；不用于品种鉴别。':'成菜参考图，不代表本次购买的实物或指定产地实拍。';}
const MOTIFS={
'nanhu-ling':'菱角把果肉藏在硬壳里。去壳不是失去保护，而是让真正值得品尝的一面终于露出来。',
'jitoumi':'一粒粒鸡头米从层层果壳里被剥出，才与桂花在碗中相遇。牌面将它读作：被认真对待的小事，也有自己的光。',
'huoshan-yanghe':'阳荷把清脆与姜样辛香藏在同一个花苞里。它不必变得温顺才值得被喜欢，有一点自己的锋芒也很好。',
'zhenlai-jiaobai':'茭白的温和清甜与肉丝的咸鲜各留一席。牌面让它们同锅，是想说不同的愿望未必只能二选一。',
'hanshou-yubiou':'藕片留着一圈小孔，酸味便有了经过的路径。牌面把这读成：给日常留一点空隙，另一种滋味才进得来。',
'cizhousun':'笋芯从层层包裹中露面，做熟后才与酸味相逢。牌面不催它快些长大，只请你在合适的时刻认识它。',
'juema':'小小的蕨麻落进米粥，存在感并不靠体积证明。认真熬成的一碗，把不起眼的细节也好好接住。',
'xunyang-guizao':'拐枣真正入口的是弯曲的肉质果梗。牌面借它提醒：好滋味未必长在你第一眼认定的位置。',
'lyg-shaguang-fish':'鱼与豆腐在汤中相遇，浓淡终于不必彼此争执。牌面把这份互相成全，留作今晚的答案。',
'cigu':'慈姑吸住肉汁，却仍保留自己的粉糯与一点回苦。牌面把它读作：接受别人的好意，不必交出自己的性格。',
'shazhou-zhugengqin':'水芹的草本气息遇到香干的咸香，一脆一柔，各自清楚。相宜不是变得一样，而是同桌时都不必沉默。',
'liyang-baixin':'浅色白芹与香干在热锅里并肩，仍各有一口脆与韧。牌面把这份分明，解释为恰到好处的距离。'
};
function bridge(food,profile,card){
 const cooking=(profile.senses?.cooking||[]),tag=(food.flavor||[]).join('、');
 let action='食材到餐桌的这一段路，让抽象的期待有了可以品尝的形状。';
 if(cooking.includes('stirfry'))action='热锅让不同的材料短暂相遇，再在恰好的时候离火。这对应着牌中的分寸：该行动时行动，不必把每个念头都久留锅中。';
 else if(cooking.includes('steam'))action='蒸汽绕过食材，慢慢把滋味聚拢。它回应着牌中的耐心：有些变化不必翻动不休，也在安静地发生。';
 else if(cooking.includes('soup'))action='材料在一锅汤里逐渐交换滋味，却不必失去各自的形状。这是牌留给你的暗语：相处不必变成相同。';
 else if(cooking.includes('boil'))action='清水与食材相遇，繁复的装饰退到一旁。它回应着牌中的清晰：有些事情，减去多余之后反而更有味道。';
 else if(cooking.includes('fresh'))action='少量调味或简单处理，让原本的滋味先说话。这对应着牌中的倾听：不急着改造眼前之物，先认识它本来的样子。';
 return `因此，${card.name}把「${food.name}」交给了这道「${dishName(food)}」。${MOTIFS[food.id]||(tag?`风物资料里的${tag}，在这里被读作一组餐桌上的象征。`:'')}${MOTIFS[food.id]?'':action}`;
}
function reading(result,food,profile){const card=deck.find(c=>c.id===result.cardId);if(!card)throw Error('牌面无效');return {opening:result.reversed?card.down:card.up,connection:bridge(food,profile,card),closing:card.closing,omen:card.omen};}
function draw({foods,profiles,events,now=Date.now(),seed,position=1,avoid=[],excludeText='',history=[]}){
 if(typeof seed!=='string'||!seed.length||seed.length>200||![0,1,2].includes(position))throw Error('请重新洗牌。');
 const term=currentTerm(events,now),all=pool({foods,profiles,events,now,avoid,excludeText});
 if(!all.length)return {empty:true,term,reason:'这一刻，暂没有同时符合所选忌口、具有成菜图和时令资料的菜。不会用过季食材或忽略忌口来补位。'};
 const rng=C.random(`${VERSION}:${seed}:${position}:${C.dayAt(now)}`),card=deck[Math.floor(rng()*deck.length)],reversed=rng()<.32;
 // Recent dishes are softly avoided, but no timeless shelf-stable fallback is used.
 let candidates=all.filter(x=>!history.slice(-2).includes(x.food.id));if(!candidates.length)candidates=all.filter(x=>x.food.id!==history.at(-1));if(!candidates.length)candidates=all;
 const weights=candidates.map(x=>1+(card.families.includes(profiles[x.food.id].family)?1.5:0));let n=rng()*weights.reduce((a,b)=>a+b,0),chosen=candidates.at(-1);for(let i=0;i<candidates.length;i++){n-=weights[i];if(n<0){chosen=candidates[i];break;}}
 const result={version:VERSION,foodId:chosen.food.id,cardId:card.id,reversed,term,day:C.dayAt(now),place:chosen.place,seed,position,eligibleCount:all.length,repeated:chosen.food.id===history.at(-1)};result.reading=reading(result,chosen.food,profiles[chosen.food.id]);return result;
}
function copyText(result,food,base){const card=deck.find(c=>c.id===result.cardId),url=new URL('index.html',base);if(!['http:','https:'].includes(url.protocol))throw Error('页面地址无效');url.searchParams.set('food',food.id);return [`时令风物 · 塔罗签`,`${card.name} · ${result.reversed?'逆位':'正位'}｜${result.term.name}`,`今日命定菜：${dishName(food)}`,`用到的风物：${food.name} · ${result.place.place||result.place.name||''}`,result.reading.opening,result.reading.connection,result.reading.closing,result.reading.omen,`吃法与注意事项：${url.href}`,DISCLAIMER].join('\n\n');}
return {VERSION,deck,DISCLAIMER,dishName,currentTerm,preferences,pool,draw,reading,imageNote,copyText};
});
