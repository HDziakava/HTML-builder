const fs = require('fs');
const path = require('path');

const coolPath = path.join(__dirname, 'project-dist');
const indexPath = path.join(__dirname, 'project-dist/index.html');
const stylePath = path.join(__dirname, 'project-dist/style.css');
const originAssetsPath = path.join(__dirname, 'assets');
const assetsPath = path.join(coolPath, 'assets');

const writableStream = fs.createWriteStream(indexPath);

fs.mkdir(coolPath, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }

  fs.writeFile(indexPath, '!DOCTYPE html', 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
  });

  fs.writeFile(
    stylePath,
    'body {\nbox-sizing: border-box;\n}',
    'utf8',
    (err) => {
      if (err) {
        return console.error(err);
      }
    },
  );

  fs.mkdir(assetsPath, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }

    fs.cp(originAssetsPath, assetsPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
});

let template = '';

const templatePath = path.join(__dirname, 'template.html');
const readerStream = fs.createReadStream(templatePath);
readerStream.setEncoding('UTF8');

readerStream.on('data', function (chunk) {
  template = chunk;

  fs.readdir(path.join(__dirname, 'components'), (err, files) => {
    files.forEach((file) => {
      const filePath = path.join(__dirname, `components/${file}`);

      const stream = fs.createReadStream(filePath);

      stream.setEncoding('UTF8');

      const processTemplate = (template) => {
        if (!(template.includes('{{') && template.includes('}}'))) {
          writableStream.write(template);
        }
      };

      stream.on('data', function (chunk) {
        template = template.replace(
          `{{${file.slice(0, file.lastIndexOf('.'))}}}`,
          chunk,
        );
        processTemplate(template);
      });
    });
  });
});

let data = [];

const stylesPath = path.join(__dirname, 'styles');

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    const filePath = path.join(stylesPath, file.name);
    const readerStream = fs.createReadStream(filePath);
    readerStream.setEncoding('UTF8');

    readerStream.on('data', function (chunk) {
      data.push(chunk);
    });

    readerStream.on('end', function () {
      fs.writeFile(stylePath, data.join('\n'), 'utf8', (err) => {
        if (err) {
          return console.error(err);
        }
      });
    });

    readerStream.on('error', function (err) {
      console.log(err.stack);
    });
  });
});
