const Rating = artifacts.require("./Rating.sol")

contract("Rating", accounts => {
  beforeEach(async () => {
    // Use one of those accounts to deploy the contract
    rating = await Rating.new({gasPrice: 1000});
  });
  
  describe('Rating', async () => {
    it('adds a product', async () => {
      await rating.addProduct("Product 1", {from: accounts[0], gas: '1000000'});
    });
  
    it('adds a product using different account', async () => {
      try{
        await rating.addProduct("Product 1", {from: accounts[1], gas: '1000000'});
      } catch(_err) {
        var err = _err;
      };
      assert(err);
    });
  
    it('adds a product without title', async () => {
      try{
        await rating.addProduct("", {from: accounts[0], gas: '1000000'});
      } catch(_err) {
        var err = _err;
      };
      assert(err);
    });
  
    it('gets number of products', async () => {
      await rating.addProduct("Product 1", {from: accounts[0], gas: '1000000'});
      let productCount = await rating.productCount({gas: '1000000'});
      assert.equal(1, productCount);
    });
  
    it('makes reviews', async () => {
      await rating.addProduct("Product 1", {from: accounts[0], gas: '1000000'});
      await rating.addReview(0, 4, {from: accounts[1], gas: '1000000'});
      await rating.addReview(0, 5, {from: accounts[2], gas: '1000000'});
      await rating.addReview(0, 5, {from: accounts[3], gas: '1000000'});
  
      let product = await rating.getProduct(0, {from: accounts[4], gas: '1000000'});
      assert(product[2] == 46);
    });
  
    it('makes a review for the same product', async () => {
      await rating.addProduct("Product 1", {from: accounts[0], gas: '1000000'});
      await rating.addReview(0, 4, {from: accounts[1], gas: '1000000'});
      try{
        await rating.addReview(0, 1, {from: accounts[1], gas: '1000000'});
      } catch(_err){
        var err = _err;
      }
      assert(err);
    });
  
    it('makes a review with rating out of range', async () => {
      await rating.addProduct("Product 1", {from: accounts[0], gas: '1000000'});
      try{
        await rating.addReview(0, 7, {from: accounts[1], gas: '1000000'});
      } catch(_err){
        var err = _err;
      }
      assert(err);
    });
  
    it('makes a review for product that doesnt exist', async () => {
      try{
        await rating.addReview(0, 2, {from: accounts[1], gas: '1000000'});
      } catch(_err){
        var err = _err;
      }
      assert(err);
    });
  
    it('gets a specific product', async () => {
      await rating.addProduct("Product 1", {from: accounts[0], gas: '1000000'});
      await rating.addReview(0, 2, {from: accounts[1], gas: '1000000'});
      let product = await rating.getProduct(0, {from: accounts[1], gas: '1000000'});
      assert.equal(0, product[0]);
      assert.equal("Product 1", product[1]);
      assert.equal(20, product[2]);
      assert.ok(product[3]);
    });
  });
});
