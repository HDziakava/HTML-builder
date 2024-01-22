const fs = require('fs');
const path = require('path');
let data = [];

const coolPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist/bundle.css');

fs.readdir(coolPath, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    const ext = path.extname(file.name).slice(1);

    if (file.isFile() && ext === 'css') {
      const filePath = path.join(coolPath, file.name);
      const readerStream = fs.createReadStream(filePath);
      readerStream.setEncoding('UTF8');

      readerStream.on('data', function (chunk) {
        data.push(chunk);
      });

      readerStream.on('end', function () {
        fs.writeFile(bundlePath, data.join('\n'), 'utf8', (err) => {
          if (err) {
            return console.error(err);
          }
          console.log('Yes');
        });
      });

      readerStream.on('error', function (err) {
        console.log(err.stack);
      });

      console.log('Program Ended');
    }
  });
});
