const fs = require('fs');
const readline = require('readline');
const path = require('path');

const coolPath = path.join(__dirname, 'write.txt');
const writableStream = fs.createWriteStream(coolPath);

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

writableStream.on('error', (error) => {
  console.log(
    `An error occured while writing to the file. Error: ${error.message}`,
  );
});

let sessionName = '';

interface.question('Who are you?', (name) => {
  sessionName = name;
  console.log(`Hey there ${name}!`);
  writableStream.write(`Hey there ${name}! `);
});

interface.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    interface.close();
    console.log(`Farewell ${sessionName}!`);
    writableStream.write(`Farewell ${sessionName}! `);
    return;
  }
  writableStream.write(`${input} `);
});
