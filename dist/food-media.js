/* Shared, non-mutating photography roles for every public entrypoint. */
(function(root){
 'use strict';
 const usable=src=>typeof src==='string'&&/^assets\/[a-zA-Z0-9._/-]+\.(?:webp|jpe?g|png)$/i.test(src)&&!src.includes('..');
 const homeScenes=new Set(['plant','whole-ingredient','animal','processed-food']);
 function ingredient(food){
  const V=root.VisualStandard,explicit=V?.record(food);
  const choices=[explicit?.home,root.ReaderMedia?.records?.[food.sourceId||food.id],root.ReaderMedia?.records?.[food.id],food.identityPhoto,root.PhotoReview?.records?.[food.sourceId||food.id],root.PhotoReview?.records?.[food.id],{src:food.image,alt:food.imageAlt,note:food.imageCaption},{src:food.cardImage,alt:food.cardImageAlt,note:food.cardNote}];
  if(explicit&&Object.hasOwn(explicit,'home')&&!explicit.home)return {src:'',alt:'',note:'',kind:'ingredient',scene:'missing',fit:'cover'};
  for(const v of choices){
   if(!v||!usable(v.src)||V?.blocked(food,v.src))continue;
   const scene=v.scene||V?.role(v.src)||'whole-ingredient';
   if(V&&!homeScenes.has(scene))continue;
   const src=v.src==='assets/shajiguo.jpg'?'assets/shajiguo-400.webp':v.src;
   return {...v,src,alt:v.alt||food.name,note:v.note||'食材原貌',kind:'ingredient',scene,position:v.position||'50% 50%',fit:v.fit||'cover',heroFit:v.heroFit||'cover'};
  }
  return {src:'',alt:'',note:'',kind:'ingredient',scene:'missing',position:'50% 50%',fit:'cover',heroFit:'cover'};
 }
 function detail(food){
  const V=root.VisualStandard,entry=V?.record(food);
  if(entry&&Object.hasOwn(entry,'detail')){const m=entry.detail;if(m&&usable(m.src)&&['dish','fruit-cut'].includes(m.scene))return {...m,kind:m.scene};if(!m)return null;}
  const explicit=root.ReaderMedia?.dishes?.[food.sourceId||food.id]||root.ReaderMedia?.dishes?.[food.id];
  const choices=[explicit,{src:food.dishImage,alt:food.dishImageAlt,note:food.dishCaption||food.dishCredit,scene:'dish'},{src:food.cutImage,alt:food.cutImageAlt,note:food.cutCaption,scene:'fruit-cut'},food.tarotImage];
  for(const m of choices){if(!m||!usable(m.src)||V?.blocked(food,m.src))continue;const reviewed=V?.role(m.src),scene=reviewed&&reviewed!=='unreviewed'?reviewed:m.scene||(m.kind==='fresh'?'fruit-cut':m.kind);if(V&&reviewed==='unreviewed')continue;if(!['dish','fruit-cut'].includes(scene))continue;return {...m,alt:m.alt||food.name,note:m.note||(scene==='dish'?'成菜参考':'果切参考'),scene,kind:scene,position:m.position||'50% 50%'};}
  return null;
 }
 const dish=food=>{const m=detail(food);return m?.kind==='dish'?m:null;};
 const recipe=food=>detail(food)||ingredient(food),hasIngredient=food=>Boolean(ingredient(food).src);
 root.FoodMedia={usable,ingredient,dish,detail,recipe,hasIngredient};
})(typeof window==='object'?window:globalThis);
