'use strict'

const fetch = require('node-fetch')
const cheerio = require('cheerio')

module.exports = (playerId) => {
  return fetch(`http://cn.fifaaddict.com/fo3player.php?id=${playerId}`)
    .then((res) => {
      return res.text()
    })
    .then((body) => {
      let $ = cheerio.load(body)
      console.log($('.player_name a').text().trim())
      return $('.player_name a').text().trim()
    })
}
