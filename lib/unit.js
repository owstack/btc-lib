'use strict';

var owsCommon = require('@owstack/ows-common');
var keyLib = require('@owstack/key-lib');
var networkLib = require('@owstack/network-lib');
var Unit = networkLib.Unit;
var inherits = require('inherits');
var lodash = owsCommon.deps.lodash;
var $ = owsCommon.util.preconditions;

var UNITS = [{
    name: 'Bitcoin',
    shortName: 'BTC',
    value: 100000000,
    decimals: 8,
    code: 'BTC',
    kind: 'standard',
  }, {
    name: 'mBTC (1,000 mBTC = 1BTC)',
    shortName: 'mBTC',
    value: 100000,
    decimals: 5,
    code: 'mBTC',
    kind: 'millis'
  }, {
    name: 'uBTC (1,000,000 uBTC = 1BTC)',
    shortName: 'uBTC',
    value: 100,
    decimals: 2,
    code: 'uBTC',
    kind: 'micros'
  }, {
    name: 'bits (1,000,000 bits = 1BTC)',
    shortName: 'bits',
    value: 100,
    decimals: 2,
    code: 'bit',
    kind: 'bits'
  }, {
    name: 'satoshi (100,000,000 satoshi = 1BTC)',
    shortName: 'satoshis',
    value: 1,
    decimals: 0,
    code: 'satoshi',
    kind: 'atomic'
  }];

/**
 * Utility for handling and converting currency units. The supported units are
 * BTC, mBTC, bits (also named uBTC) and satoshis. A unit instance can be created with an
 * amount and a unit code, or alternatively using static methods like {fromBTC}.
 * It also allows to be created from a fiat amount and the exchange rate, or
 * alternatively using the {fromFiat} static method.
 * You can consult for different representation of a unit instance using it's
 * {to} method, the fixed unit methods like {toSatoshis} or alternatively using
 * the unit accessors. It also can be converted to a fiat amount by providing the
 * corresponding BTC/fiat exchange rate.
 *
 * @example
 * ```javascript
 * var sats = Unit.fromBTC(1.3).toSatoshis();
 * var mili = Unit.fromBits(1.3).to(Unit.mBTC);
 * var bits = Unit.fromFiat(1.3, 350).bits;
 * var btc = new Unit(1.3, Unit.bits).BTC;
 * ```
 *
 * @param {Number} amount - The amount to be represented
 * @param {String|Number} code - The unit of the amount or the exchange rate
 * @returns {Unit} A new instance of an Unit
 * @constructor
 */
function BtcUnit(amount, code) {
  Unit.apply(this, [UNITS, amount, code]);
};
inherits(BtcUnit, Unit);

// Copy all static methods in our object.
Object.keys(Unit).forEach(function(key) {
  BtcUnit[key] = Unit[key];
});

/**
 * Create unit statics.
 * Example BtcUnit.BTC
 */
var unitKeys = lodash.map(UNITS, function(u) {
  return u.shortName;
});

unitKeys.forEach(function(key) {
  BtcUnit[key] = key;
});

/**
 * Constructors.
 * Returns a Unit instance created from the standard unit of measure.
 *
 * @param {Number} amount - The amount in standard units
 * @returns {Unit} A Unit instance
 */

BtcUnit.fromBTC = BtcUnit.fromStandardUnit = function(amount) {
  return new BtcUnit(amount, BtcUnit.BTC);
};

BtcUnit.fromMillis = function(amount) {
  return new BtcUnit(amount, BtcUnit.mBTC);
};

BtcUnit.fromMicro = function(amount) {
  return new BtcUnit(amount, BtcUnit.uBTC);
};

BtcUnit.fromBits = function(amount) {
  return new BtcUnit(amount, BtcUnit.bits);
};

BtcUnit.fromSatoshis = BtcUnit.fromAtomicUnit = function(amount) {
  return new BtcUnit(amount, BtcUnit.satoshis);
};

/**
 * Converters.
 * Returns a Unit instance created from the atomic unit of measure.
 *
 * @param {Number} amount - The amount in atomic units
 * @returns {Unit} A Unit instance
 */

BtcUnit.prototype.toBTC = function() {
  return this.to(BtcUnit.BTC);
};

BtcUnit.prototype.toMillis = function() {
  return this.to(BtcUnit.mBTC);
};

BtcUnit.prototype.toMicro = function() {
  return this.to(BtcUnit.uBTC);
};

BtcUnit.prototype.toBits = function() {
  return this.to(BtcUnit.bits);
};

BtcUnit.prototype.toSatoshis = function() {
  return this.to(BtcUnit.satoshis);
};

/**
 * Returns a Unit instance created from a fiat amount and exchange rate.
 *
 * @param {Number} amount - The amount in fiat
 * @param {Number} rate - The exchange rate; example BTC/USD
 * @returns {Unit} A Unit instance
 */
BtcUnit.fromFiat = function(amount, rate) {
  return new BtcUnit(amount, rate);
};

/**
 * Returns a Unit instance created from JSON string or object
 *
 * @param {String|Object} json - JSON with keys: amount and code
 * @returns {Unit} A Unit instance
 */
BtcUnit.fromObject = function(data) {
  $.checkArgument(lodash.isObject(data), 'Argument is expected to be an object');
  return new BtcUnit(data.amount, data.code);
};

module.exports = BtcUnit;
