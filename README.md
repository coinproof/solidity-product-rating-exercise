### A Solidity exercise that requires a Smart Contract for rating products

#### Restrictions:
  - Only the owner can add products
  - A user can only rate a product once
  
#### Preview

[Click here to preview](https://rawgit.com/alexandretok/solidity-product-rating-exercise/build/frontend/build/index.html)

#### Getting started

  - Install and open _ganache_ from https://truffleframework.com/ganache  
```sh
$ npm install -g truffle
$ npm install
$ truffle test
```

#### Expect output:
```sh
$ truffle test
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/Rating.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/token/ERC20/BasicToken.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol...
Compiling ./node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol...


  Contract: Rating
    Rating
      ✓ adds a product (113ms)
      ✓ adds a product using different account (129ms)
      ✓ adds a product without title (97ms)
      ✓ gets number of products (421ms)
      ✓ makes reviews (731ms)
      ✓ makes a review for the same product (352ms)
      ✓ makes a review with rating out of range (238ms)
      ✓ makes a review for product that doesnt exist (112ms)
      ✓ gets a specific product (621ms)


  9 passing (6s)
```
