const fs = require('fs');
const path = require('path');
const cherrio = require('cheerio');
const _ = require('lodash');

const folder = 'messages';

const files = fs
  .readdirSync(folder)
  .filter(v => path.extname(v) == '.html')
  .map(v => path.join(__dirname, folder, v))
  .map(v => fs.readFileSync(v));

const html = files[0].toString('utf8');
const $ = cherrio.load(html);

const msgs = $('div.message.default');

const data = [];
msgs.map((i, m) => {
  const msg = {};
  const $ = cherrio.load(m);

  msg.name = $('.from_name')
    .text()
    .trim();

  if (msg.name === '') {
    msg.name = data[i - 1].name;
  }

  msg.reply = $('.reply_to > a').attr('href')
    ? +$('.reply_to > a')
        .attr('href')
        .match(/\d+/)
        .toString()
    : null;

  msg.text = $('.message > .body > .text')
    .text()
    .trim();

  msg.timestamp = $('.message > .body > .date').attr('title')

  // if (msg.text === "Достижений вам в этом году.") debugger

  msg.repost = !!$('.forwarded.body').length
    
  // debugger
  data.push(msg);
});

debugger;

