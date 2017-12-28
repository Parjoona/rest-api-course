const { SHA256 } = require('crypto-js');

// SHA265
let message = 'IM THE BEST USER: 3';
let hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

let data = {
  id: 4
};

let token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'secretword').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

let result = SHA256(JSON.stringify(token.data) + 'secretword').toString()

let me = (result === token.hash) ? console.log('Data was not changed') : console.log('Do not trust');
