
let addArray = []

addArray.push({
    id: 1244212,
    stage: 4,
    train: [
        {
            name: 'анжуманія',
            eCount: 15,
            rCount: 3,
            weight: 0
        }
    ]
})

addArray.push({
    id: 1224232,
    stage: 3,
    train: [
        {
            name: 'присіданія',
            eCount: 40,
            rCount: 2,
            weight: 0
        }
    ]
})

addArray.push({
    id: 1234978,
    stage: 8,
    train: [
        {
            name: 'прижиманія',
            eCount: 20,
            rCount: 5,
            weight: 0
        }
    ]
})

addArray.push({
    id: 9764212,
    stage: 1,
    train: [
        {
            name: 'турнік',
            eCount: 10,
            rCount: 5,
            weight: 15
        }
    ]
})

addArray.push({
    id: 1966712,
    stage: 7,
    train: [
        { name: 'падлєтанія', eCount: 99, rCount: 99, weight: 999 },
        { name: 'турнік', eCount: 10, rCount: 5, weight: 15 },
        { name: 'турнік приколдессний', eCount: 15, rCount: 52, weight: 0 },
        { name: 'турнік', eCount: 10, rCount: 5, weight: 15 }
    ]
})
//}

let i = addArray.find(item => item.id == 9764212)
let x = addArray.findIndex(item => item.id == 9764212)

//console.log(i)
//console.log(x)
let k = 'as1asda'

// console.log(parseInt('1'))
// console.log(parseInt('a'))
// console.log(parseInt(k[2]))

var name, c1, c2, c3

console.log('0123456789'.slice(5))

// let lastpose = function (msg,target) {
//     var text = msg
//     var pos
//     for (var n = 0; n < text.length; n++) {
//         if (text[n] = ' ')
//         pos=n
//     }
//     return pos-1
// }

let trainMassageParse = function (msg) {
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

    console.log(text.slice(lastpose(text, ' '), text.length))
    arr.push(text.slice(lastpose(text, ' '), text.length))
    text = text.slice(0, lastpose(text, ' ') - 1)
    console.log(text)

    console.log(text.slice(lastpose(text, ' '), text.length))
    arr.push(text.slice(lastpose(text, ' '), text.length))
    text = text.slice(0, lastpose(text, ' ') - 1)

    console.log('huita:', parseInt(text.slice(lastpose(text, ' '), text.length)))

    if (Number.isFinite(parseInt(text.slice(lastpose(text, ' '), text.length)))) {
        console.log('doshlo', text.slice(lastpose(text, ' '), text.length))
        arr.push(text.slice(lastpose(text, ' '), text.length))
        text = text.slice(0, lastpose(text, ' ') - 1)
    }

    console.log(text)
    arr.push(text)

    return arr

}

var trainCompain = function (arr) {
    let cout =''
    // name: 'прижиманія',
    //         eCount: 20,
    //         rCount: 5,
    //         weight: 0
    arr.forEach(element => {
        cout +='\n' + element.name + ' ' + element.eCount + ' ' + element.rCount + ' ' + element.weight 
    });
    return cout
}


// console.log(trainMassageParse('kakakakakasiki kalopi gagakiki 52 46'))

// console.log(trainMassageParse('kakakakakasiki tatapiki gagakiki 79 22 01'))

// console.log(trainMassageParse('kakakakakasiki moirep jjjda gagakiki 29 79'))

// console.log(trainMassageParse('kakapppasiki kalopi gagakiki 58 71 64'))

var a = [1, 2, 3, 4, 5, 6, 7, 8, 9]

a.unshift(50)
// a[0] = 50
// console.log(a)

console.log(trainCompain(addArray[4].train))

