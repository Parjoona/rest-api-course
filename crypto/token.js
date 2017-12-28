const jwt = require('jsonwebtoken');

let data = {
  id: 10
};

// Creates a token, with secret as 2nd parameter
let token = jwt.sign(data, 'supersecret')
console.log(token);

// verifies token
let decoded = jwt.verify(token, 'supersecret')
console.log('decoded', decoded);
