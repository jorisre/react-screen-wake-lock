#!/usr/bin/env node
const fs = require('fs');

const content = `var e="react-screen-wake-lock.",r="production";process.env.NODE_ENV===r?module.exports=require("./"+e+r):module.exports=require("./"+e+"development");`;

const dir = './dist';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.writeFileSync(`${dir}/react-screen-wake-lock.js`, content);
