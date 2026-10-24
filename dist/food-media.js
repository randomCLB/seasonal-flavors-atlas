/* One non-mutating image resolver for cards, search, records and both draw pages. */
(function(root){
 'use strict';
 const usable=src=>typeof src==='string'&&/^assets\/[a-zA-Z0-9._/-]+\.(?:webp|jpe?g|png)$/i.test(src)&&!src.includes('..');
 function ingredient(food){
  const choices=[root.ReaderMedia?.records?.[food.sourceId||food.id],root.ReaderMedia?.records?.[food.id],food.identityPhoto,root.PhotoReview?.records?.[food.sourceId||food.id],root.PhotoReview?.records?.[food.id]];
  const found=choices.find(v=>v&&usable(v.src));if(found)return {...found,kind:'ingredient',fit:found.fit||'cover',heroFit:found.heroFit||'cover'};
  const src=[food.cardImage,food.image].find(usable)||'';
  return {src,alt:food.cardImageAlt||food.imageAlt||food.name||'',note:src?(food.cardNote||food.imageCaption||'食材形态参考'):'',kind:'ingredient',fit:'cover',heroFit:'cover'};
 }
 function dish(food){
  const explicit=root.ReaderMedia?.dishes?.[food.sourceId||food.id]||root.ReaderMedia?.dishes?.[food.id];if(explicit&&usable(explicit.src))return {...explicit,kind:'dish'};
  if(usable(food.dishImage)&&food.dishImage!==ingredient(food).src)return {src:food.dishImage,alt:food.dishImageAlt||food.name+'成菜参考',note:food.dishCaption||food.dishCredit||'成菜参考',kind:'dish'};
  const m=food.tarotImage;if(m?.kind==='dish'&&usable(m.src)&&m.src!==ingredient(food).src)return {...m};
  return null;
 }
 function recipe(food){return dish(food)||ingredient(food);}
 const hasIngredient=food=>Boolean(ingredient(food).src);
 // Rendering a candidate does not change the original recipe/image signature.
 root.FoodMedia={usable,ingredient,dish,recipe,hasIngredient};
})(typeof window==='object'?window:globalThis);
