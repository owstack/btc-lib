'use strict';

var btcLib = {};

// Module information
btcLib.version = 'v' + require('./package.json').version;

// Main bitcoin library
btcLib.Address = require('./lib/address');
btcLib.Block = require('./lib/block');
btcLib.BlockHeader = require('./lib/block/blockheader');
btcLib.Defaults = require('./lib/common/defaults');
btcLib.MerkleBlock = require('./lib/block/merkleblock');
btcLib.Networks = require('./lib/networks');
btcLib.Opcode = require('./lib/opcode');
btcLib.Script = require('./lib/script');
btcLib.Transaction = require('./lib/transaction');
btcLib.URI = require('./lib/uri');
btcLib.Unit = require('./lib/unit');

// Internal usage, exposed for testing/advanced tweaking
btcLib.Transaction.sighash = require('./lib/transaction/sighash');

// Inject this library into each of its networks as network.lib.
var btcNetworks = require('@owstack/network-lib').getFiltered({currency: btcLib.Networks.currency});
for (var i = 0; i < btcNetworks.length; i++) {
	btcNetworks[i].lib = btcLib;
}

module.exports = btcLib;
