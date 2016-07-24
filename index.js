'use strict'

const fetchPlayer = require('./player')

fetchPlayer(93190043)
  .then((name) => {
    console.log(name, 1)
  })
