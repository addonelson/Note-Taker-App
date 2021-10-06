const express = require('express');
const dbNotes = require('./db/db.json');
const pathname = require('path');
const fs = require('fs');


const PORT = 3001;
const app = express();

const uuidv =  () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(dbNotes));


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