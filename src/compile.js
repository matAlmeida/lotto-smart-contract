const path = require('path');
const fs = require('fs');
const solc = require('solc');

module.exports = (contractPath) => {
  const inboxPath = path.resolve(__dirname, contractPath);
  const source = fs.readFileSync(inboxPath, 'utf8');

  const nameReg = /.*\/([a-zA-Z]*).sol/gm.exec(inboxPath);

  const contractName = nameReg[1];

  return solc.compile(source, 1).contracts[`:${contractName}`];
};
