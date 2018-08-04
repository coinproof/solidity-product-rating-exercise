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
  it('deploys the contract', () => {
    assert.ok(rating);
  });

  it('adds a product', async () => {
    await rating.methods.addProduct(1, "Product 1").send({from: accounts[0], gas: '1000000'});
  });

  it('adds a product using different account', async () => {
    let err;
    try{
      await rating.methods.addProduct(1, "Product 1").send({from: accounts[1], gas: '1000000'});
    } catch(_err) {
      err = _err;
    };
    assert.ok(err);
  });

  it('adds a product that already exists', async () => {
    await rating.methods.addProduct(1, "Product 1").send({from: accounts[0], gas: '1000000'});
    let err;
    try{
      await rating.methods.addProduct(1, "Product 1").send({from: accounts[0], gas: '1000000'});
    } catch(_err) {
      err = _err;
    };
    assert.ok(err);
  });

  it('adds a product without title', async () => {
    let err;
    try{
      await rating.methods.addProduct(1, "").send({from: accounts[0], gas: '1000000'});
    } catch(_err) {
      err = _err;
    };
    assert.ok(err);
  });

  it('gets the products ids list', async () => {
    await rating.methods.addProduct(1, "Product 1").send({from: accounts[0], gas: '1000000'});
    let productIds = await rating.methods.getProductsIds().call({gas: '1000000'});
    assert.ok(productIds.length && productIds[0] == 1);
  });

  it('makes a review', async () => {
    await rating.methods.addProduct(1, "Product 1").send({from: accounts[0], gas: '1000000'});
    await rating.methods.addReview(1, 4).send({from: accounts[1], gas: '1000000'});
  });

  it('makes a review for the same product', async () => {
    await rating.methods.addProduct(1, "Product 1").send({from: accounts[0], gas: '1000000'});
    await rating.methods.addReview(1, 4).send({from: accounts[1], gas: '1000000'});
    let err;
    try{
      await rating.methods.addReview(1, 1).send({from: accounts[1], gas: '1000000'});
    } catch(_err){
      err = _err;
    }
    assert.ok(err);
  });

  it('makes a review with rating out of range', async () => {
    await rating.methods.addProduct(1, "Product 1").send({from: accounts[0], gas: '1000000'});
    let err;
    try{
      await rating.methods.addReview(1, 7).send({from: accounts[1], gas: '1000000'});
    } catch(_err){
      err = _err;
    }
    assert.ok(err);
  });

  it('makes a review for product that doesnt exist', async () => {
    let err;
    try{
      await rating.methods.addReview(1, 2).send({from: accounts[1], gas: '1000000'});
    } catch(_err){
      err = _err;
    }
    assert.ok(err);
  });

  let product;

  it('gets a specific product', async () => {
    await rating.methods.addProduct(1, "Product 1").send({from: accounts[0], gas: '1000000'});
    await rating.methods.addReview(1, 2).send({from: accounts[1], gas: '1000000'});
    product = await rating.methods.getProduct(1).call({gas: '1000000'});
    assert.ok(product.id == 1 && product.title == "Product 1" && product.reviewers[0] == accounts[1] && product.ratings[0] == 2);
  });
});