var RatingToken = artifacts.require("Rating.sol");

module.exports = function(deployer) {
    deployer.deploy(RatingToken);
};