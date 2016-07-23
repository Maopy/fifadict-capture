'use strict'

var browser = require('casper').create()
var start = new Date()
var acceleration

browser.start()

browser.thenOpen('http://cn.fifaaddict.com/fo3player.php?id=93190043')

browser.then(function () {
  acceleration = browser.evaluate(function () {
    return document.getElementsByClassName('acceleration')[0].innerText.trim()
  })
})

browser.then(function () {
  this.echo(acceleration)
  this.echo(new Date() - start + 'ms')
  browser.exit()
})

browser.run()
