let fs = require('fs');
const path = require('path');
let data = '';

const coolPath = path.join(__dirname, 'text.txt');
let readerStream = fs.createReadStream(coolPath);

readerStream.setEncoding('UTF8');

readerStream.on('data', function (chunk) {
  data += chunk;
});

readerStream.on('end', function () {
  console.log(data);
});

readerStream.on('error', function (err) {
  console.log(err.stack);
});

console.log('Program Ended');
