/*
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
*/

/* --------------------------------------- */
/* URL */
/* --------------------------------------- */
let m = 'http://127.0.0.1:8000';
let rootUrl = new URL('/', m);

/* --------------------------------------- */
/* IMPORTS */
/* --------------------------------------- */

const fs = require('fs');
const http = require('http');
const url = require('url');

/* --------------------------------------- */
/* PAGES */
/* --------------------------------------- */
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  'utf-8'
);
/* --------------------------------------- */
/* FUNCTION */
/* --------------------------------------- */
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

/* --------------------------------------- */
/* SERVER */
/* --------------------------------------- */
// Reading data.js at the very start
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// Formating data as JSON
const dataObj = JSON.parse(data);
// Data is now usable
/* --------------------------------------- */
const server = http.createServer((req, res) => {
  const { searchParams, pathname } = new URL(req.url, rootUrl);
  const idParam = searchParams.toString();
  const iD = idParam.substr(idParam.length - 1);

  /* ------- Overview page ------- */
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
    /* ------------------------------ */
    /* -------- PRODUCT PAGE -------- */
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[iD];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    /* ----------------------------- */
    /* ------------ :API ----------- */
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });

    res.end(data);
    /* ----------------------------- */
    /* ------ NOT FOUND PAGE ------- */
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
