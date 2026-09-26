import test from 'node:test';import assert from 'node:assert/strict';import {WHALES,LEVELS,airAfter,attackDamage} from '../src/model.js';
test('surface replenishes air and dive duration varies by whale',()=>{assert.equal(airAfter(95,1,true,32),100);assert.equal(airAfter(1,1,false,32),0);assert.ok(airAfter(100,10,false,48)>airAfter(100,10,false,30))});
test('species powers and star pickups affect combat',()=>{assert.equal(attackDamage(WHALES[0],'ram'),4);assert.equal(attackDamage(WHALES[1],'tail'),5);assert.equal(attackDamage(WHALES[4],'bubble',true),8)});
test('all six whales and three escalating boss encounters are present',()=>{assert.equal(new Set(WHALES.map(w=>w.id)).size,6);assert.equal(LEVELS.length,3);assert.ok(LEVELS[2].hp>LEVELS[0].hp)});

import {ease,breachPose,sheetFrame,JUMP_DURATION} from '../src/motion.js';
test('breach starts at the whale and returns to the surface continuously',()=>{assert.equal(breachPose(0,430,173).y,430);assert.ok(breachPose(.06,430,173).y>430);assert.ok(breachPose(.95,430,173).y<173);assert.ok(Math.abs(breachPose(JUMP_DURATION,430,173).y-201)<.000001);for(const boundary of [.12,.35])assert.ok(Math.abs(breachPose(boundary-.0001,430,173).y-breachPose(boundary+.0001,430,173).y)<1)});
test('swim loops while one-shot attacks hold their last valid frame',()=>{assert.equal(sheetFrame('swim',2.4),0);assert.equal(sheetFrame('tail',2),35);assert.equal(sheetFrame('ram',.3),18)});
test('movement smoothing is independent of update rate',()=>{const one=ease(0,100,7,.1);const half=ease(ease(0,100,7,.05),100,7,.05);assert.ok(Math.abs(one-half)<.000001)});

import {tailBreachTiming,tailBreachPose,tailContact} from '../src/motion.js';
test('tail whack breaches fully before its strike window and returns underwater',()=>{
 for(const depth of [193,350,580]){const t=tailBreachTiming(depth,173);assert.equal(tailBreachPose(0,depth,173).y,depth);assert.equal(tailBreachPose(t.launch+.3,depth,173).striking,false);assert.ok(tailBreachPose(t.launch+.75,depth,173).y<100);assert.equal(tailBreachPose(t.strike+.1,depth,173).striking,true);assert.equal(tailBreachPose(t.duration,depth,173).phase,'done');assert.ok(tailBreachPose(t.duration,depth,173).y>173);for(const boundary of [.18,t.launch,t.land])assert.ok(Math.abs(tailBreachPose(boundary-.00001,depth,173).y-tailBreachPose(boundary+.00001,depth,173).y)<.1)}
});
test('tail contact mirrors correctly for left and right breaches',()=>{const right=tailContact(400,173,.8,1,185,.4),left=tailContact(400,173,.8,-1,185,.4);assert.ok(Math.abs(right.x+left.x-800)<.00001);assert.equal(right.y,left.y)});
