import fs from 'node:fs';
import https from 'node:https';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

// Creats memes-directory if it doesn't exist already
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
  imgArr[i] = imgTags[i].rawAttrs.trim().slice(5, -11);

  // create zero-based filenumber
  let filenumber;
  if (i === 9) {
    filenumber = i + 1;
  } else {
    filenumber = '0' + (i + 1);
  }
  // download img
  const file = fs.createWriteStream(`./memes/${filenumber}.jpg`);
  https
    .get(imgArr[i], function (res) {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
      });
    })
    .on('error', (err) => {
      console.error(err);
    });
}
