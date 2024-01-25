const fs = require('fs');
const path = require('path');

const coolPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');

fs.mkdir(coolPath, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }

  fs.readdir(coolPath, (err, files) => {
    files.forEach((file, index) => {
      const isLast = index === files.length - 1;
      fs.rm(path.join(coolPath, file), (err) => {
        if (err) {
          return console.error(err);
        }

        if (isLast) {
          fs.readdir(folderPath, (err, files) => {
            files.forEach((file) => {
              const filePath = path.join(__dirname, `files/${file}`);

              fs.copyFile(filePath, path.join(coolPath, file), (err) => {
                if (err) throw err;
                console.log(`${file} was copied to 'files-copy'`);
              });
            });
          });
        }
      });
    });
  });
});
