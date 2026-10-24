'use strict';
/* Fetch reviewed, hash-pinned licensed thumbnails at build time. Visitors only load local assets. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),manifest=require('../docs/CATALOG_PHOTOS_20261024.json');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function install(item){
 const p=path.join(root,'dist',item.path);
 if(fs.existsSync(p)){if(hash(fs.readFileSync(p))!==item.sha256)throw Error('Photo hash mismatch: '+item.path);return;}
 const u=new URL(item.url);if(!['upload.wikimedia.org','thumb.wikimedia.org'].includes(u.hostname)||u.protocol!=='https:')throw Error('Unapproved photo host');
 let bytes;
 for(let attempt=0;attempt<3;attempt++){
  try{const r=await fetch(u,{headers:{'User-Agent':'SeasonalFlavorsAtlas/1.0 (https://github.com/randomCLB/seasonal-flavors-atlas)'},signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);bytes=Buffer.from(await r.arrayBuffer());if(hash(bytes)!==item.sha256)throw Error('Photo content changed: '+item.path);break;}
  catch(e){if(attempt===2)throw e;await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));}
 }
 fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,bytes);
}
(async()=>{const queue=[...manifest];await Promise.all(Array.from({length:3},async()=>{while(queue.length)await install(queue.shift());}));console.log('Verified local catalog photographs:',manifest.length);})().catch(e=>{console.error(e);process.exitCode=1;});
