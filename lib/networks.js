'use strict';

var networkLib = require('@owstack/network-lib');
var Networks = networkLib.Networks;
var Bip44 = Networks.Bip44;

var preference = 'BTC';
var regtestEnabled = false;

/**
 * For object definition see https://github.com/owstack/key-lib/blob/master/lib/networks.js
 */
var networks = [{
  name: 'Bitcoin',
  symbol: 'BTC',
  coin: Bip44['BTC'] ^ 0x80000000,
  protocol: 'bitcoin',
  alias: 'livenet',
  preference: preference,
  prefix: {
    pubkeyhash: 0x00,
    privatekey: 0x80,
    scripthash: 0x05,
  },
  version: {
    xpubkey: 0x0488b21e,
    xprivkey: 0x0488ade4
  },
  networkMagic: 0xf9beb4d9,
  port: 8333,
  dnsSeeds: [
    'seed.bitcoin.sipa.be',
    'dnsseed.bluematt.me',
    'dnsseed.bitcoin.dashjr.org',
    'seed.bitcoinstats.com',
    'seed.bitnodes.io',
    'bitseed.xf2.org'
  ],
  indexBy: Networks.indexAll
}];

Networks.add(networks);

/**
 * @constructor
 */
function BtcNetworks() {}

/**
 * @function
 * @member BtcNetworks#get
 * Retrieves the network associated.
 * @param {string|number|Network} arg
 * @param {string|Array} keys - if set, only check if the keys associated with this name match
 * @return Network
 */
BtcNetworks.get = function(arg, keys) {
  var network;

  if (typeof(arg) === 'string') {
    arg = arg.trim();

    switch (arg) {
      case 'livenet':
      case 'mainnet':
        network = Networks.get('BTC', keys, preference);
        break;

      case 'testnet':
        if (regtestEnabled) {
          network = Networks.get('REGTEST', keys, preference);
        } else {
          network = Networks.get('TESTNET', keys, preference);
        }
        break;

      case 'regtest':
        network = Networks.get('REGTEST', keys, preference);
        break;
    }
  }

  if (!network) {
    // Prefer this network (third arg).
    network = Networks.get(arg, keys, preference);
  }

  return network;
};

/**
 * @function
 * @member Networks#getProtcols
 * Returns an array of protocols names
 */
BtcNetworks.getProtocols = function() {
  var protocols = [];
  for (var i = 0; i < networks.length; i++) {
    if (networks[i].protocol) {
      protocols.push(networks[i].protocol);
    }
  }
  return protocols;
};

/**
 * @function
 * @member Networks#getLivenetProtcol
 * Returns the livenet protocol
 */
BtcNetworks.getLivenetProtocol = function() {
  for (var i = 0; i < networks.length; i++) {
    if (networks[i].alias == 'livenet') {
      return networks[i].protocol;
    }
  }
  throw new Error('No livenet protocol found');
};

/**
 * @function
 * Will enable regtest features for testnet
 */
BtcNetworks.enableRegtest = function() {
  regtestEnabled = true;
};

/**
 * @function
 * Will disable regtest features for testnet
 */
BtcNetworks.disableRegtest = function() {
  regtestEnabled = false;
};

/**
 * @namespace BtcNetworks
 */
module.exports = {
  add: Networks.add,
  remove: Networks.remove,
  get: BtcNetworks.get,
  getProtocols: BtcNetworks.getProtocols,
  getProtocol: BtcNetworks.getLivenetProtocol,
  enableRegtest: BtcNetworks.enableRegtest,
  disableRegtest: BtcNetworks.disableRegtest,
  defaultNetwork: BtcNetworks.get('BTC'),
  livenet: BtcNetworks.get('BTC'),
  mainnet: BtcNetworks.get('BTC'),
  testnet: BtcNetworks.get('TESTNET'),
  regtest: BtcNetworks.get('REGTEST')
};
