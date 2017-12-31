const env = process.env.NODE_ENV || 'development';

// Checkar om vi är i development eller test
// sätter till test om vi använder test-watch

if (env === 'develpment' || env === 'test') {
  let config = require('./config.json');
  let envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
};

console.log(`Enviroment: ${env}`);
