// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Market is ERC1155, Ownable {

    using SafeMath for uint;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {

    }

    enum State { ticketSaleNotStarted, ticketSaleStarted, ticketSaleEnded }

    Event[] public events;
    mapping (uint256 => address[]) public attendees;

    struct Event {
        uint256 eventID;
        address organiser;
        State currentState;
        uint256 totalTicket;
        uint256 ticketPrice;
        string  initialTokenURI;
    }

    uint256 private _currentEventId = 0;
    mapping (address => uint256) public balances;

    function createEvent(uint256 _numTickets, uint256 _price, string  memory _tokenURI) public {
        events.push(Event(
            _currentEventId, 
            msg.sender, 
            State.ticketSaleNotStarted, 
            _numTickets, 
            _price,
            _tokenURI));
        _mint(msg.sender, _currentEventId, _numTickets, "");
        emit eventCreated(_currentEventId, _numTickets, _price);
        _incrementEventId();
    }

    // event organiser can withdraw funds from ticket sales
    function withdraw() public {
        payable(msg.sender).transfer(balances[msg.sender]);
        balances[msg.sender] = 0;
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

    function _incrementEventId() private {
        _currentEventId++;
    }

    // this function should be called by the buyer
    function buyTicket(uint256 _eventId, uint256 _amount) public payable {
        Event storage selectedEvent = events[_eventId];
        //require(selectedEvent.currentState == State.ticketSaleStarted);
        require(msg.value >= _amount.mul(selectedEvent.ticketPrice));
        address seller = selectedEvent.organiser;
        balances[seller] += msg.value;
        attendees[_eventId].push(msg.sender);
        _safeTransferFrom(seller, msg.sender, _eventId, _amount, "");
        emit ticketTransferred(_eventId, _amount, msg.sender);
    }

    function getEventsLength() public view returns(uint) {
        return events.length;
    }

    function getAttendeesLength(uint256 _eventId) public view returns(uint) {
        return attendees[_eventId].length;
    }

    event ticketTransferred(uint256 _id, uint256 _numTickets, address _owner); //show the address of new owner
    event eventCreated(uint256 _id, uint256 _numTickets, uint256 _price);

}
