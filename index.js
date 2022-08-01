const TelegramApi = require('node-telegram-bot-api')
require('dotenv').config()
const token = process.env.BOT_TOKEN
const client = require('./db')

const bot = new TelegramApi(token, { polling: true })

var addArray = []
//var stage

const botOptions = {
    botmenu: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Почати тренування', callback_data: '/begin' }],
                [{ text: 'Додати нове тренування', callback_data: '/add' }],
                [{ text: 'Редагування тренувань', callback_data: '/settings' }]
            ]
        })
    },

    addTrainClose: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'вийти і видалити все', callback_data: '/addClose' }]
            ]
        })
    },

    addTrain: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'видалити останній рядок', callback_data: '/addDelete' }],
                [{ text: 'зберегти', callback_data: '/addSave' }],
                [{ text: 'вийти і видалити все', callback_data: '/addClose' }]
            ]
        })
    },

    trainingslist: {}

}



bot.setMyCommands([
    { command: '/menu', description: 'головне меню' }
])

client.connect();

const trainMassageParse = function (msg) {
    let lastpose = function (msg, target) {
        var text = msg
        var pos
        for (var n = 0; n < text.length; n++) {
            if (text[n] = ' ')
                pos = n
        }
        return pos - 1
    }

    var text = msg
    var arr = []

    arr.push(text.slice(lastpose(text, ' '), text.length))
    text = text.slice(0, lastpose(text, ' ') - 1)

    arr.push(text.slice(lastpose(text, ' '), text.length))
    text = text.slice(0, lastpose(text, ' ') - 1)

    if (Number.isFinite(parseInt(text.slice(lastpose(text, ' '), text.length)))) {
        arr.push(text.slice(lastpose(text, ' '), text.length))
        text = text.slice(0, lastpose(text, ' ') - 1)
    } else {
        arr.unshift(0)
    }

    arr.push(text)

    return arr

}

var trainCompain = function (arr) {
    let cout = ''
    arr.forEach(element => {
        cout += '\n' + element.name + '\t' + element.eCount + '\t' + element.rCount + '\t' + element.weight
    });
    return cout
}

const start = async () => {

    bot.on('message', async msg => {
        switch (msg.text) {

            case '/start': {
                try {
                    // client.query(`SELECT * FROM users WHERE id = ${msg.chat.id};`, (err, res) => {

                    //     if (!res){
                    client.query('INSERT INTO users (id) VALUES ($1)', [msg.chat.id])
                    //     }
                    // })
                } catch (e) {
                    console.log(e)
                }
                return bot.sendMessage(msg.chat.id, `Привіт`, botOptions.botmenu)
            }

            default:
                //console.log(msg.chat.id)

                function loadUserStage(id) {
                    return new Promise(function (resolve, reject) {
                        client.query(`SELECT * FROM users WHERE id = ${id};`, async (err, res) => {
                            for (let row of res.rows) {
                                stage = (parseInt(row.stage))
                                console.log('inside for stage ' + stage)
                            }
                            resolve(stage)
                        })

                    })
                }

                console.log('default')

                let promise = loadUserStage(msg.chat.id)

                promise.then(result => {
                    console.log(result)
                    if (stage == 2) {
                        console.log('stage 2')
                        let i = addArray.findIndex(item => item.id == msg.chat.id)
                        addArray[i].name = msg.text
                        client.query(`UPDATE users SET stage = 3 WHERE id = ${msg.chat.id};`, (err, res) => { })
                        bot.sendMessage(msg.chat.id, `Ваше тренування: \n${addArray[i].name}`, botOptions.botmenu)
                        return bot.sendMessage(msg.chat.id, `вводьте вправи в вигляді: \nНазва вправи -> к-сть повторень -> к-сть підходів -> вага (якщо є) \n    приклад:\nжим штанги лежа 12 3 40`, botOptions.addTrainClose)

                    }

                    if (stage == 3) {
                        let tempArr = trainMassageParse(msg.text)
                        let i = addArray.findIndex(item => item.id == msg.chat.id)
                        addArray[i].train.push({
                            name: tempArr[3],
                            eCount: tempArr[2],
                            rCount: tempArr[1],
                            weight: tempArr[0]

                        })
                        console.log(addArray[i].train)
                        return bot.sendMessage(msg.chat.id, `Ваше тренування: ${addArray[i].name} ${trainCompain(addArray[i].train)}`, botOptions.addTrain)
                    }
                }),
                    error => console.log(error);

        }
    })



    bot.on('callback_query', msg => {
        //chatid = msg.chat.id
        console.log(msg.message.chat.id)
        const data = msg.data
        console.log(data)
        // addTrainClose: {
        //     reply_markup: JSON.stringify({
        //         inline_keyboard: [
        //             [{ text: 'видалити останній рядок', callback_data: '/addDelete' }],
        //             [{ text: 'зберегти', callback_data: '/addSave' }],
        //             [{ text: 'вийти і видалити все', callback_data: '/addClose' }]
        //         ]
        //     })
        // }

        switch (msg.data) {

            case '/begin': {
                client.query(`SELECT * FROM tranings WHERE userid = ${msg.message.chat.id};`, (err, res) => {
                    if (err) throw err;
                    var i = 0
                    var inline_keyboard = []
                    for (let row of res.rows) {
                        inline_keyboard[i] = [{ text: row.name, callback_data: `/startTrain${row.id}` }]
                        i++
                    }

                    botOptions.trainingslist = {
                        reply_markup: JSON.stringify({ inline_keyboard })
                    }

                    console.log(inline_keyboard)
                    return bot.sendMessage(msg.message.chat.id, 'Оберіть тренування: ', botOptions.trainingslist)
                });
            }

            case '/add': {
                console.log('/add')
                client.query(`UPDATE users SET stage = 2 WHERE id = ${msg.message.chat.id};`, (err, res) => { })
                addArray.push({
                    id: msg.message.chat.id,
                    stage: 2,
                    train: []
                })
                return bot.sendMessage(msg.message.chat.id, `введи назву тренування:`, botOptions.addTrainClose)
            }

            case '/addDelete': {
                let i = addArray.findIndex(item => item.id == msg.message.chat.id)
                addArray[i].train.pop()
                return bot.sendMessage(msg.message.chat.id, `Ваше тренування: ${addArray[i].name} ${trainCompain(addArray[i].train)}`, botOptions.addTrain)
            }

            case '/addClose': {
                let i = addArray.findIndex(item => item.id == msg.message.chat.id)
                addArray.splice(i, 1)
                return bot.sendMessage(msg.message.chat.id, 'Привіт', botOptions.botmenu)
            }

            case '/addSave': {
                let i = addArray.findIndex(item => item.id == msg.message.chat.id)
                client.query('INSERT INTO tranings (userid, name, exercises) VALUES ($1, $2, $3)', [msg.message.chat.id, addArray[i].name, addArray[i].train])
                addArray.splice(i, 1)
                return bot.sendMessage(msg.message.chat.id, `Тренування записано !`, botOptions.botmenu)
            }

            case '/settings': {

            }

            default: {
                if (msg.data.startsWith('/startTrain')) {
                    let id = msg.data.slice(11)
                    var finalText = 'Ваше тренування: \nНазва вправи\tк-сть повторень\tк-сть підходів\tвага'
                    let promise = new Promise((resolve, reject) => {
                        client.query(`SELECT * FROM tranings WHERE id = ${id};`, (err, res) => {
                            var i = 0

                            for (let row of res.rows) {
                                for (let exercise of row.exercises) {
                                    finalText += `\n${exercise.name}\t${exercise.eCount}\t${exercise.rCount}`
                                    if (exercise.weight > 0)
                                        finalText += `\t${exercise.weight}`
                                }
                                console.log(row)
                            }
                            resolve(finalText)
                        })
                        // inline_keyboard[i] = [{ text: row.name, callback_data: `/train${row.id}` }]
                        // i++

                    }).then(resolve => {
                        var traininfo = { tid: id, tstage: 0 }
                        var inline_keyboard = []
                        inline_keyboard[0] = [{ text: 'продовжити', callback_data: `/training${JSON.stringify(traininfo)}` }, {text: 'назад', callback_data: '/begin'}]
                        botOptions.trainingStart = {
                            reply_markup: JSON.stringify({ inline_keyboard })
                        }
                        console.log(inline_keyboard)
                        return bot.sendMessage(msg.message.chat.id, resolve, botOptions.trainingStart)
                    })
                }
            }

                if (msg.data.startsWith('/training')) {
                    console.log('тут' + (msg.data.slice(9)))
                    traininfo = JSON.parse(msg.data.slice(9))
                    let id = traininfo.tid
                    let trstage = traininfo.tstage
                    console.log('id:' + id + '  ' + trstage)
                    let promise = new Promise((resolve, reject) => {
                        client.query(`SELECT * FROM tranings WHERE id = ${id};`, (err, res) => {
                            console.log('res rrows  '+res.rows[0].exercises)
                            if(res.rows[0].exercises[trstage] != undefined)
                            for (let row of res.rows) {
                                finalText = `\n${row.exercises[trstage].name}\t${row.exercises[trstage].eCount}\t${row.exercises[trstage].rCount}`
                                if (row.exercises[trstage].weight > 0)
                                    finalText += `\t${row.exercises[trstage].weight}`
                                console.log(finalText)
                            }
                            else return bot.sendMessage(msg.message.chat.id, 'Тренування завершено', botOptions.botmenu)
                            //inline_keyboard[0] = [{ text: 'продовжити', callback_data: `training${JSON.stringify(traininfo)}` }]
                            resolve(finalText)
                        })
                    }).then(resolve => {
                        var traininfo = { tid: id, tstage: trstage+1 }
                        var inline_keyboard = []
                        inline_keyboard[0] = [{ text: 'продовжити', callback_data: `/training${JSON.stringify(traininfo)}` }]
                        botOptions.trainingStart = {
                            reply_markup: JSON.stringify({ inline_keyboard })
                        }
                        return bot.sendMessage(msg.message.chat.id, finalText, botOptions.trainingStart)
                    })
                }
        }

    })
}

start()