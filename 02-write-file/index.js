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
  if (name.toLowerCase() === 'exit') {
    console.log(`Farewell!`);
    writableStream.write(`Farewell! `);
    interface.close();
    return;
  }
  sessionName = name;
  console.log(`Hey there ${name}!`);
  writableStream.write(`${name}! `);
});

interface.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log(`Farewell ${sessionName}!`);
    writableStream.write(`Farewell ${sessionName}! `);
    interface.close();
    return;
  }
  writableStream.write(`${input} `);
});

interface.on('SIGINT', () => {
  console.log(`Farewell ${sessionName}!`);
  writableStream.write(`Farewell ${sessionName}! `);
  interface.close();
});
