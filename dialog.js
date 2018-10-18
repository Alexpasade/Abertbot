let Promise = require('bluebird')
let fs = require('fs')

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        if(message.nlu.entities.intent && message.nlu.entities.intent.length > 0){
            console.log(message.nlu.entities.intent[0].value)
            fs.readFile(`./phrases/${message.nlu.entities.intent[0].value}`,(err,data) =>{
                let frases = data.toString().split('\n')
                resolve(frases[Math.round(Math.random()*frases.length)])
            })
        }else{
            resolve('No te entiendo')
        }
    })
}