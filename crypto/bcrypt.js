const bcrypt = require('bcryptjs');

let password = 'password123';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

let hashed = '$2a$10$iStDLzkxEF9CXmUshtn/KeWW8D8722YZQdahRc36igOnfR2r2Ja5q'
bcrypt.compare(password, hashed, (err, res) => {
  console.log(res);
});
