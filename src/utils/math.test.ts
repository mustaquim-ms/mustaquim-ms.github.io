import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScrollProgress,
  lerp,
  clamp,
  calculateCubeExpansion,
  validateDefconOverride,
  getSkillStrokeOffset
} from './math';

test('calculateScrollProgress accurately calculates percentages', () => {
  assert.equal(calculateScrollProgress(0, 2000, 1000), 0);
  assert.equal(calculateScrollProgress(500, 2000, 1000), 50);
  assert.equal(calculateScrollProgress(1000, 2000, 1000), 100);
  assert.equal(calculateScrollProgress(1500, 2000, 1000), 100);
});

test('lerp correctly linearly interpolates numbers', () => {
  assert.equal(lerp(0, 100, 0.5), 50);
  assert.equal(lerp(10, 20, 0.2), 12);
});

test('clamp restricts numbers within bounds', () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-5, 0, 10), 0);
  assert.equal(clamp(15, 0, 10), 10);
});

test('calculateCubeExpansion returns distinct physical params for states', () => {
  const state0 = calculateCubeExpansion(0);
  const state1 = calculateCubeExpansion(1);
  const state2 = calculateCubeExpansion(2);

  assert.equal(state0.distance, 1.05);
  assert.ok(state1.distance > state0.distance);
  assert.ok(state2.glowIntensity > state0.glowIntensity);
});

test('validateDefconOverride recognizes legitimate unlock keys', () => {
  assert.equal(validateDefconOverride('override'), true);
  assert.equal(validateDefconOverride('OVERRIDE '), true);
  assert.equal(validateDefconOverride('exit'), true);
  assert.equal(validateDefconOverride('wrongpassword'), false);
  assert.equal(validateDefconOverride(''), false);
});

test('getSkillStrokeOffset computes circular progress offset', () => {
  const full = getSkillStrokeOffset(100, 45);
  const empty = getSkillStrokeOffset(0, 45);
  const half = getSkillStrokeOffset(50, 45);

  assert.equal(full, 0);
  assert.ok(empty > 280);
  assert.ok(Math.abs(half - empty / 2) < 1);
});
