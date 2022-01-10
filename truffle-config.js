const HDWalletProvider = require("@truffle/hdwallet-provider");
// const keys =  require("./keys.json")
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://ropsten.infura.io/v3/3275f4ffdd0d4b3e8ac104b1bd78007d`
        ),
      network_id: 3, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/3275f4ffdd0d4b3e8ac104b1bd78007d`),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    shibuya: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://rpc.shibuya.astar.network:8545`
        ),
      network_id: 81,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
};

// BASE FEE (determnd by ethereum) => 39.791392694

// Max Priority Fee Per Gas(tip) => 2

// GAS PRICE = BASE FEE + TIP => 41.791392694

// GAS USED 21000

// Transaction Fee = GAS USED * GAS PRICE =
//                   41.791392694 * 21000

// BURNT FEE => BASE FEE * GAS USED
//           39.791392694 * 21000

// REST TO MINER => TIP * GAS USED
//                   2  * 21000

// NEXT_PUBLIC_TARGET_CHAIN_ID=1337
// NEXT_PUBLIC_NETWORK_ID=5777
