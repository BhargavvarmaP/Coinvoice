// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./InvoiceToken.sol";

contract InvoiceMarketplace is ReentrancyGuard, Ownable {
    InvoiceToken public invoiceToken;

    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Listing) public listings;

    event InvoiceListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event InvoiceSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event ListingCanceled(uint256 indexed tokenId, address indexed seller);

    constructor(address _invoiceToken) Ownable(msg.sender) {
        invoiceToken = InvoiceToken(_invoiceToken);
    }

    function listInvoice(uint256 tokenId, uint256 price) external {
        require(invoiceToken.ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(price > 0, "Price must be greater than 0");

        invoiceToken.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isActive: true
        });

        emit InvoiceListed(tokenId, msg.sender, price);
    }

    function buyInvoice(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Listing is not active");
        require(msg.value == listing.price, "Incorrect payment amount");
        require(msg.sender != listing.seller, "Seller cannot buy their own invoice");

        address seller = listing.seller;
        uint256 price = listing.price;

        listing.isActive = false;
        delete listings[tokenId];

        invoiceToken.transferFrom(address(this), msg.sender, tokenId);
        payable(seller).transfer(price);

        emit InvoiceSold(tokenId, seller, msg.sender, price);
    }

    function cancelListing(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing is not active");

        listing.isActive = false;
        delete listings[tokenId];

        invoiceToken.transferFrom(address(this), msg.sender, tokenId);

        emit ListingCanceled(tokenId, msg.sender);
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }
}