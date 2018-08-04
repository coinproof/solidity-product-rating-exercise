const path = require('path');
const fs = require('fs');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider({gasLimit: '100000000000000'});
const web3 = new Web3(provider);

// Fetch contract source
const ratingPath = path.resolve(__dirname, '..', 'build', 'contracts', 'Rating.json');
const source = JSON.parse(fs.readFileSync(ratingPath, 'utf8'));

let accounts;
let rating;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  rating = await new web3.eth.Contract(source.abi)
    .deploy({data: source.bytecode, arguments: []})
    .send({from: accounts[0], gas: '10000000'});

  rating.setProvider(provider);
});

describe('Rating', async () => {
  
});