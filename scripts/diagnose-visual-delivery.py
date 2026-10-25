"""Read-only diagnosis; every public cover is checked, with all retry evidence retained."""
import hashlib, io, json, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request,urlopen
from PIL import Image
from playwright.sync_api import sync_playwright
BASE='https://randomclb.github.io/seasonal-flavors-atlas/'
SHA='595a0f3f5ab83dbc7a5d3c9610d02b276ca17f54'
report={'live':True,'releaseSha':SHA,'base':BASE,'http':[],'browser':[],'failedRequests':[],'badResponses':[]}
audit=json.loads(Path('/tmp/reader-access.json').read_text())
paths=sorted({r['cover'] for r in audit['rows'] if r['cover']})
def fetch_check(path):
    local=(Path('dist')/path).read_bytes();expected=hashlib.sha256(local).hexdigest()
    entry={'path':path,'expectedSHA256':expected,'expectedBytes':len(local),'attempts':[],'passed':False}
    for attempt in range(2):
        row={'attempt':attempt+1}
        try:
            url=BASE+path+('' if attempt==0 else '?delivery_verify='+SHA)
            with urlopen(Request(url,headers={'User-Agent':'SeasonalAtlasExactImageDiagnosis'}),timeout=35) as response:
                data=response.read();row.update(status=response.status,contentType=response.headers.get('Content-Type'),bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
            with Image.open(io.BytesIO(data)) as image:
                image.load();row.update(dimensions=list(image.size),format=image.format)
            row['match']=row['sha256']==expected
            if not row['match']:raise AssertionError('Live bytes differ from repository')
            entry['passed']=True
        except Exception as exc:row['error']=str(exc)
        entry['attempts'].append(row)
        if entry['passed']:break
        time.sleep(1)
    return entry
try:
    with urlopen(BASE+'build-info.json?delivery_verify='+SHA,timeout=30) as response:info=json.load(response)
    assert info['siteCommit']==SHA,info
    with ThreadPoolExecutor(max_workers=3) as pool:
        for row in pool.map(fetch_check,paths):report['http'].append(row)
    print('HTTP_MATCH',sum(r['passed'] for r in report['http']),'/',len(paths),flush=True)
    with sync_playwright() as p:
        browser=p.chromium.launch();context=browser.new_context();page=context.new_page()
        page.on('requestfailed',lambda request:report['failedRequests'].append({'url':request.url,'failure':request.failure}))
        page.on('response',lambda response:report['badResponses'].append({'url':response.url,'status':response.status}) if response.status>=400 else None)
        # This page has no catalog rerenders or image replacement, unlike the earlier full UI test.
        page.goto(BASE+'credits.html?delivery_verify='+SHA,wait_until='load')
        report['browser']=page.evaluate('''async paths=>{
            const results=[],queue=[...paths];
            await Promise.all(Array.from({length:3},async()=>{while(queue.length){
                const src=queue.shift(),attempts=[];let passed=false;
                for(let attempt=0;attempt<2;attempt++){
                    const image=new Image();image.src=src+(attempt?'?isolated_verify=595a0f3':'');
                    try{await image.decode();if(!image.naturalWidth)throw Error('zero width');attempts.push({attempt:attempt+1,ok:true,width:image.naturalWidth,height:image.naturalHeight});passed=true;break;}
                    catch(error){attempts.push({attempt:attempt+1,ok:false,error:String(error)});await new Promise(resolve=>setTimeout(resolve,500));}
                }results.push({src,passed,attempts});
            }}));return results;
        }''',paths)
        browser.close()
    report['passed']=all(r['passed'] for r in report['http']) and all(r['passed'] for r in report['browser'])
    assert report['passed'],'One or more actual images failed byte or decode checks'
finally:
    Path('/tmp/live-image-delivery.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps({'count':len(paths),'passed':report.get('passed',False),'httpFailures':[r for r in report['http'] if not r['passed']],'browserFailures':[r for r in report['browser'] if not r['passed']],'failedRequests':report['failedRequests'],'badResponses':report['badResponses']},ensure_ascii=False),flush=True)
