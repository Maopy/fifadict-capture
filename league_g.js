/**
 * Created by Maopy on 16/7/26.
 */
'use strict'

const fetch = require('node-fetch')
const cheerio = require('cheerio')
const Promise = require('bluebird')

const TIMEOUT = 1000 * 2
let startId = 1
let leagueList = []
let errorList = []

let $ = cheerio.load('<select id="select-player-league" name="player_league" class="form-control input-sm fo-select" autocomplete="off"> <option value="" data-league="">- - 联赛 - -</option> <option disabled="" class="disabled_nav">Austria</option><option value="austrian-bundesliga" data-league="80">Austrian Bundesliga</option><option disabled="" class="disabled_nav">Belgium</option><option value="belgium-pro-league" data-league="4">Belgium Pro League</option><option disabled="" class="disabled_nav">Denmark</option><option value="superliga" data-league="1">Superliga</option><option disabled="" class="disabled_nav">England</option><option value="barclays-premier-league" data-league="13">Barclays Premier League</option><option value="football-league-championship" data-league="14">- Football League Championship</option><option value="football-league-1" data-league="60">- - Football League 1</option><option value="football-league-2" data-league="61">- - - Football League 2</option><option disabled="" class="disabled_nav">France</option><option value="ligue-1" data-league="16">Ligue 1</option><option value="ligue-2" data-league="17">- Ligue 2</option><option disabled="" class="disabled_nav">Germany</option><option value="bundesliga" data-league="19">Bundesliga</option><option value="bundesliga-2" data-league="20">- Bundesliga 2</option><option disabled="" class="disabled_nav">Ireland Republic</option><option value="airtricity-league" data-league="65">Airtricity League</option><option disabled="" class="disabled_nav">Italy</option><option value="serie-a" data-league="31">Serie A</option><option value="serie-b" data-league="32">- Serie B</option><option disabled="" class="disabled_nav">Holland</option><option value="eredivisie" data-league="10">Eredivisie</option><option disabled="" class="disabled_nav">Norway</option><option value="tippeligaen" data-league="41">Tippeligaen</option><option disabled="" class="disabled_nav">Poland</option><option value="t-mobile-ekstraklasa" data-league="66">T-Mobile Ekstraklasa</option><option disabled="" class="disabled_nav">Portugal</option><option value="liga-portuguesa" data-league="308">Liga Portuguesa</option><option disabled="" class="disabled_nav">Russia</option><option value="sogaz-russian-football-championship" data-league="67">Sogaz Russian Football Championship</option><option disabled="" class="disabled_nav">Scotland</option><option value="scottish-premiership" data-league="50">Scottish Premiership</option><option disabled="" class="disabled_nav">Spain</option><option value="liga-bbva" data-league="53">Liga BBVA</option><option value="liga-adelante" data-league="54">- Liga Adelante</option><option disabled="" class="disabled_nav">Sweden</option><option value="allsvenskan" data-league="56">Allsvenskan</option><option disabled="" class="disabled_nav">Switzerland</option><option value="raiffeisen-super-league" data-league="189">Raiffeisen Super League</option><option disabled="" class="disabled_nav">Turkey</option><option value="süper-lig" data-league="68">Süper Lig</option><option disabled="" class="disabled_nav">Argentina</option><option value="primera-división" data-league="353">Primera División</option><option disabled="" class="disabled_nav">Chile</option><option value="campeonato-nacional-petrobras" data-league="335">Campeonato Nacional Petrobras</option><option disabled="" class="disabled_nav">Colombia</option><option value="liga-postobón" data-league="336">Liga Postobón</option><option disabled="" class="disabled_nav">Mexico</option><option value="liga-bancomer-mx" data-league="341">LIGA Bancomer MX</option><option disabled="" class="disabled_nav">United States</option><option value="major-league-soccer" data-league="39">Major League Soccer</option><option disabled="" class="disabled_nav">Korea Republic</option><option value="k-league-classic" data-league="83">K LEAGUE Classic</option><option disabled="" class="disabled_nav">Saudi Arabia</option><option value="abdul-latif-jameel-league" data-league="350">Abdul Latif Jameel League</option><option disabled="" class="disabled_nav">Australia</option><option value="hyundai-a-league" data-league="351">Hyundai A-League</option> <option disabled="" class="disabled_nav">other</option> <option value="rest-of-world" data-league="76">Rest of World</option> </select>')
$('option[data-league]').each((i, l) => {
  ~~$(l).attr('data-league') && leagueList.push({
    id: ~~$(l).attr('data-league'),
    name: $(l).val()
  })
})

Promise.mapSeries(leagueList, (l) => {
  let output = []
  return fetch(`http://cn.fifaaddict.com/api.php?fo3rq=club_option&league_id=${l.id}`, {
    timeout: TIMEOUT
  })
    .then((res) => {
      return res.text()
    })
    .then((body) => {
      let $$ = cheerio.load(body)
      $$('option').each((i, c) => {
        output.push({
          name: $(c).html().replace(/\s+/g, '-'),
          id: startId++
        })
      })
      console.log(`${l.id} ${l.name} success`)
      return output
    })
    .catch((err) => {
      // console.log(err)
      console.error(`${l.id} ${l.name} ERROR!!!`)
      errorList.push(l)
    })
})
  .then((res) => {
    leagueList.map((l, i) => {
      l.clubs = res[i]
    })
    console.log(JSON.stringify(leagueList))
    console.log(JSON.stringify(errorList))
  })
