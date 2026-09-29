"""Run local browser smoke tests; not a real-device or external-calendar test.
Requires Python playwright and a Chromium executable. No network installation.
"""
import base64, datetime, functools, http.server, io, json, os, pathlib, re, threading
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=pathlib.Path(os.environ.get('FENGWU_TEST_OUTPUT',ROOT/'test-output'));OUT.mkdir(parents=True,exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
handler=functools.partial(QuietHandler,directory=str(ROOT/'dist'))
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),handler)
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}/'
OFFLINE=os.environ.get('FENGWU_OFFLINE')=='1'
report={'scope':'Offline Chromium with inline assets and an in-memory Storage test double.' if OFFLINE else 'Local HTTP Chromium.', 'limitations':'Mobile viewport emulation only. No live calendar import, real phone, network timing, or calendar notification test.', 'checks':[]}
image_map={}
if OFFLINE:
    from PIL import Image
    for f in (ROOT/'dist/assets').rglob('*'):
        if f.suffix.lower() not in ['.jpg','.jpeg','.png','.webp','.svg']: continue
        if f.suffix=='.svg': data=f.read_bytes(); mime='image/svg+xml'
        else:
            im=Image.open(f).convert('RGB'); im.thumbnail((850,850)); b=io.BytesIO(); im.save(b,format='JPEG',quality=75);data=b.getvalue();mime='image/jpeg'
        image_map[str(f.relative_to(ROOT/'dist'))]='data:'+mime+';base64,'+base64.b64encode(data).decode()
def load(page,filename,preserve=False):
    if not OFFLINE:
        if preserve:page.reload()
        else:page.goto(BASE+filename)
        return
    stored=page.evaluate("Object.fromEntries(['fengwu.lottery.v1.1'].map(k=>[k,localStorage.getItem(k)]).filter(x=>x[1]))") if preserve else {}
    html=(ROOT/'dist'/filename).read_text(); scripts=re.findall(r'<script[^>]+src="([^"]+)"[^>]*></script>',html)
    html=re.sub(r'<script[^>]+src="[^"]+"[^>]*></script>','',html)
    html=re.sub(r'<link[^>]+href="([^"?]+\.css)(?:[?][^"]*)?"[^>]*>',lambda m:'<style>'+(ROOT/'dist'/m[1]).read_text()+'</style>',html)
    html=re.sub(r'src="(assets/[^"]+)"',lambda m:'src="'+image_map.get(m[1],m[1])+'"',html)
    prelude="{const NativeDate=Date;const fixed=Date.parse('2026-09-28T12:00:00Z');globalThis.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[fixed]));}static now(){return fixed;}};}"
    prelude+='Object.defineProperty(window,"localStorage",{value:(()=>{const s='+json.dumps(stored)+';return {getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k]};})(),configurable:true});'
    parts=[prelude]
    for source in scripts:
        if source in ['app.js','lottery-ui.js']:
            parts.append('{const m='+json.dumps(image_map)+';for(const f of window.FOODS){for(const k of ["image","cardImage","icon"])if(m[f[k]])f[k]=m[f[k]];for(const k of ["images","articleImages"])for(const x of f[k]||[])if(m[x.src])x.src=m[x.src];}}')
        parts.append((ROOT/'dist'/source).read_text())
    html=html.replace('</body>',''.join('<script>'+part.replace('</script','<\\/script')+'</script>' for part in parts)+'</body>')
    page.goto('about:blank');page.set_content(html,wait_until='load')
def check(name,ok=True):
    assert ok,name
    report['checks'].append({'name':name,'passed':True})
def complete(page,effort=1):
    page.locator('#begin').click()
    page.locator('#next').click()
    page.locator('input[name=flavor][value=crisp]').check()
    page.locator('#next').click()
    page.locator(f'input[name=effort][value="{effort}"]').check()
    page.locator('#next').click();page.locator('#next').click();page.locator('#next').click()
    page.locator('#results').wait_for(state='visible')
try:
 with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    for mobile in [False,True]:
      label='mobile' if mobile else 'desktop'
      context=browser.new_context(viewport={'width':390,'height':844} if mobile else {'width':1440,'height':1000},is_mobile=mobile,has_touch=mobile,device_scale_factor=1,accept_downloads=True)
      context.add_init_script("""{const NativeDate=Date;const fixed=Date.parse('2026-09-28T12:00:00Z');globalThis.Date=class extends NativeDate{constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}};}""")
      page=context.new_page();errors=[];bad=[]
      page.on('pageerror',lambda e:errors.append(str(e)))
      page.on('response',lambda r:bad.append(r.url) if r.status>=400 else None)
      load(page,'lottery.html');page.locator('#term-preview').wait_for()
      page.screenshot(path=str(OUT/f'{label}-welcome.png'),full_page=True)
      check(f'{label}: next six terms visible','寒露' in page.locator('#term-preview').inner_text())
      check(f'{label}: no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
      complete(page)
      check(f'{label}: six distinct recommendations',page.locator('[data-slot]').count()==6)
      check(f'{label}: no storage without opt-in',page.evaluate("localStorage.getItem('fengwu.lottery.v1.1')===null"))
      page.wait_for_timeout(600);page.screenshot(path=str(OUT/f'{label}-results.png'),full_page=True)
      first=page.locator('[data-slot]').first
      key=first.get_attribute('data-slot');name=first.locator('h2').inner_text()
      first.locator('[data-lock]').click();page.locator('#redraw').click()
      check(f'{label}: full redraw preserves lock',page.locator(f'[data-slot="{key}"] h2').inner_text()==name)
      page.locator('#calendar-open').click();page.locator('#calendar-dialog').wait_for(state='visible')
      check(f'{label}: calendar six rows',page.locator('.calendar-row').count()==6)
      check(f'{label}: editable date is not squeezed',page.locator('.calendar-row input[type=date]').first.bounding_box()['width']>100)
      page.screenshot(path=str(OUT/f'{label}-calendar.png'),full_page=False)
      page.locator('#lead-days').select_option('3')
      with page.expect_download() as dl:
        page.locator('#calendar-form button[type=submit]').click()
      file=OUT/f'{label}-sample.ics';dl.value.save_as(str(file))
      content=file.read_bytes()
      check(f'{label}: download contains six events',content.count(b'BEGIN:VEVENT')==6)
      check(f'{label}: honest export status','尚未确认写入' in page.locator('#export-status').inner_text())
      page.locator('.calendar-row input[type=checkbox]').last.uncheck()
      with page.expect_download() as dl:
        page.locator('#calendar-form button[type=submit]').click()
      file=OUT/f'{label}-subset.ics';dl.value.save_as(str(file))
      check(f'{label}: unchecked slot not exported',file.read_bytes().count(b'BEGIN:VEVENT')==5)
      page.locator('#calendar-close').click()
      page.locator('#remember').check();check(f'{label}: opt-in persists',page.evaluate("!!localStorage.getItem('fengwu.lottery.v1.1')"))
      load(page,'lottery.html',preserve=True);page.locator('#resume').click()
      check(f'{label}: saved food stable after refresh',page.locator(f'[data-slot="{key}"] h2').inner_text()==name)
      page.locator('#forget').click();check(f'{label}: privacy erase works',page.evaluate("localStorage.getItem('fengwu.lottery.v1.1')===null"))
      page.locator('#edit').click();page.locator('#exclude-text').fill('火星果');page.locator('#next').click()
      check(f'{label}: unrecognized exclusion blocks','未识别' in page.locator('#status').inner_text() and '01' in page.locator('#progress').inner_text())
      load(page,'lottery.html');complete(page,effort=0)
      check(f'{label}: restricted plan leaves blanks',page.locator('.empty-slot').count()>0)
      # V1 still has its own scripts, styles, cards and original routes.
      load(page,'index.html');page.locator('#hero h1').wait_for()
      check(f'{label}: original v1 home still renders',page.locator('#hero h1').inner_text()!='')
      page.locator('[data-view=map]').click();check(f'{label}: original map still renders',page.locator('#mapView').is_visible())
      page.locator('[data-view=flavor]').click();check(f'{label}: original flavor view still renders',page.locator('#flavorView').is_visible())
      check(f'{label}: no JS errors '+str(errors),not errors)
      check(f'{label}: no failed HTTP assets',not bad)
      context.close()
    browser.close()
finally:
 server.shutdown()
 (OUT/'browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 print(json.dumps({'checks':len(report['checks']),'output':str(OUT)},ensure_ascii=False))
