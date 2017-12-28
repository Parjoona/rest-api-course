const env = process.env.NODE_ENV || 'development';

console.log(env);

// Checkar om vi är i development eller test
// sätter till test om vi använder test-watch
if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}
