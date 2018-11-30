pragma solidity ^0.4.17;

contract Lotto {
    address public creator;
    address[] public players;

    function Lotto() public {
        creator = msg.sender;
    }

    function play() public payable{
        require(msg.value > 0.09 ether);
        players.push(msg.sender);
    }

    function random() private view returns(uint) {
        return uint(keccak256(block.difficulty, block.timestamp, players));
    }

    function raffle() public isCreator returns(address){
        uint indice = random() % players.length;
        address winner = players[indice];
        winner.transfer(this.balance);
        players = new address[](0);

        return winner;
    }

    modifier isCreator(){
        require(msg.sender == creator);
        _;
    }

    function getPlayers() public view returns(address[]){
        return players;
    }
}
