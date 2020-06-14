const websocket = require('ws')

const wss = new websocket.Server({port: 10101})


wss.on('connection', function connection (ws, req) {
    ws.on('open', open => {
        console.log('Connected')
        ws.send(`{ "message": ${Date.now()}`)
    })
    ws.on('message', message => {
        message = JSON.parse(message);
        console.log(message.event)
        if(message.ok == 'ok') {
            console.log('ok')
        }
        if(message.event == 'user') {
            ws.send('{ "name": "kmx", "type": "combobox", "data": [{"volume": "100"}]}')
        }
        if(message.event == 'message') {
            console.log(`Received message ${message}`)
        }
        console.log(message);
    })

    ws.on('close', close => {
        console.log('Disconnected')
    })

    ws.on('user', user => {
        user.send('ok')
    })
    ws.send('{ "message": "Вы подключились к серверу" }', req)

})
