'use strict'

const fetchPlayer = require('./player')
const fetchId = require('./id')

fetchPlayer(93190043)
  .then((name) => {
    console.log(name, 1)
  })

fetchId()
  .then((ids) => {
    console.log(ids, 222)
  })
