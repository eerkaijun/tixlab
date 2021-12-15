// SPDX-License-Identifier: MIT
// curren deployed address on Shibuya: 0x5D1ce7Fb931274Aa315707aEB2abAD9D138780FA

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Marketplace is Ownable, ERC721URIStorage{

  using SafeMath for uint;

  enum State { creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart }
  State public currentState = State.creatingTickets;

  // metadata for each ticket
  struct Ticket {
      uint256 maxPrice; // maximum price cap on the ticket
      uint256 price; // current price
      bool onSale;
  }

  uint256 private _currentTokenId = 0;
  Ticket[] public tickets;
  mapping (address => uint256) etherBalance;
  uint public vaultBalance;
  uint private _maxTicketNum = 10;
  string private _base;

  uint public investmentPrice;
  uint public unitReturn; 
  uint public _investmentSold = 0;
  mapping(address=>uint) public investors; // mapping to show number of shares owned by each investor

  constructor(uint _investmentPrice) ERC721("NFT Tickets", "TIX") {
    // investmentPrice = _investmentPrice;
    investmentPrice = 3;
    _setBaseURI("https://ipfs.infura.io/ipfs/");
    // _setBaseURI("ipfs://");
  }

  modifier eventNotStarted() {
    require(currentState == State.ticketSaleStart);
    _;
  }

  function _setBaseURI(string memory _uri) private {
    _base = _uri;
  }

  function _baseURI() internal view override returns (string memory) {
    return _base;
  }

  function createTicket(uint256 _price, uint256 _maxPrice, string memory _tokenURI) public onlyOwner {
    require(currentState == State.creatingTickets);
    _mint(msg.sender, _currentTokenId); //token id starts from 0
    tickets.push(Ticket(_maxPrice, _price, true));
    _setTokenURI(_currentTokenId, _tokenURI);
    emit ticketCreated(_currentTokenId, _price, _tokenURI);
    _incrementTokenId();
  }

// https://rinkeby.rarible.com/token/0x80BC2298872D8C88f0Eca80fA1a63953Ac3093F8:1

// https://rinkeby.rarible.com/token/0x0000000000000000000000000000000000000000:1

  // let's say the event organiser will have 100 tickets as Collateral
  // each ticket will cost $100 in the primary market = $10000
  // for each ticket sold, $40 will be put into a vault (40%)
  // total collateral worth $40 x 100 (if sold out) = $4000
  // and now the event organiser wants to pre finance $3000
  // so the event organiser will sell each collateral at $30 until 100 collateral has been sold


  // investors can choose to invest in a number of tokens
  function invest(uint _number) public payable {
    require(currentState == State.investmentStart);
    require(msg.value == investmentPrice.mul(_number));
    require(_number + _investmentSold < _currentTokenId.add(1));
    _incrementInvestmentId(_number);
    investors[msg.sender] += _number;
    emit invested(msg.sender, _number);
  }

  function _incrementInvestmentId(uint _number) private {
    _investmentSold = _investmentSold + _number;
  }

  // event organiser can withdraw funds before the event starts
  function withdraw() public onlyOwner {
    require(currentState == State.investmentStop);
    payable(msg.sender).transfer(address(this).balance);
  }

  function getContractBalance() public view returns(uint) {
    return address(this).balance;
  }

  function changeTicketPrice(uint256 _tokenId, uint256 _newPrice, string memory _tokenURI) public {
    require(msg.sender == ownerOf(_tokenId));
    Ticket storage tix = tickets[_tokenId];
    require(_newPrice < tix.maxPrice, "not more than the upper limit price");
    tix.price = _newPrice;
    _setTokenURI(_tokenId, _tokenURI);
  }

  function startEvent() public onlyOwner {
    require(currentState == State.ticketSaleStart);
    currentState = State.eventStart;
    unitReturn = vaultBalance.div(_investmentSold);
    emit eventStarted(); 
  }

  function startInvestment() public onlyOwner {
    require(currentState == State.creatingTickets);
    currentState = State.investmentStart;
    emit investmentStarted(); 
  }

  function stopInvestment() public onlyOwner {
    require(currentState == State.investmentStart);
    currentState = State.investmentStop;
    emit investmentStopped();
  }

  function startTicketSale() public onlyOwner {
    require(currentState == State.investmentStop);
    currentState = State.ticketSaleStart;
    emit ticketSaleStarted();
  }

  function _incrementTokenId() private {
    _currentTokenId++;
  }

  function retrieve() public {
    require(currentState == State.eventStart);
    if (investors[msg.sender] > 0) {
      etherBalance[msg.sender] += unitReturn.mul(investors[msg.sender]);
      investors[msg.sender] = 0;
    }
    payable(msg.sender).transfer(etherBalance[msg.sender]);
  }

  // tickets need to put on sale first before it could be purchased
  function toggleSale(uint256 _tokenId) public {
    require(msg.sender == ownerOf(_tokenId));
    Ticket storage tix = tickets[_tokenId];
    tix.onSale = !tix.onSale;
    emit saleToggled(_tokenId, tix.onSale);
  }

  // this function should be called by the buyer
  function buyTicket(uint256 _tokenId) external payable {
    Ticket storage tix = tickets[_tokenId];
    require(tix.onSale == true);
    require(msg.value >= tix.price, "at least the ticket price");
    require(balanceOf(msg.sender) < _maxTicketNum, "exceeded max number of tickets bought");
    address seller = ownerOf(_tokenId);
    tix.onSale = false;
    etherBalance[seller] += (msg.value).div(5).mul(3); //60%
    vaultBalance += (msg.value).div(5).mul(2); //40%
    _safeTransfer(seller, msg.sender, _tokenId, "");
    emit ticketTransferred(_tokenId, msg.sender);
    emit saleToggled(_tokenId, false);
  }

  function getTicketsLength() public view returns(uint) {
    return tickets.length;
  }

  event ticketTransferred(uint256 _id, address _owner); //show the address of new owner
  event saleToggled(uint256 _id, bool state); //show whether ticket is on sale
  event ticketCreated(uint256 _id, uint256 _price, string _tokenURI);
  event invested(address _investor, uint _number);
  event investmentStarted();
  event investmentStopped();
  event ticketSaleStarted();
  event eventStarted();

}