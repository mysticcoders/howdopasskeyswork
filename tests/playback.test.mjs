import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPlaybackClock, nextLesson } from '../lib/playback.ts';

test('deferred React updates retain every tick instead of reading a mutated clock', () => {
  const tick = createPlaybackClock(0, 1);
  const queued = Array.from({length:100}, (_,i)=>tick((i+1)*80));
  assert.equal(queued.reduce((elapsed, update)=>update(elapsed),0),8000);
});
test('2x completes 8 seconds of media in 4 seconds of wall time', () => {
  const tick = createPlaybackClock(0, 2);
  assert.equal(tick(4000)(0),8000);
});
test('changing speed preserves position, including after a pause', () => {
  const first = createPlaybackClock(0,1);
  const elapsed = first(3000)(0);
  const resumed = createPlaybackClock(9000,2);
  assert.equal(resumed(9000)(elapsed),3000);
  assert.equal(resumed(11500)(elapsed),8000);
});
test('all lessons cycle back to creation', () => {
  assert.equal(nextLesson('create'),'signin');
  assert.equal(nextLesson('signin'),'phishing');
  assert.equal(nextLesson('phishing'),'create');
});
