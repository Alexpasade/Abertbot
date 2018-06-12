var express = require('express');
var router = express.Router();
let ciudad = ''
let direcccion = ''
let http = require('http');
let request = require('request')
const nlu = require('./nlu')
const dialog = require('./dialog')

const Telegraf = require('telegraf')
const expressApp = express()
const bot = new Telegraf('594758646:AAFOOFKbVgjvIuUN92G9WlIIw_I8eqUm9EQ')
expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://54a3d689.ngrok.io/secret-path')
expressApp.post('/secret-path', (req,res) => {
  res.json(res)
})
expressApp.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
bot.start((ctx) => ctx.reply('Hola soy Albert'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('Eres pipa?', (ctx) => ctx.reply('Soy alcahuete'))
bot.command('/creators', ({ reply }) => reply('Los creadores son: Gon, Alex, Ignacio y Jorge'))
bot.command('/help', ({ reply }) => reply(`mis comandos son: 
  Si necesitas ayuda: /help
  Si quieres saber los creadores: /creators
  El tiempo en tu ciudad: /weather
  Donde estoy: /whereami`))

bot.command('/weather', (ctx) => {

  getWeather(ctx)

 })
bot.command('/whereami', (ctx) => {

  getLocation(ctx)

})

 function getWeather(ctx){
  let numLetras = ctx.update.message.text.indexOf(" ") + 1
  if (numLetras === 0) {
    ctx.reply('Necesitas especificar una ciudad. Espabila!!!!')
  } else {
    this.ciudad = ctx.update.message.text.substring(numLetras)
     request(`http://api.openweathermap.org/data/2.5/weather?q=${this.ciudad}&APPID=56c96cccbad000054056d2c70263ef25&units=metric&lang=es`, function (error, response, body) {

      let tiempo = JSON.parse(body);
      let description = tiempo.weather[0].description;
      let tempMinina = tiempo.main.temp_min;
      let tempMaxima = tiempo.main.temp_max;

      bot.telegram.sendMessage(ctx.from.id, `
      Este es el tiempo:

      Asi está el cielo en tu ciudad: ${description}
      Esta es la temperatura minima: ${tempMinina}
      Esta es la temperatura máxima: ${tempMaxima}`)
      
    })
  }
 }

 function getLocation(ctx){

  let numLetras = ctx.update.message.text.indexOf(" ") + 1
  if (numLetras === 0) {
    ctx.reply('Necesitas especificar una calle. Espabila!!!!')
  } else {
    this.direcccion = ctx.update.message.text.substring(numLetras)
    request(`https://geocode.xyz/${this.direcccion}?json=1&auth=989650020275722119459x606`, function (error, response, body) {

      let adress = JSON.parse(body)
      let longt = adress.longt
      let lang = adress.latt
  
      bot.telegram.sendMessage(ctx.from.id, 
      `Estas son tus coordenadas 
      Latitud: ${lang}
      Longitud: ${longt}`)
      bot.telegram.sendPhoto(ctx.from.id, `https://maps.googleapis.com/maps/api/staticmap?center=${lang},${longt}&zoom=18&size=600x300&maptype=roadmap
      &markers=color:blue%7Clabel:S%${lang},${longt}&key=AIzaSyDPJ0oBGmKZXjWlee9h0lQL1n0gmdAjQ58`)
    })
   }
 }
 bot.on('text', (ctx) => {
  nlu(ctx.message).then(dialog)
  .then((value) => {
    bot.telegram.sendMessage(ctx.from.id, value)
  })
 })


module.exports = router;
