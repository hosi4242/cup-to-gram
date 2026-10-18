import test from 'node:test';
import assert from 'node:assert/strict';
import { convert, ovenTemperature } from './convert.mjs';
import { parseAmount } from './parse.mjs';

const flour = { gPerCup: 125 };

test('US, metric, and Australian cup-to-gram conversions use the selected cup volume', () => {
  assert.equal(convert({ amount: 1, ingredient: flour, conversion: 'cup-to-grams', system: 'US' }), 125);
  assert.equal(Number(convert({ amount: 1, ingredient: flour, conversion: 'cup-to-grams', system: 'Metric' }).toFixed(2)), 132.09);
  assert.equal(Number(convert({ amount: 1, ingredient: flour, conversion: 'cup-to-grams', system: 'Australia' }).toFixed(2)), 132.09);
});

test('US, metric, and Australian tablespoon and teaspoon conversions', () => {
  assert.ok(Math.abs(convert({ amount: 1, ingredient: flour, conversion: 'tablespoon-to-grams', system: 'US' }) - 7.8125) < 0.01);
  assert.equal(Number(convert({ amount: 1, ingredient: flour, conversion: 'tablespoon-to-grams', system: 'Metric' }).toFixed(1)), 7.9);
  assert.equal(Number(convert({ amount: 1, ingredient: flour, conversion: 'tablespoon-to-grams', system: 'Australia' }).toFixed(1)), 10.6);
  assert.equal(Number(convert({ amount: 1, ingredient: flour, conversion: 'teaspoon-to-grams', system: 'Metric' }).toFixed(2)), 2.64);
});

test('grams convert back using the selected measuring system', () => {
  assert.equal(convert({ amount: 125, ingredient: flour, conversion: 'grams-to-cups', system: 'US' }), 1);
  assert.equal(Number(convert({ amount: 132.09, ingredient: flour, conversion: 'grams-to-cups', system: 'Metric' }).toFixed(2)), 1);
  assert.equal(Number(convert({ amount: 10.6, ingredient: flour, conversion: 'grams-to-tablespoons', system: 'Australia' }).toFixed(2)), 1);
});

test('amount parser handles common formats', () => {
  assert.equal(parseAmount('1 1/2'), 1.5);
  assert.equal(parseAmount('½'), 0.5);
  assert.equal(parseAmount('0,5'), 0.5);
  assert.equal(parseAmount('1,000'), 1000);
  assert.equal(parseAmount('abc'), null);
});

test('invalid input and unsupported measuring systems are rejected', () => {
  assert.throws(() => convert({ amount: 0, ingredient: flour, conversion: 'cup-to-grams' }));
  assert.throws(() => convert({ amount: 1, ingredient: flour, conversion: 'cup-to-grams', system: 'Unknown' }));
});

test('oven temperature conversion', () => {
  assert.equal(Math.round(ovenTemperature(350, 'F')), 177);
  assert.equal(Math.round(ovenTemperature(180, 'C')), 356);
});
