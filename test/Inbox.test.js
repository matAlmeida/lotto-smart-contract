const expect = require('chai').expect;
const ganache = require('ganache-core');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

// Contracts
const { interface, bytecode } = require('../src/compile');

describe('Inbox', () => {
  const defaultArguments = ['Meu primeiro contrato'];
  const defaultContract = {
    data: bytecode,
    arguments: defaultArguments
  };

  let accounts;
  let inbox;

  const getMessage = async () => await inbox.methods.message().call();
  const sendMessage = async (message) =>
    await inbox.methods.setMessage(message).send({ from: accounts[0] });

  beforeEach('Recreate Contract', async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy(defaultContract)
      .send({ from: accounts[0], gas: 1000000 });
  });

  it('Deploy a contract', async () => {
    expect(inbox.options.address).to.be.ok;
  });

  it('Default message', async () => {
    const retrivedMessage = await getMessage();

    expect(retrivedMessage).to.equal(defaultArguments[0]);
  });

  it('Changing message', async () => {
    const newMessage = 'New Message';
    await sendMessage(newMessage);
    const retrivedMessage = await getMessage();

    expect(retrivedMessage).to.equal(newMessage);
  });
});
