var eventType = {
    clear: 1,
	down: 2,
	up: 3,
    move : 4,
    brush: 5
}

// time: UInt32 (4 bytes)
// x: UInt16 (2 bytes)
// y: UInt16 (2 bytes)
// colour: UInt32 (4 bytes, rgba)
// width: UInt8 (1 byte)
var eventTypes = {
    1 : [ 'time' ],
    4 : [ 'time', 'x', 'y'],
    5 : [ 'time', 'colour', 'width']
}
function encodeEvent(eventTypeName, ...eventProps) {
    if (eventTypes[eventTypeName].length == eventProps.length) {
        for (var i = 0; i < eventProps.length; i++){
            if ((eventProps[i]) > Math.pow(4, 64)){
               throw(`Tried to store data greater than 4 bytes (value ${eventProps[i]}) in event ${eventTypeName}`)
            }
        }

        data.push(eventTypeName) 
        data.push(...eventProps)
    } else {
        throw(`attemped to store event with invalid number of arguments`)
    }
}

function move(time,x,y) {
    pushInt(eventType.move)
    pushInt(time)
    pushInt(x)
    pushInt(y)
}
function clear(time){
    pushInt(eventType.clear)
    pushInt(time)
}

var data = []

encodeEvent(eventType.clear, 0)
var time = 10
for (var i = 0; i < 1000; i++){
    time += Math.random() * 100
    encodeEvent(eventType.move, time, Math.random() * 1000, Math.random() * 1000)
}
encodeEvent(eventType.clear, 3)

var byteData = Uint32Array.from(data)
console.log(byteData)
function parse(byteData){
    var originalArray = Array.from(byteData)

    var index = 0
    while (index < originalArray.length) {
        var type = originalArray[index]
        var eventProperties = originalArray.slice(index+1, index + eventTypes[type].length + 1 )
        // console.log(Object.keys(eventType)[type-1])
        var i = 0
        for (prop of eventTypes[type]){
            // console.log(prop + " : " + eventProperties[i])
            i++
        }
        // console.log('\n')

        index += eventTypes[type].length + 1
    }
}
parse(byteData)
console.log(byteData.length)
