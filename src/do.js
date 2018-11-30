const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const contract = require('./compile');

require('dotenv').config();
const mnenonic = process.env.META_WORDS;
const provider_url = process.env.RINKEBY_URL;

const provider = new HDWalletProvider(mnenonic, provider_url);

const web3 = new Web3(provider);

const inbox = await new web3.eth.Contract(JSON.parse(contract.interface));
