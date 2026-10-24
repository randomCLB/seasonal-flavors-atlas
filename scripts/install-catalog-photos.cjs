'use strict';
/* Fetch only reviewed, hash-pinned licensed photographs. Visitors load local assets. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),manifest=require('../docs/CATALOG_PHOTOS_20261024.json');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function install(item){
 const p=path.join(root,'dist',item.path);
 if(fs.existsSync(p)){if(hash(fs.readFileSync(p))!==item.sha256)throw Error('Photo hash mismatch: '+item.path);return;}
 const canonical=new URL(item.url);if(!['upload.wikimedia.org','thumb.wikimedia.org'].includes(canonical.hostname)||canonical.protocol!=='https:')throw Error('Unapproved photo host');
 // The reviewed imageinfo response includes this thumbnail variant. Preserve it,
 // falling back to the plain URL only when it yields the exact same reviewed bytes.
 const reviewed=new URL(canonical);if(canonical.hostname==='thumb.wikimedia.org'){reviewed.searchParams.set('utm_source','commons.wikimedia.org');reviewed.searchParams.set('utm_campaign','imageinfo');reviewed.searchParams.set('utm_content','thumbnail');}
 const urls=[...new Set([reviewed.href,canonical.href])];let bytes,lastError;
 for(let round=0;round<3&&!bytes;round++){
  for(const url of urls){try{const r=await fetch(url,{headers:{'User-Agent':'SeasonalFlavorsAtlas/1.0 (https://github.com/randomCLB/seasonal-flavors-atlas; image license review)'},signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);const candidate=Buffer.from(await r.arrayBuffer()),actual=hash(candidate);if(actual!==item.sha256)throw Error('Photo content changed: '+item.path+' expected '+item.sha256+' got '+actual);bytes=candidate;break;}catch(e){lastError=e;}}
  if(!bytes)await new Promise(resolve=>setTimeout(resolve,1000*(round+1)));
 }
 if(!bytes)throw lastError||Error('Photo unavailable: '+item.path);
 fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,bytes);
}
(async()=>{const queue=[...manifest];await Promise.all(Array.from({length:3},async()=>{while(queue.length)await install(queue.shift());}));console.log('Verified local catalog photographs:',manifest.length);})().catch(e=>{console.error(e);process.exitCode=1;});
