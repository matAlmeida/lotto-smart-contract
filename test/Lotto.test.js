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

  let accounts;
  let lotto;

  const getMessage = async () => await lotto.methods.message().call();
  const sendMessage = async (message) =>
    await lotto.methods.setMessage(message).send({ from: accounts[0] });

  beforeEach('Recreate Contract', async () => {
    accounts = await web3.eth.getAccounts();
    lotto = await new web3.eth.Contract(JSON.parse(interface))
      .deploy(defaultContract)
      .send({ from: accounts[0], gas: 1000000 });
  });

  it('Deploy a contract', async () => {
    expect(lotto.options.address).to.be.ok;
  });

  it('Has a creator', async () => {
    const creator = accounts[0];
    const retrivedCreator = await lotto.methods.creator().call();

    expect(retrivedCreator).to.equal(creator);
  });
});