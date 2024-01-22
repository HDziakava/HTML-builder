const fs = require('fs');
const path = require('path');

const coolPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');

fs.mkdir(coolPath, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Directory created successfully!');
});

fs.readdir(folderPath, (err, files) => {
  files.forEach((file) => {
    const filePath = path.join(__dirname, `files/${file}`);

    fs.rm(path.join(coolPath, file), (err) => {
      if (err) {
        return console.error(err);
      }
    });

    fs.copyFile(filePath, path.join(coolPath, file), (err) => {
      if (err) throw err;
      console.log(`${file} was copied to 'files-copy'`);
    });
  });
});
