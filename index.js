//läser in skit
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const sqlite = require('sqlite')
const uuidv4 = require('uuidv4')
app.use(function (request, result, next) {
    result.header('Access-Control-Allow-Origin', '*');
    result.header('Access-Control-Allow-Headers', 'Content-Type');
    result.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
//skapa databas
let database
//assign databas
sqlite.open('database/osbackend.sqlite').then(database_ => {
    database = database_
}) // Open DB end 

// load the day
app.get('/', (request, response) => {
    database.all('SELECT * FROM osx;', ).then(texten => {
        response.send(texten)
    }) // db all end
    response.status(201)
}) //db run close

// load the day
app.get('/createdBy/:namn', (request, response) => {
    database.all('SELECT * FROM osx WHERE createdBy=?;',
        [request.params.namn]
    ).then(texten => {
        response.send(texten)
    }) // db all end
    response.status(201)
}) //db run close

//post för att lägga till
app.post('/', (request, response) => {
    database.run('INSERT INTO osx VALUES (?,?)',
        [request.body.textSave, request.body.createdBy]
    ).then(() => {
        database.all('SELECT * FROM osx').then(texten => {
            response.send(texten)
        }) // db all end
        response.status(201)
    }) //db close
}) // app close


// put för att ändra 
app.put('/change/:name', (request, response) => {
    database.run('UPDATE osx SET textSave=? WHERE createdBy=?;',
        [request.body.textSave, request.params.name]
    ).then(() => {
        database.all('SELECT * FROM osx').then(texten => {
            response.send(texten)
        }) // db all end
        response.status(201)
    }) //db run close
}) // app del close

app.listen(3000)