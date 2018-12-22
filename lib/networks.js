'use strict';

var Networks = require('@owstack/network-lib');
var Bip44 = Networks.Bip44;

var currency = 'BTC';
var regtestEnabled = false;

/**
 * For object definition see https://github.com/owstack/key-lib/blob/master/lib/networks.js
 */

var networks = [{
  currency: currency,
  description: 'Bitcoin',
  name: 'btc',
  alias: 'livenet',
  coinIndex: Bip44['BTC'] ^ 0x80000000,
  protocol: 'bitcoin',
  prefix: {
    pubkeyhash: 0x00,
    privatekey: 0x80,
    scripthash: 0x05,
  },
  version: { // see SLIP132
    xpubkey: {
      bytes: 0x0488b21e,
      text: 'xpub'
    },
    xprivkey: {
      bytes: 0x0488ade4,
      text: 'xprv'
    }
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
  ]
}, {
  currency: currency,
  description: 'Testnet',
  name: 'testnet',
  alias: 'testnet',
  coinIndex: Bip44['TESTNET'] ^ 0x80000000,
  protocol: 'testnet',
  prefix: {
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4
  },
  version: { // see SLIP132
    xpubkey: {
      bytes: 0x043587cf,
      text: 'tpub'
    },
    xprivkey: {
      bytes: 0x04358394,
      text: 'tprv'
    }
  },
  networkMagic: 0x0b110907,
  port: 18333,
  dnsSeeds: [
    'testnet-seed.bitcoin.petertodd.org',
    'testnet-seed.bluematt.me',
    'testnet-seed.alexykot.me',
    'testnet-seed.bitcoin.schildbach.de'
  ]
}, {
  currency: currency,
  description: 'Regtest',
  name: 'regtest',
  alias: 'testnet',
  coinIndex: Bip44['TESTNET'] ^ 0x80000000,
  protocol: 'regtest',
  prefix: {
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4
  },
  version: { // see SLIP132
    xpubkey: {
      bytes: 0x043587cf,
      text: 'tpub'
    },
    xprivkey: {
      bytes: 0x04358394,
      text: 'tprv'
    }
  },
  networkMagic: 0xdab5bffa,
  port: 18444,
  dnsSeeds: [],
  indexBy: Networks.indexMinimal
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
        network = Networks.get('btc', keys, currency);
        break;

      case 'testnet':
        if (regtestEnabled) {
          network = Networks.get('regtest', keys, currency);
        } else {
          network = Networks.get('testnet', keys, currency);
        }
        break;

      case 'regtest':
        network = Networks.get('regtest', keys, currency);
        break;
    }
  }

  if (!network) {
    network = Networks.get(arg, keys, currency);
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
  defaultNetwork: BtcNetworks.get('btc'),
  livenet: BtcNetworks.get('btc'),
  mainnet: BtcNetworks.get('btc'),
  testnet: BtcNetworks.get('testnet'),
  regtest: BtcNetworks.get('regtest')
};
