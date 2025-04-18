// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract InvoiceToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Invoice {
        uint256 amount;
        string invoiceURI;
        address payable seller;
        address payable buyer;
        bool isPaid;
        uint256 dueDate;
    }

    mapping(uint256 => Invoice) public invoices;

    event InvoiceCreated(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        uint256 dueDate
    );

    event InvoicePaid(
        uint256 indexed tokenId,
        address indexed payer,
        uint256 amount
    );

    constructor() ERC721("InvoiceToken", "INVT") Ownable(msg.sender) {}

    function createInvoice(
        address payable _buyer,
        uint256 _amount,
        string memory _invoiceURI,
        uint256 _dueDate
    ) public returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_dueDate > block.timestamp, "Due date must be in the future");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);

        invoices[newTokenId] = Invoice({
            amount: _amount,
            invoiceURI: _invoiceURI,
            seller: payable(msg.sender),
            buyer: _buyer,
            isPaid: false,
            dueDate: _dueDate
        });

        emit InvoiceCreated(
            newTokenId,
            msg.sender,
            _buyer,
            _amount,
            _dueDate
        );

        return newTokenId;
    }

    function payInvoice(uint256 _tokenId) public payable {
        Invoice storage invoice = invoices[_tokenId];
        require(!invoice.isPaid, "Invoice is already paid");
        require(msg.value == invoice.amount, "Incorrect payment amount");
        require(
            msg.sender == invoice.buyer,
            "Only the buyer can pay the invoice"
        );

        invoice.isPaid = true;
        invoice.seller.transfer(msg.value);

        emit InvoicePaid(_tokenId, msg.sender, msg.value);
    }

    function getInvoice(uint256 _tokenId)
        public
        view
        returns (
            uint256 amount,
            string memory invoiceURI,
            address seller,
            address buyer,
            bool isPaid,
            uint256 dueDate
        )
    {
        Invoice memory invoice = invoices[_tokenId];
        return (
            invoice.amount,
            invoice.invoiceURI,
            invoice.seller,
            invoice.buyer,
            invoice.isPaid,
            invoice.dueDate
        );
    }
}