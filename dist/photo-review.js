/* Replace temporary vector drafts; preserve photographic editorial imagery and its generation labels. */
(function(root){
 'use strict';
 const rules=[
  [/crab.?apple|海棠果/i,'assets/crab-apple-photo-cc0.jpg','枝头海棠果实拍，通用形态参考','海棠果实拍 · Wikimedia Commons · CC0 · 不代表产地或品系'],
  [/\bpear\b|梨果|酥梨|水晶梨/i,'assets/pear-tree-fruits-photo-cc-by-sa.jpg','梨树枝头梨果实拍，同类形态参考','梨果实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或具体品种'],
  [/\bapples?\b|苹果/i,'assets/fresh-apples-tree-photo-cc-by.jpg','枝头成熟苹果实拍，同类形态参考','苹果实拍 · Wikimedia Commons · CC BY 4.0 · 不代表产地或具体品种'],
  [/pomelo|柚果|柚子|贡柚|文旦/i,'assets/xihu-wendan-pomelo-generic-ivar-leidus-cc-by-sa-4.0.jpg','整果与果肉柚类实拍，通用形态参考','柚类实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或品种'],
  [/orange|citrus|mandarin|kumquat|blood-orange|柑橘|金柑|金桔|橘|橙|柑/i,'assets/oranges-fruits-vasil-vyagov-cc-by-sa-4.0.jpg','橙类果实实拍，通用形态参考','橙类实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或品种'],
  [/^(?!.*(?:樱桃|猕猴桃)).*(?:peach|桃)/i,'assets/junan-ripe-peach-photo-cc-by-sa.jpg','桃树上成熟桃果实拍，通用形态参考','桃果实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或品种'],
  [/plum|李果|青梅|脆李|三月李/i,'assets/fresh-plums-photo-cc0.jpg','成熟李果实拍，通用形态参考','李果实拍 · Wikimedia Commons · CC0 · 不代表产地或品种'],
  [/persimmon|柿子|红柿/i,'assets/lintong-huojing.webp','成熟柿果实拍，通用形态参考','柿果实拍 · 已登记来源 · 不代表产地或品种'],
  [/loquat|枇杷/i,'assets/ninghai-white-loquat.webp','枝头白肉枇杷实拍，同类形态参考','白肉枇杷实拍 · 已登记来源 · 不代表其他产地或品种'],
  [/blueberry|蓝莓/i,'assets/qingdao-youreka-blueberry-generic-ziqiwang-cc-by-sa-4.0.jpg','蓝莓实拍，通用形态参考','蓝莓实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或品种'],
  [/mulberry|桑葚|桑果/i,'assets/fengxian-japanese-sweet-mulberry-generic-cc0.jpg','桑果实拍，通用形态参考','桑果实拍 · Wikimedia Commons · CC0 · 不代表产地或品种'],
  [/fig|无花果|figs/i,'assets/anlu-bailu-huaguoshan-figs-generic-cc0.jpg','无花果实拍，通用形态参考','无花果实拍 · Wikimedia Commons · CC0 · 不代表产地或品种'],
  [/^(?!.*(?:sesame|芝麻香瓜)).*(?:melon|甜瓜|香瓜|华莱士瓜)/i,'assets/wenzhou-lingkun-baizhuogua-generic-korean-melon-cc-by-sa-2.0.jpg','甜瓜实拍，同类形态参考','甜瓜实拍 · Wikimedia Commons · CC BY-SA 2.0 · 不代表产地或品种'],
  [/sugarcane|甘蔗/i,'assets/panyu-qingming-sugarcane-sarah-jason-cc-by-sa-2.0.jpg','甘蔗茎实拍，通用形态参考','甘蔗实拍 · Wikimedia Commons · CC BY-SA 2.0 · 不代表产地或品种'],
  [/慈姑|茨姑|茨菰/i,'assets/cigu.webp','慈姑球茎实拍，通用形态参考','慈姑实拍 · Wikimedia Commons · CC BY 4.0 · 不代表产地或品种'],
  [/water-chestnut|荸荠|马蹄/i,'assets/xinzhou-gongdeng-water-chestnut-generic-cc0.jpg','去皮荸荠球茎实拍，通用形态参考','荸荠实拍 · Wikimedia Commons · CC0 · 不代表产地或品种'],
  [/\bbamboo\b(?!-worm)|竹笋|毛笋|麻笋|刺竹|冬笋/i,'assets/cizhousun-shoot-800.webp','带壳鲜笋实拍，竹笋通用形态参考','竹笋实拍 · Wikimedia Commons · CC0 · 不代表竹种或产地'],
  [/tea-oil|油茶|茶籽/i,'assets/camellia-oleifera-seeds-photo-cc-by-sa.jpg','油茶果实与种子实拍，同类形态参考','油茶种子实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或批次'],
  [/tea|茶叶|茶芽|茶/i,'assets/zigui-early-tea-sprouts-generic-cc-by-sa-4.0.jpg','茶树嫩梢实拍，异地产区形态参考','茶芽实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表茶类、等级或产地'],
  [/caixin|菜心|菜薹|caitai/i,'assets/caixin-cooked-cc-by-sa.webp','熟制菜心实拍，同类食用状态参考','菜心实拍 · Wikimedia Commons · CC BY-SA 4.0 · 非地方品种或产地证明'],
  [/mustard|芥菜|雪菜|青菜头|菜头/i,'assets/conghua-dajiecai-plant.jpg','芥菜嫩茎实拍，同类形态参考','芥菜实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或品种'],
  [/watercelery|水芹|竹梗芹/i,'assets/shazhou-shuiqin.jpg','水芹植株实拍，同类形态参考','水芹实拍 · Wikimedia Commons · CC BY-SA 3.0 · 不代表产地或品种'],
  [/cinenya|刺嫩芽|刺老芽/i,'assets/cinenya.webp','龙牙楤木嫩芽实拍，同种异地形态参考','龙牙楤木嫩芽实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地'],
  [/tatsoi|塌棵菜|塌菜/i,'assets/takecai.jpg','塌棵菜植株实拍，同类形态参考','塌棵菜实拍 · Wikimedia Commons · CC BY 4.0 · 不代表产地或品种'],
  [/zea|sweet-corn|甜玉米/i,'assets/zea-mays-saccharata-cob-cc-by-sa-3.0.jpg','甜玉米果穗实拍，通用形态参考','甜玉米实拍 · Wikimedia Commons · CC BY-SA 3.0 · 不代表产地或品种'],
  [/shrimp|虾/i,'assets/shrimp-whole-jud-mccranie-cc-by-sa-4.0.jpg','整虾实拍，通用形态参考','整虾实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或虾种'],
  [/seaweed|紫菜|海苔/i,'assets/jinjiang-gim-sheet.jpg','干紫菜实拍，食用状态参考','干紫菜实拍 · Wikimedia Commons · CC0 · 不代表产地或批次'],
  [/algae|萱藻|海麻线/i,'assets/dalian-haimaxian.jpg','萱藻实拍，同种形态参考','萱藻实拍 · Wikimedia Commons · CC BY-SA 3.0 · 不代表产地或采收批次'],
  [/sea-urchin|海胆/i,'assets/dalian-purple-urchin.jpg','紫海胆实拍，通用海胆形态参考','海胆实拍 · Wikimedia Commons · CC BY-SA 4.0 · 不代表产地或物种'],
  [/osmanthus|桂花/i,'assets/osmanthus-fragrans-photo.jpg','桂花实拍，花形参考','桂花实拍 · 已登记来源 · 不代表产地或食用批次'],
  [/jinquehua|金雀花/i,'assets/wuding-jinquehua.jpg','锦鸡儿花实拍，同种形态参考','锦鸡儿花实拍 · Wikimedia Commons · CC BY-SA 2.0 · 不代表产地或食用批次']
 ];
 const draft=/\.svg(?:[?#]|$)|illustration|插画|卡通/i;
 const usable=src=>Boolean(src&&!draft.test(src));
 const reviewed={};
 let replaced=0,cleared=0;
 for(const food of root.FOODS||[]){
  const fields=[['image','imageAlt','imageCaption'],['cardImage','cardImageAlt','cardNote'],['dishImage','dishImageAlt','dishCaption'],['cutImage','cutImageAlt','cutCaption']];
  if(!fields.some(([key])=>food[key]&&draft.test(food[key])))continue;
  const own=fields.find(([key])=>usable(food[key]));
  const rule=rules.find(([pattern])=>pattern.test(`${food.id||''} ${food.name||''}`));
  const visual=own?{src:food[own[0]],alt:food[own[1]]||food.name,note:food[own[2]]||'形态参考'}:rule?{src:rule[1],alt:rule[2],note:rule[3]}:null;
  for(const [key,altKey,noteKey] of fields){
   if(!food[key]||!draft.test(food[key]))continue;
   if(key==='dishImage'||key==='cutImage'){food[key]='';food[altKey]='';food[noteKey]='';continue;}
   food[key]=visual?.src||'';food[altKey]=visual?.alt||'';food[noteKey]=visual?.note||'图片待补';
  }
  if(food.tarotImage?.src&&draft.test(food.tarotImage.src))food.tarotImage=visual?{...visual,kind:'ingredient'}:null;
  if(visual){reviewed[food.id]=visual;replaced++;}else{reviewed[food.id]={src:'',alt:'',note:'图片待补'};cleared++;}
 }
 root.PhotoReview={replaced,cleared,records:reviewed};
})(window);
