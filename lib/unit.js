'use strict';

var owsCommon = require('@owstack/ows-common');
var keyLib = require('@owstack/key-lib');
var networkLib = require('@owstack/network-lib');
var Unit = networkLib.Unit;
var inherits = require('inherits');
var lodash = owsCommon.deps.lodash;
var $ = owsCommon.util.preconditions;

/**
 * For object definition see https://github.com/owstack/key-lib/blob/master/lib/unit.js
 */
 
var UNITS = [{
    name: 'Bitcoin',
    shortName: 'BTC',
    code: 'BTC',
    accessor: 'BTC',
    kind: 'standard',
    value: 100000000,
    precision: {
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    }
  }, {
    name: 'mBTC (1,000 mBTC = 1BTC)',
    shortName: 'mBTC',
    code: 'mBTC',
    accessor: 'mBTC',
    kind: 'millis',
    value: 100000,
    precision: {
      full: {
        maxDecimals: 5,
        minDecimals: 5
      },
      short: {
        maxDecimals: 3,
        minDecimals: 2
      }
    }
  }, {
    name: 'uBTC (1,000,000 uBTC = 1BTC)',
    shortName: 'uBTC',
    code: 'uBTC',
    accessor: 'uBTC',
    kind: 'micros',
    value: 100,
    precision: {
      full: {
        maxDecimals: 4,
        minDecimals: 4
      },
      short: {
        maxDecimals: 2,
        minDecimals: 1
      }
    }
  }, {
    name: 'bits (1,000,000 bits = 1BTC)',
    shortName: 'bits',
    code: 'bit',
    accessor: 'bits',
    kind: 'bits',
    value: 100,
    precision: {
      full: {
        maxDecimals: 2,
        minDecimals: 2
      },
      short: {
        maxDecimals: 0,
        minDecimals: 0
      }
    }
  }, {
    name: 'satoshi (100,000,000 satoshi = 1BTC)',
    shortName: 'sats',
    code: 'satoshi',
    accessor: 'satoshis',
    kind: 'atomic',
    value: 1,
    precision: {
      full: {
        maxDecimals: 0,
        minDecimals: 0
      },
      short: {
        maxDecimals: 0,
        minDecimals: 0
      }
    }
  }];

/**
 * Utility for handling and converting currency units. The supported units are
 * BTC, mBTC, bits (also named uBTC) and satoshis. A unit instance can be 
 * created with an amount and a unit code, or alternatively using static methods
 * like {fromBTC}. It also allows to be created from a fiat amount and the exchange
 * rate, or alternatively using the {fromFiat} static method.
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
  if (!(this instanceof BtcUnit)) {
    return new BtcUnit(amount, code);
  }

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
  return u.accessor;
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

BtcUnit.fromStandardUnit =
BtcUnit.fromBTC = function(amount) {
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

BtcUnit.fromAtomicUnit =
BtcUnit.fromSatoshis = function(amount) {
  return new BtcUnit(amount, BtcUnit.satoshis);
};

/**
 * Converters.
 * Returns the corresponding value from this Unit.
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
