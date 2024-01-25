const fs = require('fs');
const path = require('path');

const coolPath = path.join(__dirname, 'files-copy');
const folderPath = path.join(__dirname, 'files');

fs.mkdir(coolPath, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }

  let isLast = false;

  fs.readdir(coolPath, (err, files) => {
    if (files.length === 0) {
      isLast = true;

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
    }

    files.forEach((file, index) => {
      isLast = index === files.length - 1;
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
