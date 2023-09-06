import fs from 'node:fs';
// import { argv } from 'node:process';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

// Creats memes-directory if it already exists -> clears the directory
try {
  if (!fs.existsSync('./memes')) {
    fs.mkdirSync('./memes');
  }
} catch (err) {
  console.log(`Following error occured: ${err}`);
}

// fetch html-content from url
const response = await fetch(
  'https://memegen-link-examples-upleveled.netlify.app/',
);
const htmlContent = await response.text();

// parses plain html to array of objects
const root = parse(htmlContent);

// creates an array of objects containing just img elements
const imgTags = root.getElementsByTagName('img');

const imgArr = [];
for (let i = 0; i < 10; i++) {
  // fills array with url after triming and slicing away unnecessary parts
  imgArr[i] = imgTags[i].getAttribute('src'); // -1 incl. .jpg?width=300 // -11 just .jpg

  // create zero-based filenumber
  let fileNumber;
  if (i === 9) {
    fileNumber = i + 1;
  } else {
    fileNumber = '0' + (i + 1);
  }

  //   download img
  const file = fs.createWriteStream(`./memes/${fileNumber}.jpg`);
  try {
    const image = await fetch(imgArr[i]);
    image.body.pipe(file);
  } catch (err) {
    console.log(err);
  }
}

/* stretch TODO

if (argv[2]) {
  const path = `https://api.memegen.link/images/${argv[4]}/${argv[2]}/${argv[3]}.jpg`;
  downloadImage(path, 'custom-meme')

} else {
  hier text von oben einfügen wo array befüllt wird
  downloadImage(imgArr[i], filenumber)

}


function downdloadImage(url, filename) {
const file = fs.createWriteStream(`./memes/${filename}.jpg`);
https
    .get(url, function (res) {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
      });
    })
    .on('error', (err) => {
      console.error(err);
    });
}

*/
