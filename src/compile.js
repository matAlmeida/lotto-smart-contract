const path = require('path');
const fs = require('fs');
const solc = require('solc');

module.exports = (contractPath) => {
  const inboxPath = path.resolve(__dirname, contractPath);
  const source = fs.readFileSync(inboxPath, 'utf8');

  const contractName = contractPath.split('/')[-1].split('.')[0];

  return solc.compile(source, 1).contracts[`:${contractName}`];
};
