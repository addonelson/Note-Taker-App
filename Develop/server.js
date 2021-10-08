const express = require('express');
const dbNotes = require('./db/db.json');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('./public/helpers/uuid');
const { json } = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const readFromFile = util.promisify(fs.readFile);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const takenNotesArray =[];

 //app.get are requests for notes routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});
//app.get are for api/notes routes .then promise to recieve data then takes response and returns Json then parse then data
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

const contentWrite = (contentDestination, content) => 
fs.writeFile(contentDestination, JSON.stringify(content, null, 4), (err) =>
err ? console.error(err) : console.info(`\nData written to ${contentDestination}`)
);

// function  which will read data from json the file
const appendFile = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            contentWrite(file, parsedData);
        }
    });
};

// post route to allow new submissions which will append them to the json file.
app.post('/api/notes', (req, res) => {
    // destructuring body
    const { title, text } = req.body;
    if (req.body) {
        const newUserNote = {
            title,
            text,
            id: uuid(),
        };
        appendFile(newUserNote, './db/db.json');
        takenNotesArray.push(newUserNote)
        console.log(takenNotesArray);
        res.json(`Your note has been added`);
    } else {
        res.error('We had an issue adding your note');
    }
});


// This route should allow users to delete previously added notes.
app.delete(`/api/notes/:id`, (req, res) => {
    fs.readFile("./db/db.json", "utf-8", function (err, data) {

    const takenNotesArray = JSON.parse(data);

    for (let i = 0; i < takenNotesArray.length; i++) {
        if (takenNotesArray[i].id === req.params.id) {
            takenNotesArray.splice(i, 1)
            
            break;
        }
    }
    contentWrite("./db/db.json", takenNotesArray); // file will now be changed to support the deleted file. 
    res.json(takenNotesArray)
});
});

// get request that will return html file 
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// listens for server port location. Will log the port location in the console. 

app.listen(PORT, () =>
    console.log(`You are listening on port ${PORT}!`)
);