// contracts/Market1155.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Market is ERC1155, Ownable {

    mapping (uint256 => string) private _uris;

   constructor() public ERC1155("ipfs://QmUAgudzewGii9xkC8JG3NzbEdQEAKjHHZYQC2e3MAnm5h/metadata/1.json") {
        // _mint(msg.sender, _ticketId, 1, "");

    }
    
    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }
    
    function _setTokenUri(uint256 tokenId, string memory uri) private {
        // require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice"); 
        _uris[tokenId] = uri; 
    }



///old ERC721 Contract


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
      string  initialTokenURI;
  }

  uint256 private _currentEventId = 0;
  uint256 private _currentTokenId = 0;
  mapping (address => uint256) balances;

 function createEvent(uint256 _numTickets, uint256 _price, string  memory _tokenURI) public {
      events.push(Event(
          _currentEventId, 
          msg.sender, 
          State.ticketSaleNotStarted, 
          _numTickets, 
          _price,
          _currentTokenId,
          _currentTokenId,
          _currentTokenId.add(_numTickets).sub(1),
          _tokenURI));
      createTickets(_numTickets, _tokenURI);
      emit eventCreated(_currentEventId, _numTickets, _price);
      _incrementEventId();
  }

  function createTickets(uint256 _num, string  memory _tokenURI) private returns(bool) {
      for (uint i=0; i<_num; i++) {
          _mint(msg.sender, _currentTokenId, 1, "");
          _setTokenUri(_currentTokenId, _tokenURI);
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
      _setTokenUri(tokenId, _ticketUri);
    //   address seller = ownerOf(tokenId);
    //   balances[seller] += msg.value;
      attendees[_eventId].push(msg.sender);
    //   _safeTransfer(seller, msg.sender, tokenId, "");
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

//////////////// END of the Old ERC721 Contract

}