'use strict';

var owsCommon = require('@owstack/ows-common');
var networkLib = require('@owstack/network-lib');
var Address = require('./address');
var Networks = require('./networks');
var Unit = require('./unit');
var URI = networkLib.URI;
var inherits = require('inherits');

/**
 * Represents a bitcoin URI.
 * @constructor
 */
function BtcURI(data, knownParams) {
  URI.apply(this, [Address, Networks, Unit, data, knownParams]);
};
inherits(BtcURI, URI);

// Access static methods.
Object.keys(URI).forEach(function(key) {
  BtcURI[key] = URI[key];
});

/**
 * Check if a bitcoin URI string is valid
 *
 * @example
 * ```javascript
 *
 * var valid = URI.isValid('bitcoin:12A1MyfXbW6RhdRAZEqofac5jCQQjwEPBu');
 * // true
 * ```
 *
 * @param {string|Object} data - A bitcoin URI string or an Object
 * @param {Array.<string>=} knownParams - Required non-standard params
 * @returns {boolean} Result of uri validation
 */
BtcURI.isValid = function(data, knownParams) {
  try {
    new BtcURI(data, knownParams);
  } catch (err) {
    return false;
  }
  return true;
};

/**
 * Returns the protocol string for the network.
 *
 * @returns {string} The protocol string
 */
BtcURI.prototype.getProtocol = function() {
  return Networks.getProtocol();
};

/**
 * Convert a URI string into a simple object.
 *
 * @param {string} uri - A bitcoin cash URI string
 * @throws {TypeError} Invalid bitcoin cash URI
 * @returns {Object} An object with the parsed params
 */
BtcURI.parse = function(uri) {
  return URI.parseWithNetworks(Networks.getProtocols(), uri);
};

/**
 * Instantiate a URI from a String
 *
 * @param {string} str - JSON string or object of the URI
 * @returns {URI} A new instance of a URI
 */
BtcURI.fromString = function(str) {
  if (typeof(str) !== 'string') {
    throw new TypeError('Expected a string');
  }
  return new BtcURI(str);
};

/**
 * Instantiate a URI from an Object
 *
 * @param {Object} data - object of the URI
 * @returns {URI} A new instance of a URI
 */
BtcURI.fromObject = function(obj) {
  return new BtcURI(obj);
};

module.exports = BtcURI;
