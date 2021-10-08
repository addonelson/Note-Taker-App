const express = require('express');
const dbNotes = require('./db/db.json');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('uuid');
const { json } = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const readFromFile = util.promisify(fs.readFile);
const app = express();
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


app.post("/api/notes", (req, res) => {
    console.log(`${req.method} request received new note added`);
    
    const { title, text, id } = req.body;

    if (title && text) {
        const note = {
            title,
            text,
            review_id: uuidv(),
        };

        const noteString = JSON.stringify(note);

        fs.appendFile("./db/db.json", noteString, (err) =>
            err ? console.error(err) : console.log(`Note ${note.title} has been written to JSON file`)
        );

        const response = {
            status: "Submitted",
            body: note,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(400).json('Your note had an error in posting the note');
    }
})

app.listen(PORT, () =>
    console.log(`You are listening on port ${PORT}!`)
);