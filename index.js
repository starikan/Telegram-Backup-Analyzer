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

  msg.repost = !!$('.forwarded.body').length
  msg.isMedia = !!$('.media_wrap').length
  msg.isPoll = !!$('.media_poll').length

  const typeMedia = $('.media > .body > .title').text().trim()
  msg.isSticker = typeMedia === 'Sticker'
  msg.isPhoto = typeMedia === 'Photo'
  msg.isAnimation = typeMedia === 'Animation'

  const status = $('.media > .body > .status').text().split(',').map(v => v.trim());
  if (msg.isSticker) {
    msg.stickerEmoji = _.get(status, '0')
    msg.mediaSize = _.get(status, '1').replace('KB', '').trim()
  }
  if (msg.isPhoto) {
    msg.mediaResolution = _.get(status, '0')
    msg.mediaSize = _.get(status, '1').replace('KB', '').trim()
  }
  if (msg.isAnimation) {
    msg.mediaSize = _.get(status, '0').replace('KB', '').trim()
  }

  data.push(msg);
});

debugger;

