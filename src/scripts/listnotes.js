const fs = require('fs');
const path = require('path');

async function listNotes(){
    var notes = await getAllNotes();

    return notes;
}

async function getAllNotes(){
    var notes = new Promise ((resolve, reject) => {
        fs.readdir("src/notes", (err, files) => {
            resolve(files);
        });
    });

    return notes;
}

module.exports = { listNotes }