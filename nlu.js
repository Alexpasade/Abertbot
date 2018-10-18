const TelegrafWit = require('telegraf-wit')
const Promise = require('bluebird')

const wit = new TelegrafWit('Q6PBIFIPWDANYUIET6Y2MDXTRYCLUUQI')

module.exports = (message) => {
    return new Promise( (resolve, rejected) => {
     wit.meaning(message.text)
    .then(result => {
        message.nlu = result
        resolve(message)
      })
    })
}