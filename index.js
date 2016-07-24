'use strict'

const fetch = require('node-fetch')
const cheerio = require('cheerio')

fetch('http://cn.fifaaddict.com/fo3player.php?id=93190043')
  .then((res) => {
    return res.text()
  })
  .then((body) => {
    // console.log(body, 213)
  })
