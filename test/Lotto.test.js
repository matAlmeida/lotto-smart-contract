const expect = require('chai').expect;
const ganache = require('ganache-core');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiler = require('../src/compile');

// Contracts
const { interface, bytecode } = compiler('../src/contracts/Lotto.sol');

describe('Lotto', () => {
  const defaultArguments = [];
  const defaultContract = {
    data: bytecode,
    arguments: defaultArguments
  };

  const sendEthers = (ethers) => web3.utils.toWei(ethers, 'ether');

  let accounts;
  let lotto;

  beforeEach('Recreate Contract', async () => {
    accounts = await web3.eth.getAccounts();
    lotto = await new web3.eth.Contract(JSON.parse(interface))
      .deploy(defaultContract)
      .send({ from: accounts[0], gas: 1000000 });
  });

  describe('Deploying', () => {
    it('Deploy a contract', async () => {
      expect(lotto.options.address).to.be.ok;
    });

    it('Has a creator', async () => {
      const creator = accounts[0];
      const retrivedCreator = await lotto.methods.creator().call();

      expect(retrivedCreator).to.equal(creator);
    });

    it('Get Player', async () => {
      const players = await lotto.methods.getPlayers().call();
      expect(players.length).to.equal(0);
    });
  });

  describe('Playing', () => {
    it('Is playable!', async () => {
      const player = accounts[0];
      const playersBeforePlay = await lotto.methods.getPlayers().call();
      await lotto.methods.play().send({
        from: player,
        value: sendEthers('0.1')
      });
      const playersAfterPlay = await lotto.methods.getPlayers().call();

      expect(playersAfterPlay.length).to.be.greaterThan(
        playersBeforePlay.length
      );
      expect(playersAfterPlay.length).to.equal(1);
      expect(playersAfterPlay[0]).to.equal(player);
    });
  });

  describe('Raffle', () => {
    it('Creator play once and Win!', async () => {
      const creator = accounts[0];

      await lotto.methods.play().send({
        from: creator,
        value: sendEthers('0.1')
      });

      const winner = await lotto.methods.raffle().call();

      expect(winner).to.equal(creator);
    });
  });
});
