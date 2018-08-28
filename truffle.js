/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

 var HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    /*
      47da0d8b1e4c4db69c1cf56ee6ac710f
      658f8415edcf4778b179f99997b172a0
    */
    rinkeby: {
      provider: function() {
        return new HDWalletProvider('disease garage table grace first lend boy income genius chicken scan sphere', 'https://rinkeby.infura.io/47da0d8b1e4c4db69c1cf56ee6ac710f') 
      },
      network_id: 4,
      gas: '4700000' // Gas limit used for deploys
    }
  }
};