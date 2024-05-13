const fs = require('fs');
const path = require('path');

async function saveNote(noteName, noteText){
    var validated = await checkNoteExists(noteName);

    if (!validated){
        return "E004: No note exists.";
    }

    saveNoteUsingFS(noteName, noteText);

    return "I002: Note saved!";
}

async function checkNoteExists(noteName){ //Checks if a note exists
    var notePath = path.resolve('src/notes/' + noteName + ".txt");

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

async function saveNoteUsingFS(noteName, noteText){
    var notePath = path.resolve('src/notes/' + noteName + ".txt");

    fs.writeFile(notePath, noteText, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

module.exports = { saveNote }