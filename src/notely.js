const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();

const createnote = require('./scripts/createnote.js');
const savenote = require('./scripts/savenote.js');
const listnotes = require('./scripts/listnotes.js');
const loadnote = require('./scripts/loadnote.js');
const loadnoteview = require('./scripts/loadnoteview.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static(path.resolve('src/public')));
app.use('/media', express.static(path.resolve('src/public/media')));
app.use('/scripts', express.static(path.resolve('src/public/scripts')));
app.use('/styles', express.static(path.resolve('src/public/styles')));

app.use('/landing', express.static(path.resolve('src/public/pages/landing')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('src/public/pages/landing/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log("listening on", process.env.PORT);
});

app.use('/createnote', async function (req, res){
    var message = await createnote.createNote(req.body.noteName);

    res.json({"message" : message});
});

app.use('/savenote', async function (req, res){
    var message = await savenote.saveNote(req.body.noteName, req.body.noteText);

    res.json({"message" : message});
});

app.use('/listnotes', async function (req, res){
    var notes = await listnotes.listNotes();

    res.json(notes);
})

app.use('/loadnote', async function (req, res){
    var responsejson = await loadnote.loadNote(req.body.noteName);
    responsejson = JSON.parse(responsejson)

    if (responsejson.message != "ok"){
        res.json({"message" : responsejson.message});
        return;
    }

    res.json({"message" : "ok", "noteContents" : responsejson.noteContents});
})

app.use('/loadnoteview', async function (req, res){
    var notes = await loadnoteview.loadNoteView(req.body.name, req.body.tag);

    res.json(notes);
})