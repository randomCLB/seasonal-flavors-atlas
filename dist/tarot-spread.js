/* Three-card ritual over the existing seasonal pool. All meanings are fictional. */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./lottery-core.js'), require('./tarot-core.js'));
  else root.FengwuTarotSpread = factory(root.FengwuLottery, root.FengwuTarot);
})(globalThis, function(C, T) {
  'use strict';
  const VERSION = 'tarot-spread-1';
  const ROLES = [
    {name:'此刻', number:'I', question:'你带来了什么', prefix:'第一张牌照见此刻的底色。'},
    {name:'转机', number:'II', question:'让什么发生变化', prefix:'第二张牌不是另一个答案，而是对第一张的转折。'},
    {name:'指引', number:'III', question:'把答案落到餐桌', prefix:'第三张牌为前面的线索收尾，让它们成为一道可以端上桌的菜。'}
  ];
  const cardsById = Object.fromEntries(T.deck.map(card => [card.id, card]));
  function assertRound(round) {
    if (!round || round.version !== VERSION || typeof round.seed !== 'string' || !round.seed || round.seed.length > 200) throw Error('牌局无效，请重新洗牌。');
    if (!['cut','drawing','complete'].includes(round.phase) || !Array.isArray(round.pile) || round.pile.length !== T.deck.length || !Array.isArray(round.draws)) throw Error('牌局无效，请重新洗牌。');
    if (new Set(round.pile.map(card=>card.id)).size !== T.deck.length || round.pile.some(card=>!cardsById[card.id] || typeof card.reversed !== 'boolean')) throw Error('牌叠有重复或缺失，请重新洗牌。');
    if (round.draws.length > 3 || new Set(round.draws).size !== round.draws.length || round.draws.some(i=>!Number.isInteger(i) || i<0 || i>=round.pile.length)) throw Error('抽牌顺序无效。');
    if ((round.phase==='cut' && (round.draws.length || round.cut!==null)) || (round.phase!=='cut' && ![0,1,2].includes(round.cut)) || (round.phase==='complete') !== (round.draws.length===3)) throw Error('牌局阶段不一致，请重新洗牌。');
    return round;
  }
  function shuffle(seed) {
    if (typeof seed !== 'string' || !seed || seed.length>200) throw Error('请重新洗牌。');
    const rng=C.random(VERSION+':'+seed), pile=T.deck.map(card=>({id:card.id,reversed:rng()<.32}));
    for(let i=pile.length-1;i>0;i--) {const j=Math.floor(rng()*(i+1));[pile[i],pile[j]]=[pile[j],pile[i]];}
    return {version:VERSION,seed,phase:'cut',cut:null,pile,draws:[]};
  }
  function cut(round, position) {
    assertRound(round);
    if(round.phase!=='cut' || ![0,1,2].includes(position)) throw Error('这一副牌已经切好，或切牌位置无效。');
    const offset=Math.floor(round.pile.length*(position+1)/4);
    return {...round,phase:'drawing',cut:position,pile:[...round.pile.slice(offset),...round.pile.slice(0,offset)],draws:[]};
  }
  function take(round, index) {
    assertRound(round);
    if(round.phase!=='drawing' || round.draws.length>=3) throw Error('请先切牌；每副牌只取三张。');
    if(!Number.isInteger(index) || index<0 || index>=round.pile.length || round.draws.includes(index)) throw Error('这张牌已经入阵，换一张仍背面朝上的牌。');
    const draws=[...round.draws,index];
    return {...round,draws,phase:draws.length===3?'complete':'drawing'};
  }
  function selected(round) {
    assertRound(round);
    return round.draws.map((index,slot)=>({...round.pile[index],index,slot,role:ROLES[slot].name}));
  }
  function cardText(entry) {
    const card=cardsById[entry.id],role=ROLES[entry.slot];
    if(!card || !role) throw Error('牌面无效。');
    return {role:role.name,question:role.question,name:card.name,position:entry.reversed?'逆位':'正位',key:card.key,text:role.prefix+(entry.reversed?card.down:card.up)};
  }
  function affinity(food,profile,entries) {
    // Symbolic contributions, not a claim about traditional divination or nutrition.
    const cooking=profile.senses?.cooking||[];
    const elementMethods={火:['stirfry'],水:['soup','steam'],土:['boil'],风:['fresh']};
    const contributions=entries.map((entry,i)=> {
      const card=cardsById[entry.id], family=card.families.includes(profile.family)?1:0;
      const method=(elementMethods[card.element]||[]).some(key=>cooking.includes(key))?.35:0;
      return (family+method)*[.9,1.2,1.6][i]*(entry.reversed?.72:1);
    });
    return {weight:1+contributions.reduce((sum,n)=>sum+n,0),contributions};
  }
  function interpret(entries,food,profile) {
    const cards=entries.map(entry=>cardsById[entry.id]), reversed=entries.filter(e=>e.reversed).length;
    const elements=cards.map(c=>c.element), same=elements.every(e=>e===elements[0]);
    const dialogue=same
      ? `三张牌都落在「${elements[0]}」的意象里。牌阵没有分散方向，而是请你把一件小事认真做完整。`
      : `「${cards[0].name}」先起势，「${cards[1].name}」为它添了一次转折，最后由「${cards[2].name}」收束。不同意象不是互相否定，而是在替同一餐分工。`;
    const orientation=reversed===0?'三张正位让线索向前展开：不必再等一个更隆重的理由，这一餐就可以开始。':reversed===3?'三张逆位也不是坏签。它们把问题从「还要增加什么」改成了「哪些多余的要求可以放下」。':`其中${reversed===1?'一张逆位留出停顿':'两张逆位收住了节奏'}，其余正位仍让故事向前。牌阵要的不是一路用力，而是分清什么时候行动、什么时候留白。`;
    const last=T.reading({cardId:entries[2].id,reversed:entries[2].reversed},food,profile);
    return {cards:entries.map(cardText),opening:dialogue,connection:`所以，这三张牌共同点了「${T.dishName(food)}」。`+last.connection.replace(/^因此，[^。]+。/,''),closing:orientation+' '+cards[2].closing,omen:cards[2].omen,pattern:same?'同象汇聚':reversed===0?'顺流展开':reversed===3?'向内收束':'转折相生'};
  }
  function resolve({round,foods,profiles,events,now=Date.now(),avoid=[],excludeText='',history=[]}) {
    assertRound(round);if(round.phase!=='complete') throw Error('三张牌还未到齐。');
    const entries=selected(round),term=T.currentTerm(events,now),all=T.pool({foods,profiles,events,now,avoid,excludeText});
    if(!all.length)return {empty:true,term,reason:'此刻没有同时符合忌口、时令及成菜资料的候选。牌阵可以重开，但不会放宽忌口。'};
    let candidates=all.filter(x=>!history.slice(-2).includes(x.food.id));
    if(!candidates.length)candidates=all.filter(x=>x.food.id!==history.at(-1));
    if(!candidates.length)candidates=all;
    const signature=entries.map(e=>`${e.id}:${Number(e.reversed)}:${e.index}`).join('|');
    const rng=C.random(`${VERSION}:${round.seed}:${round.cut}:${signature}:${C.dayAt(now)}`);
    const weights=candidates.map(x=>affinity(x.food,profiles[x.food.id],entries).weight);
    let value=rng()*weights.reduce((a,b)=>a+b,0),chosen=candidates.at(-1);
    for(let i=0;i<candidates.length;i++){value-=weights[i];if(value<0){chosen=candidates[i];break;}}
    const result={version:VERSION,cards:entries,foodId:chosen.food.id,term,day:C.dayAt(now),place:chosen.place,eligibleCount:all.length,repeated:chosen.food.id===history.at(-1)};
    result.reading=interpret(entries,chosen.food,profiles[chosen.food.id]);
    return result;
  }
  function copyText(result,food,base) {
    const url=new URL('index.html',base);if(!['http:','https:'].includes(url.protocol))throw Error('页面地址无效');url.searchParams.set('food',food.id);
    return ['时令风物 · 三牌餐桌阵',`${result.term.name}｜今日命定菜：${T.dishName(food)}`,...result.reading.cards.map(c=>`${c.role}：${c.name} · ${c.position}\n${c.text}`),`合牌：${result.reading.opening}`,result.reading.connection,result.reading.closing,result.reading.omen,`食材：${food.name} · ${result.place.place}`,`完整吃法与注意事项：${url.href}`,T.DISCLAIMER].join('\n\n');
  }
  return {VERSION,ROLES,shuffle,cut,take,selected,cardText,affinity,interpret,resolve,copyText};
});
