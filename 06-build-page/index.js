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

  const articlesPath = path.join(__dirname, 'components/articles.html');
  const footerPath = path.join(__dirname, 'components/footer.html');
  const headerPath = path.join(__dirname, 'components/header.html');

  const articlesStream = fs.createReadStream(articlesPath);
  const footerStream = fs.createReadStream(footerPath);
  const headerStream = fs.createReadStream(headerPath);

  articlesStream.setEncoding('UTF8');
  footerStream.setEncoding('UTF8');
  headerStream.setEncoding('UTF8');

  const processTemplate = (template) => {
    if (!(template.includes('{{') && template.includes('}}'))) {
      writableStream.write(template);
    }
  };

  articlesStream.on('data', function (articlesChunk) {
    template = template.replace('{{articles}}', articlesChunk);
    processTemplate(template);
  });

  footerStream.on('data', function (footerChunk) {
    template = template.replace('{{footer}}', footerChunk);
    processTemplate(template);
  });

  headerStream.on('data', function (headerChunk) {
    template = template.replace('{{header}}', headerChunk);
    processTemplate(template);
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
