const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const contract = require('./compile');

require('dotenv').config();
const mnenonic = process.env.META_WORDS;
const provider_url = process.env.RINKEBY_URL;

const provider = new HDWalletProvider(mnenonic, provider_url);

const web3 = new Web3(provider);

const deploy = async ({ bytecode, interface }, arguments, gas = 1000000) => {
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments })
    .send({ from: accounts[0], gas });

  console.log('Deployed with:', accounts[0]);
  console.log('Implemented in: ', result.options.address);
};

deploy(contract, ['Estamos no Rinkeby']);
