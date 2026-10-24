'use strict';
// Review only: candidates are never installed into the live site automatically.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const out='/tmp/catalog-photos';fs.mkdirSync(out,{recursive:true});
const candidates={sweet_potato:'Sweet potato',fava:'Vicia faba',yam:'Dioscorea polystachya',pea_shoot:'Pea shoots',radish:'Radish',scallion:'Scallion',celery:'Celery',cabbage:'Napa cabbage',water_spinach:'Ipomoea aquatica',rose:'Rosa rugosa',lychee:'Lychee',longan:'Longan',jujube:'Jujube',pomegranate:'Pomegranate',grape:'Grape',walnut:'Walnut',macadamia:'Macadamia',peanut:'Peanut',lotus_seed:'Lotus seed',wood_ear:'Auricularia heimuer',shiitake:'Shiitake',kelp:'Saccharina japonica',sailfish:'Indo-Pacific sailfish',marlin:'Black marlin',seerfish:'Narrow-barred Spanish mackerel',black_carp:'Black carp',mullet:'Flathead grey mullet',mullet_roe:'Bottarga',seabream:'Red seabream',horse_mackerel:'Japanese jack mackerel',mahi_mahi:'Mahi-mahi',flying_fish:'Flying fish',tilefish:'Tilefish',bonito:'Skipjack tuna',cuttlefish:'Common cuttlefish',squid:'Squid',hairyclam:'Scapharca subcrenata',basketclam:'Corbicula fluminea',eel:'Japanese eel',snail:'Cipangopaludina chinensis',abalone:'Abalone',sea_cucumber:'Apostichopus japonicus',salmon:'Rainbow trout'};
const headers={'User-Agent':'SeasonalFlavorsAtlas/1.0 (https://github.com/randomCLB/seasonal-flavors-atlas; image license review)'};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function get(url,json=true){for(let i=0;i<3;i++){try{const r=await fetch(url,{headers,signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('HTTP '+r.status);return json?await r.json():Buffer.from(await r.arrayBuffer());}catch(e){if(i===2)throw e;await pause(1000*(i+1));}}}
const rows=[];
async function one([id,title]){try{
 const q=new URLSearchParams({action:'query',titles:title,prop:'pageimages',piprop:'name',pilicense:'free',format:'json',redirects:'1'});
 const p=Object.values((await get('https://en.wikipedia.org/w/api.php?'+q)).query.pages)[0];if(!p.pageimage||/\.svg$/i.test(p.pageimage))throw Error('No photographic file');
 const iq=new URLSearchParams({action:'query',titles:'File:'+p.pageimage,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640',format:'json'});
 const file=Object.values((await get('https://commons.wikimedia.org/w/api.php?'+iq)).query.pages)[0],info=file.imageinfo?.[0];if(!info)throw Error('No Commons metadata');
 const m=info.extmetadata||{},license=m.LicenseShortName?.value||'';if(!/^(CC BY|CC0|Public domain)/i.test(license))throw Error('License requires separate review: '+license);
 const url=info.thumburl||info.url,bytes=await get(url,false);if(bytes.length>2500000||bytes.length<500)throw Error('Unexpected image size');
 const ext=/\.png(?:\?|$)/i.test(url)?'png':'jpg',filename=id+'.'+ext;fs.writeFileSync(path.join(out,filename),bytes);
 const row={id,title,filename,url,source:info.descriptionurl,artist:m.Artist?.value||'',license,licenseUrl:m.LicenseUrl?.value||'',description:m.ImageDescription?.value||'',sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};rows.push(row);console.log('PHOTO',id,license,bytes.length);
 }catch(e){rows.push({id,title,error:String(e.message)});console.log('MISSING',id,String(e.message));}}
(async()=>{const queue=Object.entries(candidates);await Promise.all(Array.from({length:3},async()=>{while(queue.length){await one(queue.shift());await pause(350);}}));fs.writeFileSync(path.join(out,'candidates.json'),JSON.stringify(rows,null,2));})().catch(e=>{console.error(e);process.exitCode=1;});
