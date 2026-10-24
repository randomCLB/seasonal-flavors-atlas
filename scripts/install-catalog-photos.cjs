'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const manifest=require('../docs/CATALOG_PHOTOS_20261024.json');
for(const item of manifest){const file=path.join(__dirname,'../dist',item.path);if(!fs.existsSync(file))throw Error('Reviewed photograph missing: '+item.path);const actual=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');if(actual!==item.sha256)throw Error('Reviewed photograph changed: '+item.path);}
console.log('Verified repository-local photographs:',manifest.length);
