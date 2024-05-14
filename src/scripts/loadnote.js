const fs = require('fs');
const path = require('path');

async function loadNote(noteName){
    var validated = await checkNoteExists(noteName);

    if (!validated){
        return "E004: No note exists.";
    }

    var noteContents = await loadNoteUsingFS(noteName);

    return JSON.stringify({"message" : "ok", "noteContents" : noteContents});
}

async function checkNoteExists(noteName){ //Checks if a note exists
    var notePath = path.resolve('src/notes/' + noteName);

    var exists = await new Promise ((resolve, reject) => {
        fs.stat(notePath, (err, stats) => {
            if (err) {
                console.log(`The file or directory at '${notePath}' does not exist.`);
                resolve(false);
            } else {
                console.log(`The file or directory at '${notePath}' exists.`);
                resolve(true);
            }
        });
    })

    if (!exists){
        return false;
    }

    return true;
}

async function loadNoteUsingFS(noteName){
    var notePath = path.resolve('src/notes/' + noteName);

    var contents = new Promise ((resolve, reject) => {
        fs.readFile(notePath, 'utf8', (err, noteContents) => {
            resolve(noteContents);
        });
    });

    return contents;
}

module.exports = { loadNote }