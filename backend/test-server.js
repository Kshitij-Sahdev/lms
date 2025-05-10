const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

console.log('Testing connection to backend server...');

const req = http.request(options, (res) => {
  console.log(`Server responded with status code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', data);
    console.log('Server is up and running!');
  });
});

req.on('error', (error) => {
  console.error('Error connecting to server:', error.message);
  console.log('Make sure the backend server is running on port 5000');
});

req.end(); 