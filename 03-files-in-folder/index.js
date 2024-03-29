const { stat } = require('node:fs');
const fs = require('fs');
const path = require('path');

const coolPath = path.join(__dirname, 'secret-folder');

const folderToRead = coolPath;

fs.readdir(folderToRead, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const ext = path.extname(file.name).slice(1);
      const fileName = file.name.slice(0, file.name.lastIndexOf('.'));

      const name = file.name;
      const filePath = path.join(coolPath, name);

      const stats = fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
        }
        console.log(`${fileName} - ${ext} - ${stats.size / 1000}kb`);
      });
    }
  });
});
