'use strict'

const fs = require('fs')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const Promise = require('bluebird')

const leagueDB = require('./league.json')
let idList = {}
let errorList = []
let hundredList = []

let fetchId = (league, club) => {
  return fetch(`http://cn.fifaaddict.com/fo3db.php?q=player&league=${league}&club=${club}`, {
    timeout: 1000 * 10
  })
    .then((res) => {
      return res.text()
    })
    .then((body) => {
      let $ = cheerio.load(body)
      let $pr = $('.player-row')
      $pr.each((i, p) => {
        idList[league].push($(p).attr('id').substring(9))
      })
      console.log(`${league} ${club} success ${$pr.length}`)
      if ($pr.length === 100) {
        hundredList.push(`${league} ${club}`)
      }
      return idList[league]
    })
    .catch((err) => {
      // console.log(err)
      console.error(`${league} ${club} ERROR!!!`)
      errorList.push(`${league} ${club}`)
    })
}

let fetchDB = () => {
  Promise.mapSeries(leagueDB, (l) => {
    idList[l.name] = []
    return Promise.map(l.clubs, (c) => {
      return fetchId(l.name, c.name)
    })
      .then((res) => {
        fs.writeFileSync(`id/${l.name}_id.json`, JSON.stringify(idList[l.name]))
        console.log(`${l.name} ${idList[l.name].length}`)
      })
  })
    .then(() => {
      console.log(errorList)
      console.log(hundredList)
    })
}

fetchDB()

// fetchLeague('austrian-bundesliga')

// console.log(leagueDB.length)

// fetchId(, 'FK-Austria-Wien')
