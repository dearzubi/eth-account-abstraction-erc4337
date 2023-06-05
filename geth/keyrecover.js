const keythereum  = require ("keythereum");

const datadir = `${__dirname}/data`;

const address = process.argv[2];
const password = process.argv[3];

const keyObject = keythereum.importFromFile(address, datadir);

const privateKey = keythereum.recover(password, keyObject);

console.log(privateKey.toString("hex"));