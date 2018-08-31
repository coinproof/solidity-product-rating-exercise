pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Rating is Ownable, StandardToken {
    // ERC20 properties
    string public name = "ReviewToken";
    string public symbol = "RVW";
    uint8 public decimals = 2;
    uint public INITIAL_SUPPLY = 1000000;
    
    struct Product {
        uint id;
        string title;
        uint reviewsCount;
        uint sumRating;
        mapping(address => bool) hasReviewed;
    }

    event ProductAdded(
        uint id,
        string title
    );

    event ProductReviewed(
        uint id,
        uint avgRating
    );

    mapping(uint => Product) products;
    uint public productCount = 0;

    constructor() public {
        owner = msg.sender;
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    function addProduct(string _title) public onlyOwner {
        require(keccak256(bytes(_title)) != keccak256(""), "The title property is required.");

        Product memory product = Product({
            id: productCount,
            title: _title,
            reviewsCount: 0,
            sumRating: 0
        });

        products[productCount] = product;
        productCount++;
        emit ProductAdded(product.id, product.title);
    }
        
    function addReview(uint _productId, uint8 _rating) public {
        Product storage product = products[_productId];

        require(keccak256(bytes(product.title)) != keccak256(""), "Product not found.");
        require(_rating >= 0 && _rating <= 5, "Rating is out of range.");
        require(!product.hasReviewed[msg.sender], "This address already reviewed this product.");

        product.sumRating += _rating * 10;
        product.hasReviewed[msg.sender] = true;
        product.reviewsCount++;

        emit ProductReviewed(product.id, product.sumRating / product.reviewsCount);
    }
    
    function getProduct(uint productId) public view returns (uint id, string title, uint avgRating, bool hasReviewed) {
        Product storage product = products[productId];
        uint _avgRating = 0;

        if(product.reviewsCount > 0)
            _avgRating = product.sumRating / product.reviewsCount;
        
        return (
            product.id,
            product.title,
            _avgRating,
            product.hasReviewed[msg.sender]
        );
    }
}