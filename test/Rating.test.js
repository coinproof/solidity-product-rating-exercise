const path = require('path');
const fs = require('fs');
const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider({gasLimit: '10000000'});
const Web3 = require('web3');
// const HDWalletProvider = require('truffle-hdwallet-provider');
// const provider = new HDWalletProvider(
//   'know find fiction duty chalk spend until old similar wave garment urban',
//   'http://127.0.0.1:7545',
//   0, 5
// );
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
  it('adds a product', async () => {
    await rating.methods.addProduct("Product 1").send({from: accounts[0], gas: '1000000'});
  });

  it('adds a product using different account', async () => {
    try{
      await rating.methods.addProduct("Product 1").send({from: accounts[1], gas: '1000000'});
    } catch(_err) {
      var err = _err;
    };
    assert(err);
  });

  it('adds a product without title', async () => {
    try{
      await rating.methods.addProduct("").send({from: accounts[0], gas: '1000000'});
    } catch(_err) {
      var err = _err;
    };
    assert(err);
  });

  it('gets number of products', async () => {
    await rating.methods.addProduct("Product 1").send({from: accounts[0], gas: '1000000'});
    let productCount = await rating.methods.productCount().call({gas: '1000000'});
    assert.equal(1, productCount);
  });

  it('makes reviews', async () => {
    await rating.methods.addProduct("Product 1").send({from: accounts[0], gas: '1000000'});
    await rating.methods.addReview(0, 4).send({from: accounts[1], gas: '1000000'});
    await rating.methods.addReview(0, 5).send({from: accounts[2], gas: '1000000'});
    await rating.methods.addReview(0, 5).send({from: accounts[3], gas: '1000000'});

    let product = await rating.methods.getProduct(0).call({from: accounts[4], gas: '1000000'});

    assert(product.avgRating == 46);
  });

  it('makes a review for the same product', async () => {
    await rating.methods.addProduct("Product 1").send({from: accounts[0], gas: '1000000'});
    await rating.methods.addReview(0, 4).send({from: accounts[1], gas: '1000000'});
    try{
      await rating.methods.addReview(0, 1).send({from: accounts[1], gas: '1000000'});
    } catch(_err){
      var err = _err;
    }
    assert(err);
  });

  it('makes a review with rating out of range', async () => {
    await rating.methods.addProduct("Product 1").send({from: accounts[0], gas: '1000000'});
    try{
      await rating.methods.addReview(0, 7).send({from: accounts[1], gas: '1000000'});
    } catch(_err){
      var err = _err;
    }
    assert(err);
  });

  it('makes a review for product that doesnt exist', async () => {
    try{
      await rating.methods.addReview(0, 2).send({from: accounts[1], gas: '1000000'});
    } catch(_err){
      var err = _err;
    }
    assert(err);
  });

  it('gets a specific product', async () => {
    await rating.methods.addProduct("Product 1").send({from: accounts[0], gas: '1000000'});
    await rating.methods.addReview(0, 2).send({from: accounts[1], gas: '1000000'});
    let product = await rating.methods.getProduct(0).call({from: accounts[1], gas: '1000000'});
    assert.equal(0, product.id);
    assert.equal("Product 1", product.title);
    assert.equal(20, product.avgRating);
    assert.ok(product.hasReviewed);
  });
});