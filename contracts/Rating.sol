pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Rating is Ownable {
    struct Review {
        uint8 rating;
        bool isSet;
    }
    struct Product {
        uint id;
        string title;
        address[] reviewers;
        uint8[] ratings;
        mapping(address => Review) reviews;
    }

    mapping(uint => Product) public products;
    uint[] productIds;

    constructor() public {
        owner = msg.sender;
    }

    function addProduct(uint _id, string _title) public onlyOwner {
        require(_id > 0, "Invalid product id.");
        require(keccak256(bytes(_title)) != keccak256(""), "The title property is required.");
        require(products[_id].id == 0, "This product id is already being used.");
        
        products[_id].id = _id;
        products[_id].title = _title;
        productIds.push(_id);
    }
        
    function addReview(uint _productId, uint8 _rating) public {
        require(products[_productId].id > 0, "Product not found.");
        require(_rating >= 0 && _rating <= 5, "Rating is out of range.");
        require(!products[_productId].reviews[msg.sender].isSet, "This address already reviewed this product.");
        
        products[_productId].reviewers.push(msg.sender);
        products[_productId].ratings.push(_rating);
        products[_productId].reviews[msg.sender].rating = _rating;
        products[_productId].reviews[msg.sender].isSet = true;
    }
        
    function getProductsIds() public view returns (uint[]) {
        return productIds;
    }
    
    function getProduct(uint productId) public view returns (uint, string, address[], uint8[]) {
        return (products[productId].id, products[productId].title, products[productId].reviewers, products[productId].ratings);
    }
}