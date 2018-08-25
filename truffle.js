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
        return new HDWalletProvider('zero hobby weekend surround hour weather reward exercise swap series price solution', 'https://mainnet.infura.io/47da0d8b1e4c4db69c1cf56ee6ac710f') 
      },
      host: "https://rinkeby.infura.io/v3/47da0d8b1e4c4db69c1cf56ee6ac710f", // Connect to geth on the specified
      port: 8545,
      from: "0x0085f8e72391Ce4BB5ce47541C846d059399fA6c", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
  }
};