'use strict'

const fetch = require('node-fetch')
const cheerio = require('cheerio')

module.exports = (league, club) => {
  return fetch(`http://cn.fifaaddict.com/fo3db.php?q=player&league=liga-bbva&club=FC-Barcelona`)
    .then((res) => {
      return res.text()
    })
    .then((body) => {
      let $ = cheerio.load(body)
      let idList = []
      $('.player-row').each((i, p) => {
        idList.push($(p).attr('id').substring(9))
      })
      return idList
    })
}
