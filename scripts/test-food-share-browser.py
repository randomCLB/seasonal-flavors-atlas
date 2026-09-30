"""Run against dist served on localhost:8766. Native OS UI is mocked, not sent."""
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
 checks=[]
 def check(name,passed):
  checks.append({'name':name,'pass':bool(passed)})
  assert passed,name
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  for width,height in [(390,844),(320,640),(1440,1000)]:
   page=await browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await page.add_init_script("Object.defineProperty(navigator,'share',{configurable:true,value:undefined}); Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copied=text}}});")
   await page.goto('http://localhost:8766/index.html?food=shajiguo&utm_source=private#recipe')
   await page.wait_for_selector('#detailDialog[open]')
   button=page.locator('#detailShare'); box=await button.bounding_box()
   check(f'{width}: share visible at entry',box['y']>=0 and box['y']+box['height']<=height)
   check(f'{width}: tap height',box['height']>=(44 if width<=800 else 36))
   check(f'{width}: no horizontal overflow',await page.locator('#detailDialog').evaluate('(e)=>e.scrollWidth<=e.clientWidth'))
   await button.click();check(f'{width}: clipboard exact selected link',await page.evaluate('window.copied')=='http://localhost:8766/index.html?food=shajiguo')
   check(f'{width}: visible copy feedback',await page.locator('#detailShareStatus').is_visible())
   await page.locator('#detailDialog').evaluate('(e)=>e.scrollTop=1000');box=await button.bounding_box()
   check(f'{width}: share remains visible after scrolling',box['y']>=0 and box['y']+box['height']<=height)
   await page.locator('#detailDialog').evaluate('(e)=>e.scrollTop=0')
   await page.screenshot(path=f'/tmp/atlas-share-{width}.png')
   await page.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}})")
   await button.click();check(f'{width}: manual fallback visible',await page.locator('#detailShareLink').is_visible())
   check(f'{width}: manual URL accurate',await page.locator('#detailShareLink').input_value()=='http://localhost:8766/index.html?food=shajiguo')
   await page.evaluate("window.calls=[];Object.defineProperty(navigator,'share',{configurable:true,value:data=>{calls.push(data);return new Promise((resolve,reject)=>{window.finish=resolve;window.abort=()=>reject(new DOMException('cancel','AbortError'))})}})")
   await button.click();check(f'{width}: busy disabled',await button.is_disabled());await page.evaluate('window.abort()');await page.wait_for_function("!document.getElementById('detailShare').disabled")
   check(f'{width}: cancel has no stale panel',not await page.locator('#detailShareLink').is_visible())
   check(f'{width}: cancel feedback',await page.locator('#detailShareStatus').inner_text()=='已取消分享')
   await button.click();await page.evaluate('window.finish()');await page.wait_for_function("!document.getElementById('detailShare').disabled")
   check(f'{width}: repeat share',await page.evaluate('calls.length')==2)
   await page.locator('#detailClose').click();check(f'{width}: close removes food param','food=' not in page.url)
   await page.go_back();await page.wait_for_selector('#detailDialog[open]');check(f'{width}: back restores detail',await page.locator('#detailContent h1').inner_text()=='沙棘果')
   await page.go_forward();check(f'{width}: forward closes',not await page.locator('#detailDialog').is_visible())
   await page.goto('http://localhost:8766/index.html?food=shajiguo')
   # All catalog entries use the same opening path as season, map, search and related buttons.
   results=await page.evaluate("""()=>window.FOODS.map(f=>{openFood(f.id,false);return {id:f.id,label:document.getElementById('detailShare').getAttribute('aria-label'),title:document.querySelector('#detailContent h1').textContent,url:FoodShare.shareData(f,location.href).url}})""")
   check(f'{width}: all 60 detail share targets',len(results)==60 and all(r['label']=='分享'+r['title'] and r['url'].endswith('?food='+r['id']) for r in results))
   check(f'{width}: no JavaScript exceptions',not errors)
   await page.close()
  await browser.close()
 Path('/tmp/atlas-share-browser.json').write_text(json.dumps({'checks':checks,'passed':len(checks),'scope':'Chromium desktop/mobile viewports. Native sharing and clipboard mocked; no app delivery or physical device tested.'},ensure_ascii=False,indent=2))
 print(f'{len(checks)} browser checks passed')
asyncio.run(main())
