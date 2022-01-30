// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Market is Ownable, ERC721URIStorage{

  using SafeMath for uint;

  enum State { ticketSaleNotStarted, ticketSaleStarted, ticketSaleEnded }

  Event[] public events;
  mapping (uint256 => address[]) public attendees;

  struct Event {
      uint256 eventID;
      address organiser;
      State currentState;
      uint256 totalTicket;
      uint256 ticketPrice;
      uint256 firstTicketID; 
      uint256 currentTicketID;
      uint256 lastTicketID;
  }

  uint256 private _currentEventId = 0;
  uint256 private _currentTokenId = 0;
  mapping (address => uint256) balances;
  string private _base;

  constructor() ERC721("NFT Tickets", "TIX") {
      _setBaseURI("https://ipfs.moralis.io:2053/ipfs/");
  }

  function _setBaseURI(string memory _uri) private {
      _base = _uri;
  }

  function _baseURI() internal view override returns (string memory) {
      return _base;
  }

  function createEvent(uint256 _numTickets, uint256 _price, string memory _ticketUri) public {
      events.push(Event(
          _currentEventId, 
          msg.sender, 
          State.ticketSaleNotStarted, 
          _numTickets, 
          _price,
          _currentTokenId,
          _currentTokenId,
          _currentTokenId.add(_numTickets).sub(1)));
      createTickets(_numTickets, _ticketUri);
      emit eventCreated(_currentEventId, _numTickets, _price);
      _incrementEventId();
  }

  function createTickets(uint256 _num, string memory _ticketUri) private returns(bool) {
      for (uint i=0; i<_num; i++) {
          _mint(msg.sender, _currentTokenId); 
          _setTokenURI(_currentTokenId, _ticketUri);
          _incrementTokenId();
      }
      return true;
  }

  // event organiser can withdraw funds from ticket sales
  function withdraw() public {
      payable(msg.sender).transfer(balances[msg.sender]);
  }

  function startTicketSale(uint256 _eventId) public {
      Event storage selectedEvent = events[_eventId];
      require(msg.sender == selectedEvent.organiser);
      selectedEvent.currentState = State.ticketSaleStarted;
  }

  function endTicketSale(uint256 _eventId) public {
      Event storage selectedEvent = events[_eventId];
      require(msg.sender == selectedEvent.organiser);
      selectedEvent.currentState = State.ticketSaleEnded;
  }

  function _incrementTokenId() private {
      _currentTokenId++;
  }

  function _incrementEventId() private {
      _currentEventId++;
  }

  // this function should be called by the buyer
  function buyTicket(uint256 _eventId, string memory _ticketUri) public payable {
      Event storage selectedEvent = events[_eventId];
      //require(selectedEvent.currentState == State.ticketSaleStarted);
      require(msg.value >= selectedEvent.ticketPrice);
      uint256 tokenId = selectedEvent.currentTicketID;
      require(tokenId <= selectedEvent.lastTicketID);
      address seller = ownerOf(tokenId);
      balances[seller] += msg.value;
      attendees[_eventId].push(msg.sender);
      _safeTransfer(seller, msg.sender, tokenId, "");
      _setTokenURI(tokenId, _ticketUri);
      selectedEvent.currentTicketID++;
      emit ticketTransferred(tokenId, msg.sender);
  }

  function getEventsLength() public view returns(uint) {
      return events.length;
  }

  function getAttendeesLength(uint256 _eventId) public view returns(uint) {
      return attendees[_eventId].length;
  }

  event ticketTransferred(uint256 _id, address _owner); //show the address of new owner
  event eventCreated(uint256 _id, uint256 _numTickets, uint256 _price);

}