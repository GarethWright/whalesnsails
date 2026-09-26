import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(1000);await page.clock.install();
await page.click('[data-whale="humpback"]');await page.click('#start');await page.keyboard.down('ArrowRight');
for(let i=0;i<70;i++){await page.clock.runFor(100);const s=await page.evaluate(()=>gameSnapshot());if(s.ships[0]&&s.ships[0].x-s.player.x<235)break;}
await page.keyboard.up('ArrowRight');const before=await page.evaluate(()=>gameSnapshot());await page.keyboard.press('KeyK');
let s=await page.evaluate(()=>gameSnapshot());assert.equal(s.score,before.score,'no instant tail damage');assert.ok(Math.abs(s.player.y-before.player.y)<5,'no teleport to surface');
let minY=s.player.y,sawAir=false,sawHit=false;
for(let i=0;i<36;i++){await page.clock.runFor(100);s=await page.evaluate(()=>gameSnapshot());minY=Math.min(minY,s.player.y);if(s.tailBreach?.phase==='air')sawAir=true;if(s.score>before.score)sawHit=true;if([6,13,19,26].includes(i))await page.locator('.game-frame').screenshot({path:`tests/tail-breach-${i}.png`});}
assert.ok(minY<100,'whole whale should clear the surface');assert.ok(sawAir);assert.ok(sawHit,'descending tail must hit the adjacent boat');assert.equal(s.tailBreach,null);assert.ok(s.player.y>173,'whale lands underwater');assert.equal(errors.length,0,errors.join('\n'));
console.log('PASS: no instant damage or teleport, full airborne breach, timed tail contact sinks boat, underwater landing');await browser.close();
