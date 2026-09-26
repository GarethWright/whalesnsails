import {webkit,chromium,devices} from 'playwright';
import assert from 'node:assert/strict';
const url=process.env.GAME_URL||'http://127.0.0.1:5173';
const browser=await webkit.launch();
for(const name of ['iPhone 13','iPhone SE','iPad (gen 7)']){
 const context=await browser.newContext({...devices[name]});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.locator('#start').tap();await page.waitForTimeout(300);await page.clock.install();
 assert.ok(await page.locator('body').evaluate(el=>el.classList.contains('in-play')));
 const assertFits=async()=>{const view=page.viewportSize();for(const selector of ['.swim-stick','[data-touch-action="tail"]','#pause','#leave-play']){const b=await page.locator(selector).boundingBox();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=view.width+1&&b.y+b.height<=view.height+1,`${name} ${selector} must fit screen ${JSON.stringify(b)}`);assert.ok(b.width>=44&&b.height>=40)}assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);};
 await assertFits();
 const box=await page.locator('.swim-stick').boundingBox();const x=box.x+box.width*.78,y=box.y+box.height*.3;
 // WebKit DOM events test the input state; the Chrome test below covers native capture.
 await page.evaluate(()=>{Element.prototype.setPointerCapture=()=>{}});
 await page.locator('.swim-stick').dispatchEvent('pointerdown',{pointerId:21,pointerType:'touch',clientX:x,clientY:y});
 const before=await page.evaluate(()=>gameSnapshot());await page.clock.runFor(300);
 await page.locator('[data-touch-action="bubble"]').dispatchEvent('pointerdown',{pointerId:22,pointerType:'touch'});await page.clock.runFor(300);
 let s=await page.evaluate(()=>gameSnapshot());assert.ok(s.player.x>before.player.x+20&&s.player.y<before.player.y-20,'diagonal swim');assert.ok(s.bubbles>0,'attack while swimming');
 await page.locator('[data-touch-action="bubble"]').dispatchEvent('pointercancel',{pointerId:22,pointerType:'touch'});assert.ok((await page.evaluate(()=>gameSnapshot())).touchAxes.x>0,'attack release preserves swim');
 await page.locator('.swim-stick').dispatchEvent('pointercancel',{pointerId:21,pointerType:'touch'});assert.deepEqual((await page.evaluate(()=>gameSnapshot())).touchAxes,{x:0,y:0});
 await page.clock.runFor(700);await page.locator('[data-touch-action="tail"]').tap();await page.clock.runFor(700);assert.ok((await page.evaluate(()=>gameSnapshot())).tailBreach,'touch breach');
 await page.locator('#pause').tap();assert.equal((await page.evaluate(()=>gameSnapshot())).mode,'paused');await page.locator('#pause').tap();
 await page.screenshot({path:`tests/${name.replaceAll(' ','-')}-portrait.png`});
 const v=page.viewportSize();await page.setViewportSize({width:v.height,height:v.width});await page.clock.runFor(150);await assertFits();
 await page.screenshot({path:`tests/${name.replaceAll(' ','-')}-landscape.png`});
 await page.locator('#leave-play').tap();assert.equal((await page.evaluate(()=>gameSnapshot())).mode,'paused');await page.locator('[data-whale="minke"]').tap();await page.locator('.return-game').tap();assert.equal((await page.evaluate(()=>gameSnapshot())).selected,'minke');assert.equal((await page.evaluate(()=>gameSnapshot())).mode,'playing');
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal((await page.evaluate(()=>gameSnapshot())).mode,'paused');assert.deepEqual((await page.evaluate(()=>gameSnapshot())).touchAxes,{x:0,y:0});assert.deepEqual(errors,[]);console.log(`PASS WebKit ${name}: portrait, landscape, swim + attack, cancel, breach, pause, crew, resume`);await context.close();
}
await browser.close();
// Browser-generated simultaneous touches exercise pointer capture (not synthetic DOM events).
const chrome=await chromium.launch({channel:'chrome'});const context=await chrome.newContext({...devices['iPhone 13']});const page=await context.newPage();await page.goto(url);await page.locator('#start').tap();await page.waitForTimeout(200);const cdp=await context.newCDPSession(page);const stick=await page.locator('.swim-stick').boundingBox(),button=await page.locator('[data-touch-action="bubble"]').boundingBox();const swim={x:stick.x+stick.width*.8,y:stick.y+stick.height*.5,id:1},fire={x:button.x+button.width/2,y:button.y+button.height/2,id:2};const initialX=(await page.evaluate(()=>gameSnapshot())).player.x;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[swim]});await page.waitForTimeout(150);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[swim,fire]});await page.waitForTimeout(180);let s=await page.evaluate(()=>gameSnapshot());assert.ok(s.player.x>initialX+15&&s.bubbles>0,JSON.stringify(s));await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[fire]});assert.ok((await page.evaluate(()=>gameSnapshot())).touchAxes.x>0);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.deepEqual((await page.evaluate(()=>gameSnapshot())).touchAxes,{x:0,y:0});assert.equal(await page.evaluate(()=>scrollY),0);console.log('PASS real simultaneous browser touches: movement + attack, independent release, no scrolling');await chrome.close();
