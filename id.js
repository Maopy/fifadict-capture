'use strict'

const fs = require('fs')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const Promise = require('bluebird')

const leagueDB = require('./league.json')
const LIMIT = 500
let idList = {}
let errorList = []
let total = 0

let fetchId = (league, club) => {
  return fetch(`http://cn.fifaaddict.com/fo3db.php?q=player&league=${league}&club=${club}&limit=${LIMIT}`, {
    timeout: 1000 * 10
  })
    .then((res) => {
      return res.text()
    })
    .then((body) => {
      let $ = cheerio.load(body)
      let $pr = $('.player-row')
      $pr.length !== LIMIT && $pr.each((i, p) => {
        idList[league].push($(p).attr('id').substring(9))
      })
      total += $pr.length
      console.log(`${league} ${club} success ${$pr.length}`)
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
      return Promise.mapSeries(errorList, (e) => {
        let t = e.split(' ')
        return fetchId(t[0], t[1])
      })
        .then((res) => {
          res.map((e, i) => {
            let t = errorList[i].split(' ')
            fs.writeFileSync(`id/${t[0]}_id.json`, JSON.stringify(idList[t[0]]))
            console.log(`${t[0]} ${idList[t[0]].length}`)
          })
        })
    })
    .then(() => {
      console.log(total)
    })
}

fetchDB()

// fetchLeague('austrian-bundesliga')

// console.log(leagueDB.length)

// fetchId(, 'FK-Austria-Wien')
